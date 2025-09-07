-- Location: supabase/migrations/20250906232811_memorial_management_system.sql
-- Schema Analysis: Fresh project with no existing schema
-- Integration Type: Complete schema creation for Memorial Management System
-- Dependencies: None (fresh project)

-- 1. Extensions & Types (with public qualification)
CREATE TYPE public.user_role AS ENUM ('admin', 'family', 'friend', 'caregiver');
CREATE TYPE public.memorial_privacy AS ENUM ('public', 'private', 'family_only');
CREATE TYPE public.memorial_template AS ENUM ('classic', 'modern', 'elegant', 'minimal');
CREATE TYPE public.tribute_type AS ENUM ('message', 'photo', 'video', 'story', 'poem');

-- 2. Core tables (no foreign keys)
-- Critical intermediary table for auth relationships
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'family'::public.user_role,
    avatar_url TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dependent tables (with foreign keys to existing tables only)
-- Memorial management table
CREATE TABLE public.memorials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    death_date DATE NOT NULL,
    birth_location TEXT,
    resting_place TEXT,
    relationship TEXT NOT NULL,
    biography TEXT NOT NULL,
    occupation TEXT,
    hobbies TEXT,
    favorite_quote TEXT,
    template public.memorial_template DEFAULT 'classic'::public.memorial_template,
    privacy public.memorial_privacy DEFAULT 'public'::public.memorial_privacy,
    main_image_url TEXT,
    cover_image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_dates CHECK (birth_date < death_date),
    CONSTRAINT biography_length CHECK (char_length(biography) >= 50)
);

-- Memorial images gallery
CREATE TABLE public.memorial_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tributes/messages from visitors
CREATE TABLE public.tributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    tribute_type public.tribute_type DEFAULT 'message'::public.tribute_type,
    content TEXT NOT NULL,
    image_url TEXT,
    is_approved BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Memorial sharing and notifications
CREATE TABLE public.memorial_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    shared_with_email TEXT,
    share_message TEXT,
    access_token TEXT UNIQUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_memorials_created_by ON public.memorials(created_by);
CREATE INDEX idx_memorials_privacy ON public.memorials(privacy);
CREATE INDEX idx_memorials_featured ON public.memorials(is_featured) WHERE is_featured = true;
CREATE INDEX idx_memorials_search ON public.memorials USING gin((full_name || ' ' || occupation) gin_trgm_ops);
CREATE INDEX idx_memorial_images_memorial_id ON public.memorial_images(memorial_id);
CREATE INDEX idx_memorial_images_primary ON public.memorial_images(memorial_id, is_primary) WHERE is_primary = true;
CREATE INDEX idx_tributes_memorial_id ON public.tributes(memorial_id);
CREATE INDEX idx_tributes_approved ON public.tributes(memorial_id, is_approved) WHERE is_approved = true;
CREATE INDEX idx_memorial_shares_memorial_id ON public.memorial_shares(memorial_id);
CREATE INDEX idx_memorial_shares_token ON public.memorial_shares(access_token);

-- 5. Functions (with proper schema qualification) - MUST BE BEFORE RLS POLICIES
-- Automatic timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'family'::public.user_role)
    );
    RETURN NEW;
END;
$$;

-- Function to increment memorial view count
CREATE OR REPLACE FUNCTION public.increment_memorial_views(memorial_uuid UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
    UPDATE public.memorials 
    SET view_count = view_count + 1 
    WHERE id = memorial_uuid;
$$;

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_shares ENABLE ROW LEVEL SECURITY;

-- 7. RLS policies (can now reference functions created in step 5)

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for memorials
CREATE POLICY "users_manage_own_memorials"
ON public.memorials
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Pattern 4: Public read, private write for memorials
CREATE POLICY "public_can_read_public_memorials"
ON public.memorials
FOR SELECT
TO public
USING (privacy = 'public'::public.memorial_privacy);

-- Family-only memorials visible to family and friends
CREATE POLICY "family_can_read_family_memorials"
ON public.memorials
FOR SELECT
TO authenticated
USING (
    privacy = 'family_only'::public.memorial_privacy 
    AND EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('family'::public.user_role, 'admin'::public.user_role)
    )
);

-- Pattern 2: Memorial images - users manage images for their memorials
CREATE POLICY "users_manage_memorial_images"
ON public.memorial_images
FOR ALL
TO authenticated
USING (
    memorial_id IN (
        SELECT m.id FROM public.memorials m 
        WHERE m.created_by = auth.uid()
    )
)
WITH CHECK (
    memorial_id IN (
        SELECT m.id FROM public.memorials m 
        WHERE m.created_by = auth.uid()
    )
);

