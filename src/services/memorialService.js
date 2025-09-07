import { supabase } from '../lib/supabase';

class MemorialService {
  async createMemorial(memorialData) {
    try {
      const { data, error } = await supabase?.from('memorials')?.insert([memorialData])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to create memorial' } };
    }
  }

  async getMemorial(id) {
    try {
      const { data, error } = await supabase?.from('memorials')?.select(`
          *,
          memorial_images (
            id,
            image_url,
            caption,
            display_order,
            is_primary
          ),
          tributes (
            id,
            author_name,
            tribute_type,
            content,
            image_url,
            created_at,
            is_approved,
            is_featured
          ),
          creator: created_by (
            full_name,
            email,
            role
          )
        `)?.eq('id', id)?.eq('tributes.is_approved', true)?.order('display_order', { foreignTable: 'memorial_images' })?.order('created_at', { foreignTable: 'tributes', ascending: false })?.single();

      if (error && error?.code === 'PGRST116') {
        return { data: null, error: { message: 'Memorial not found' } };
      }
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to fetch memorial' } };
    }
  }

  async updateMemorial(id, updates) {
    try {
      const { data, error } = await supabase?.from('memorials')?.update(updates)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to update memorial' } };
    }
  }

  async deleteMemorial(id) {
    try {
      const { error } = await supabase?.from('memorials')?.delete()?.eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message || 'Failed to delete memorial' } };
    }
  }

  async getMemorialsByUser(userId) {
    try {
      const { data, error } = await supabase?.from('memorials')?.select(`
          *,
          memorial_images!left (
            image_url,
            is_primary
          ),
          tributes!left (
            id
          )
        `)?.eq('created_by', userId)?.order('created_at', { ascending: false });

      if (error) throw error;

      // Process data to add tribute count and main image
      const processedData = data?.map(memorial => ({
        ...memorial,
        tribute_count: memorial?.tributes?.length || 0,
        main_image: memorial?.memorial_images?.find(img => img?.is_primary)?.image_url || 
                   memorial?.memorial_images?.[0]?.image_url || memorial?.main_image_url
      }));

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to fetch memorials' } };
    }
  }

  async searchMemorials(query, filters = {}) {
    try {
      let supabaseQuery = supabase?.from('memorials')?.select(`
          *,
          memorial_images!left (
            image_url,
            is_primary
          )
        `)?.eq('privacy', 'public');

      if (query) {
        supabaseQuery = supabaseQuery?.or(`full_name.ilike.%${query}%,occupation.ilike.%${query}%,biography.ilike.%${query}%`);
      }

      if (filters?.location) {
        supabaseQuery = supabaseQuery?.ilike('birth_location', `%${filters?.location}%`);
      }

      if (filters?.dateRange?.start && filters?.dateRange?.end) {
        supabaseQuery = supabaseQuery?.gte('birth_date', filters?.dateRange?.start);
        supabaseQuery = supabaseQuery?.lte('birth_date', filters?.dateRange?.end);
      }

      const { data, error } = await supabaseQuery?.order('created_at', { ascending: false })?.limit(50);

      if (error) throw error;

      // Process data to add main image
      const processedData = data?.map(memorial => ({
        ...memorial,
        main_image: memorial?.memorial_images?.find(img => img?.is_primary)?.image_url || 
                   memorial?.memorial_images?.[0]?.image_url || memorial?.main_image_url
      }));

      return { data: processedData, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to search memorials' } };
    }
  }

async getFeaturedMemorials() {
  try {
    const { data, error } = await supabase
      .from('memorials')
      .select(`
        *,
        memorial_images!left (
          image_url,
          is_primary
        )
      `)
      .eq('privacy', 'public')
      .eq('is_featured', true)
      .order('view_count', { ascending: false })
      .limit(6);

    if (error) throw error;

    // Transform data to match component expectations
    const processedData = data?.map(memorial => ({
      id: memorial.id,
      name: memorial.full_name,  // Transform to expected name
      full_name: memorial.full_name, // Keep original too
      birthDate: memorial.birth_date, // Transform
      deathDate: memorial.death_date, // Transform
      profileImage: memorial.main_image || 
                   memorial.memorial_images?.find(img => img.is_primary)?.image_url ||
                   memorial.memorial_images?.[0]?.image_url,
      visitCount: memorial.view_count, // Transform
      photoCount: memorial.memorial_images?.length || 0,
      // Add other transformed fields as needed
    }));

    return { data: processedData, error: null };
  } catch (error) {
    return { data: null, error: { message: error?.message || 'Failed to fetch featured memorials' } };
  }
}

  async incrementViewCount(memorialId) {
    try {
      const { error } = await supabase?.rpc('increment_memorial_views', {
        memorial_uuid: memorialId
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message || 'Failed to update view count' } };
    }
  }

  async uploadMemorialImage(memorialId, file, caption = '', isPrimary = false) {
    try {
      // Generate unique filename
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${memorialId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('memorial-images')?.upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase?.storage?.from('memorial-images')?.getPublicUrl(fileName);

      // Save image record to database
      const { data: imageData, error: dbError } = await supabase?.from('memorial_images')?.insert({
          memorial_id: memorialId,
          image_url: urlData?.publicUrl,
          caption: caption,
          is_primary: isPrimary,
          display_order: 0
        })?.select()?.single();

      if (dbError) throw dbError;

      return { data: imageData, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to upload image' } };
    }
  }

  async deleteMemorialImage(imageId) {
    try {
      // Get image info first
      const { data: imageInfo, error: fetchError } = await supabase?.from('memorial_images')?.select('image_url')?.eq('id', imageId)?.single();

      if (fetchError) throw fetchError;

      // Extract filename from URL
      const fileName = imageInfo?.image_url?.split('/')?.pop();

      // Delete from storage
      const { error: storageError } = await supabase?.storage?.from('memorial-images')?.remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase?.from('memorial_images')?.delete()?.eq('id', imageId);

      if (dbError) throw dbError;

      return { error: null };
    } catch (error) {
      return { error: { message: error?.message || 'Failed to delete image' } };
    }
  }

  async createTribute(tributeData) {
    try {
      const { data, error } = await supabase?.from('tributes')?.insert([tributeData])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to create tribute' } };
    }
  }

  async getRecentActivity(userId, limit = 10) {
    try {
      const { data, error } = await supabase?.from('tributes')?.select(`
          id,
          content,
          author_name,
          created_at,
          memorial_id,
          memorials (
            full_name,
            main_image_url
          )
        `)?.in('memorial_id', 
          supabase?.from('memorials')?.select('id')?.eq('created_by', userId)
        )?.eq('is_approved', true)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to fetch recent activity' } };
    }
  }

  async getDashboardStats(userId) {
    try {
      // Get memorial count
      const { count: memorialCount, error: memorialError } = await supabase?.from('memorials')?.select('*', { count: 'exact', head: true })?.eq('created_by', userId);

      if (memorialError) throw memorialError;

      // Get total views
      const { data: viewData, error: viewError } = await supabase?.from('memorials')?.select('view_count')?.eq('created_by', userId);

      if (viewError) throw viewError;

      const totalViews = viewData?.reduce((sum, memorial) => sum + (memorial?.view_count || 0), 0) || 0;

      // Get tribute count
      const { count: tributeCount, error: tributeError } = await supabase?.from('tributes')?.select('*', { count: 'exact', head: true })?.in('memorial_id',
          supabase?.from('memorials')?.select('id')?.eq('created_by', userId)
        );

      if (tributeError) throw tributeError;

      return {
        data: {
          memorialCount: memorialCount || 0,
          totalViews: totalViews,
          tributeCount: tributeCount || 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to fetch dashboard stats' } };
    }
  }
}

export default new MemorialService();