-- Public can view images for public memorials
CREATE POLICY "public_can_view_public_memorial_images"
ON public.memorial_images
FOR SELECT
TO public
USING (
    memorial_id IN (
        SELECT m.id FROM public.memorials m 
        WHERE m.privacy = 'public'::public.memorial_privacy
    )
);

-- Pattern 4: Public read, authenticated write for tributes
CREATE POLICY "public_can_read_approved_tributes"
ON public.tributes
FOR SELECT
TO public
USING (
    is_approved = true 
    AND memorial_id IN (
        SELECT m.id FROM public.memorials m 
        WHERE m.privacy = 'public'::public.memorial_privacy
    )
);

-- Authenticated users can create tributes
CREATE POLICY "authenticated_can_create_tributes"
ON public.tributes
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can manage their own tributes
CREATE POLICY "users_manage_own_tributes"
ON public.tributes
FOR UPDATE, DELETE
TO authenticated
USING (author_id = auth.uid());

-- Memorial owners can manage all tributes on their memorials
CREATE POLICY "memorial_owners_manage_tributes"
ON public.tributes
FOR ALL
TO authenticated
USING (
    memorial_id IN (
        SELECT m.id FROM public.memorials m 
        WHERE m.created_by = auth.uid()
    )
)
WITH CHECK (
    memorial_id IN (
        SELECT m.id FROM public.memorials m 
        WHERE m.created_by = auth.uid()
    )
);

-- Pattern 2: Memorial shares - users manage shares for their memorials
CREATE POLICY "users_manage_memorial_shares"
ON public.memorial_shares
FOR ALL
TO authenticated
USING (
    memorial_id IN (
        SELECT m.id FROM public.memorials m 
        WHERE m.created_by = auth.uid()
    )
)
WITH CHECK (
    memorial_id IN (
        SELECT m.id FROM public.memorials m 
        WHERE m.created_by = auth.uid()
    )
);

-- 8. Storage buckets for memorial images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'memorial-images',
    'memorial-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Storage RLS policies
-- Public can view memorial images
CREATE POLICY "public_can_view_memorial_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memorial-images');

-- Authenticated users can upload memorial images
CREATE POLICY "authenticated_can_upload_memorial_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'memorial-images'
    AND owner = auth.uid()
);

-- Users can manage their own uploaded images
CREATE POLICY "users_manage_own_memorial_images"
ON storage.objects
FOR UPDATE, DELETE
TO authenticated
USING (bucket_id = 'memorial-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'memorial-images' AND owner = auth.uid());

-- 9. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_memorials_updated_at
    BEFORE UPDATE ON public.memorials
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 10. Complete Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    family_uuid UUID := gen_random_uuid();
    friend_uuid UUID := gen_random_uuid();
    memorial1_uuid UUID := gen_random_uuid();
    memorial2_uuid UUID := gen_random_uuid();
    memorial3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@memorial.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Memorial Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (family_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sarah.johnson@email.com', crypt('family123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "family"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (friend_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'friend@example.com', crypt('friend123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dear Friend", "role": "friend"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create memorials
    INSERT INTO public.memorials (
        id, created_by, full_name, birth_date, death_date, birth_location, resting_place,
        relationship, biography, occupation, hobbies, favorite_quote, template, privacy,
        main_image_url, is_featured, view_count
    ) VALUES
        (memorial1_uuid, family_uuid, 'Robert Johnson', '1935-04-15', '2023-12-10', 
         'Springfield, Illinois', 'Graceland Cemetery, Springfield', 'Beloved Father',
         'Robert Johnson was a loving father, devoted husband, and pillar of our community. He dedicated his life to education, teaching high school mathematics for over 40 years. His passion for learning and helping others shaped countless young minds. Robert believed in the power of education to transform lives and never stopped encouraging his students to reach for their dreams. He was known for his gentle wisdom, infectious laughter, and unwavering support for his family and friends.',
         'High School Mathematics Teacher', 'Gardening, Chess, Reading Classic Literature',
         'The best teachers are those who show you where to look but do not tell you what to see.',
         'classic'::public.memorial_template, 'public'::public.memorial_privacy,
         '/images/memorials/robert-johnson.jpg', true, 127),
        (memorial2_uuid, family_uuid, 'Eleanor Marie Davis', '1940-08-22', '2024-01-05',
         'Chicago, Illinois', 'Rose Hill Cemetery, Chicago', 'Cherished Mother',
         'Eleanor Marie Davis lived a life filled with love, creativity, and service to others. As a professional nurse for 35 years, she touched countless lives with her compassion and skill. Eleanor was also an accomplished artist, creating beautiful watercolor paintings that captured the essence of nature. She volunteered at the local animal shelter and was passionate about environmental conservation. Her legacy lives on through the many lives she saved and the beauty she brought into the world.',
         'Registered Nurse and Artist', 'Watercolor Painting, Animal Rescue, Environmental Conservation',
         'Life is not about waiting for the storm to pass, but learning to dance in the rain.',
         'modern'::public.memorial_template, 'public'::public.memorial_privacy,
         '/images/memorials/eleanor-davis.jpg', true, 89),
        (memorial3_uuid, admin_uuid, 'Michael Christopher Brown', '1965-03-12', '2023-11-28',
         'Los Angeles, California', 'Forest Lawn Memorial Park', 'Dear Friend and Colleague',
         'Michael Christopher Brown was a brilliant software engineer and entrepreneur who founded three successful technology companies. His innovative spirit and dedication to excellence inspired everyone around him. Michael was also a devoted mentor to young engineers, believing that sharing knowledge was the greatest gift one could give. He loved hiking in the mountains, playing guitar, and spending time with his rescue dogs. His vision for using technology to solve meaningful problems will continue to influence the industry for years to come.',
         'Software Engineer and Entrepreneur', 'Mountain Hiking, Guitar Playing, Dog Rescue',
         'Innovation distinguishes between a leader and a follower.',
         'elegant'::public.memorial_template, 'family_only'::public.memorial_privacy,
         '/images/memorials/michael-brown.jpg', false, 45);

    -- Create memorial images
    INSERT INTO public.memorial_images (memorial_id, uploaded_by, image_url, caption, display_order, is_primary) VALUES
        (memorial1_uuid, family_uuid, '/images/gallery/robert-1.jpg', 'Robert in his classroom, 1985', 1, true),
        (memorial1_uuid, family_uuid, '/images/gallery/robert-2.jpg', 'Family vacation, Summer 2020', 2, false),
        (memorial1_uuid, family_uuid, '/images/gallery/robert-3.jpg', 'Retirement celebration, 2015', 3, false),
        (memorial2_uuid, family_uuid, '/images/gallery/eleanor-1.jpg', 'Eleanor with her watercolor paintings', 1, true),
        (memorial2_uuid, family_uuid, '/images/gallery/eleanor-2.jpg', 'Volunteering at the animal shelter', 2, false),
        (memorial3_uuid, admin_uuid, '/images/gallery/michael-1.jpg', 'Michael at company launch, 2018', 1, true),
        (memorial3_uuid, admin_uuid, '/images/gallery/michael-2.jpg', 'Hiking in Yosemite', 2, false);

    -- Create tributes
    INSERT INTO public.tributes (memorial_id, author_id, author_name, author_email, tribute_type, content, is_approved, is_featured) VALUES
        (memorial1_uuid, friend_uuid, 'Dear Friend', 'friend@example.com', 'message'::public.tribute_type,
         'Mr. Johnson was the best teacher I ever had. He made math fun and always believed in his students. Thank you for everything you taught me.',
         true, true),
        (memorial1_uuid, null, 'Former Student', 'student@example.com', 'story'::public.tribute_type,
         'I still remember the day Mr. Johnson helped me understand calculus. His patience and dedication changed my life. I became an engineer because of his inspiration.',
         true, false),
        (memorial2_uuid, admin_uuid, 'Memorial Admin', 'admin@memorial.com', 'message'::public.tribute_type,
         'Eleanor was a beacon of hope and healing. Her artistic spirit and caring heart made the world a more beautiful place.',
         true, true),
        (memorial3_uuid, family_uuid, 'Sarah Johnson', 'sarah.johnson@email.com', 'message'::public.tribute_type,
         'Michael was not just a brilliant mind but also a kind soul. His mentorship meant everything to me and countless others.',
         true, false);

    -- Create memorial shares
    INSERT INTO public.memorial_shares (memorial_id, shared_by, shared_with_email, share_message, access_token, expires_at) VALUES
        (memorial1_uuid, family_uuid, 'relative@example.com', 'I wanted you to see this beautiful memorial for Dad.', 
         'share_' || encode(gen_random_bytes(16), 'hex'), NOW() + INTERVAL '30 days'),
        (memorial2_uuid, family_uuid, 'colleague@hospital.com', 'Eleanor touched so many lives. Please feel free to leave a tribute.',
         'share_' || encode(gen_random_bytes(16), 'hex'), NOW() + INTERVAL '30 days');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- Cleanup function for test data
CREATE OR REPLACE FUNCTION public.cleanup_memorial_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email IN ('admin@memorial.com', 'sarah.johnson@email.com', 'friend@example.com');

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.memorial_shares WHERE shared_by = ANY(auth_user_ids_to_delete);
    DELETE FROM public.tributes WHERE author_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.memorial_images WHERE uploaded_by = ANY(auth_user_ids_to_delete);
    DELETE FROM public.memorials WHERE created_by = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;