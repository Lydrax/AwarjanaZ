import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import MemorialBreadcrumb from '../../components/ui/MemorialBreadcrumb';
import MemorialHeader from './components/MemorialHeader';
import PhotoGallery from './components/PhotoGallery';
import BiographySection from './components/BiographySection';
import TributeSection from './components/TributeSection';
import ShareSection from './components/ShareSection';


import memorialService from '../../services/memorialService';

const MemorialPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  const [memorial, setMemorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  // Add missing tributes state
  const [tributes, setTributes] = useState([]);
  
  // Check if this is preview mode or has memorial ID
  const isPreview = location?.state?.isPreview;
  const previewData = location?.state?.previewData;
  const memorialId = location?.state?.memorialId || location?.pathname?.split('/')?.pop();
  const isNewlyCreated = location?.state?.isNewlyCreated;

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com"
  };

  // Mock memorial data
  const mockMemorial = {
    id: memorialId || '1',
    full_name: "Robert William Thompson",
    birth_date: "1945-03-15",
    death_date: "2024-08-20",
    birth_location: "Springfield, Illinois",
    resting_place: "Springfield, Illinois",
    relationship: "Retired High School Principal",
    biography: `Robert William Thompson was born on March 15, 1945, in Springfield, Illinois, to Mary and James Thompson. He was the eldest of three children and showed early signs of leadership and compassion that would define his entire life.

After graduating from Springfield High School in 1963, Robert attended the University of Illinois, where he earned his Bachelor's degree in Education in 1967. It was during his college years that he met the love of his life, Margaret "Peggy" Davis, at a campus dance. They married in 1969 and were blessed with 55 wonderful years together.

Robert began his career as a mathematics teacher at Lincoln Middle School, where his patience and innovative teaching methods quickly made him a favorite among students and colleagues alike. His dedication to education and natural leadership abilities led to his promotion to Assistant Principal in 1978, and eventually to Principal of Roosevelt High School in 1985, a position he held with distinction for 25 years until his retirement in 2010.

Throughout his career, Robert was known for his open-door policy, his ability to connect with students from all backgrounds, and his unwavering belief that every child deserved a quality education. He implemented numerous programs that improved graduation rates and college enrollment, leaving a lasting impact on thousands of students' lives.

Beyond his professional achievements, Robert was a devoted family man. He and Peggy raised three children: Michael, Jennifer, and David. He was incredibly proud of his role as grandfather to seven grandchildren, often spending weekends at soccer games, school plays, and family gatherings.

Robert had a passion for woodworking and spent countless hours in his garage workshop, creating beautiful furniture pieces for family and friends. He was also an avid gardener, known throughout the neighborhood for his prize-winning tomatoes and his willingness to share both his harvest and his gardening wisdom.

His community involvement was extensive. He served on the Springfield City Council for eight years, volunteered at the local food bank, and was a longtime member of First Presbyterian Church, where he served as an elder and taught Sunday school for over two decades.

Robert's legacy lives on through the countless lives he touched as an educator, the family he loved so deeply, and the community he served with such dedication. His kindness, wisdom, and gentle spirit will be remembered and cherished by all who knew him.`,
    occupation: "Retired High School Principal",
    hobbies: "Woodworking, Gardening",
    favorite_quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    template: "default",
    privacy: "public",
    memorial_images: [
      {
        id: '1',
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face",
        caption: "Robert at his retirement celebration, 2010",
        is_primary: true,
        display_order: 0
      },
      {
        id: '2',
        image_url: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=800&h=600&fit=crop",
        caption: "Family vacation at Lake Michigan, 1985",
        is_primary: false,
        display_order: 1
      },
      {
        id: '3',
        image_url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
        caption: "Working in his beloved garden",
        is_primary: false,
        display_order: 2
      },
      {
        id: '4',
        image_url: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=800&h=600&fit=crop",
        caption: "Teaching at Roosevelt High School, 1990s",
        is_primary: false,
        display_order: 3
      },
      {
        id: '5',
        image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
        caption: "Wedding day with Peggy, June 21, 1969",
        is_primary: false,
        display_order: 4
      },
      {
        id: '6',
        image_url: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=800&h=600&fit=crop",
        caption: "With grandchildren at Christmas, 2023",
        is_primary: false,
        display_order: 5
      },
      {
        id: '7',
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop",
        caption: "Woodworking in his garage workshop",
        is_primary: false,
        display_order: 6
      },
      {
        id: '8',
        image_url: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?w=800&h=600&fit=crop",
        caption: "City Council service recognition, 2008",
        is_primary: false,
        display_order: 7
      }
    ],
    view_count: 1247,
    created_at: new Date()?.toISOString(),
    isPreview: false
  };

  // Mock tributes data
  const mockTributes = [
    {
      id: 1,
      name: "Margaret Thompson",
      relationship: "Wife",
      message: `My beloved Bob was the most wonderful husband, father, and grandfather anyone could ask for. His gentle spirit, unwavering faith, and endless love for his family defined every day of our 55 years together. He had a way of making everyone feel special and valued. I will miss his morning coffee ritual, his terrible dad jokes, and the way he hummed while working in his garden. Until we meet again, my love.`,
      createdAt: "2024-08-25T10:30:00Z",
      isApproved: true
    },
    {
      id: 2,
      name: "Jennifer Thompson-Martinez",
      relationship: "Daughter",
      message: `Dad was my hero and my biggest supporter. He never missed a school play, soccer game, or important moment in my life. Even as an adult, I could always count on his wise advice and warm hugs. He taught me the importance of education, kindness, and standing up for what's right. His legacy lives on in all of us who were lucky enough to call him Dad.`,
      createdAt: "2024-08-24T15:45:00Z",
      isApproved: true
    },
    {
      id: 3,
      name: "Dr. Patricia Williams",
      relationship: "Former Colleague",
      message: `Principal Thompson was a mentor and friend to so many of us in education. His door was always open, and he had an incredible ability to see the potential in every student and teacher. The programs he implemented at Roosevelt High changed countless lives. His dedication to education and his students was truly inspiring. The education community has lost a giant.`,
      createdAt: "2024-08-23T09:15:00Z",
      isApproved: true
    },
    {
      id: 4,
      name: "Michael Chen",
      relationship: "Former Student",
      message: `Mr. Thompson was my principal when I was going through a really tough time in high school. Instead of giving up on me, he took the time to understand what I was going through and helped me get back on track. I went on to become a teacher myself, inspired by his example. He showed me that one person really can make a difference in someone's life.`,
      createdAt: "2024-08-22T14:20:00Z",
      isApproved: true
    },
    {
      id: 5,
      name: "Rev. James Mitchell",
      relationship: "Pastor",
      message: `Bob Thompson was a pillar of our church community for over 40 years. His faith was genuine and his service was selfless. Whether teaching Sunday school, serving as an elder, or quietly helping families in need, Bob lived out his faith every single day. His wisdom, humility, and generous heart touched so many lives. He was truly a man of God.`,
      createdAt: "2024-08-21T16:30:00Z",
      isApproved: true
    }
  ];

  useEffect(() => {
    if (isPreview && previewData) {
      // Use preview data
      setMemorial({
        id: 'preview',
        full_name: previewData?.fullName,
        birth_date: previewData?.birthDate,
        death_date: previewData?.deathDate,
        birth_location: previewData?.birthLocation,
        resting_place: previewData?.restingPlace,
        relationship: previewData?.relationship,
        biography: previewData?.biography,
        occupation: previewData?.occupation,
        hobbies: previewData?.hobbies,
        favorite_quote: previewData?.favoriteQuote,
        template: previewData?.template,
        privacy: previewData?.privacy,
        memorial_images: previewData?.images?.map((img, index) => ({
          id: `preview-${index}`,
          image_url: img?.url || (typeof img === 'string' ? img : URL.createObjectURL(img)),
          caption: img?.caption || '',
          is_primary: index === 0,
          display_order: index
        })) || [],
        tributes: [],
        view_count: 0,
        created_at: new Date()?.toISOString(),
        isPreview: true
      });
      setTributes([]); // Set empty tributes for preview
      setLoading(false);
    } else if (memorialId && memorialId !== 'preview') {
      // Load memorial from Supabase
      loadMemorial(memorialId);
    } else {
      setError('Memorial not found');
      setLoading(false);
    }
  }, [isPreview, previewData, memorialId]);

  const loadMemorial = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await memorialService?.getMemorial(id);
      
      if (error) {
        setError(error?.message || 'Failed to load memorial');
        return;
      }

      if (!data) {
        setError('Memorial not found');
        return;
      }

      setMemorial(data);
      // Set tributes from mockTributes or data
      setTributes(data.tributes || mockTributes);
      
      // Increment view count (only for non-preview, non-owner views)
      if (!isPreview && data?.created_by !== user?.id) {
        await memorialService?.incrementViewCount(id);
      }
    } catch (err) {
      setError('Failed to load memorial');
      console.error('Memorial load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTribute = async (newTribute) => {
    // In a real app, this would be an API call
    setTributes(prev => [newTribute, ...prev]);
    
    // Update memorial tribute count
    setMemorial(prev => ({
      ...prev,
      tributeCount: prev?.tributeCount + 1
    }));
  };

  const handleAuthAction = (action) => {
    if (action === 'logout') {
      navigate('/memorial-search');
    } else if (action === 'login' || action === 'register') {
      navigate('/memorial-search');
    }
  };

  const handleShare = () => {
    if (navigator?.share) {
      navigator.share({
        title: `Memorial for ${memorial?.full_name}`,
        text: `Remember and honor ${memorial?.full_name}`,
        url: window.location?.href
      })?.catch(() => {
        // Fallback to copy link
        navigator.clipboard?.writeText(window.location?.href);
      });
    } else {
      // Fallback to copy link
      navigator.clipboard?.writeText(window.location?.href);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'photos', label: 'Photos', icon: 'Images' },
    { id: 'biography', label: 'Life Story', icon: 'BookOpen' },
    { id: 'tributes', label: 'Tributes', icon: 'MessageCircle' },
    { id: 'share', label: 'Share', icon: 'Share2' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          user={user ? {
            id: user?.id,
            name: userProfile?.full_name || user?.email?.split('@')?.[0],
            email: user?.email
          } : null} 
          onAuthAction={handleAuthAction}
        />
        <main className="pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading memorial...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          user={user ? {
            id: user?.id,
            name: userProfile?.full_name || user?.email?.split('@')?.[0],
            email: user?.email
          } : null} 
          onAuthAction={handleAuthAction}
        />
        <main className="pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">Memorial Not Found</h2>
              <p className="text-muted-foreground mb-8">{error}</p>
              <button
                onClick={() => navigate('/memorial-search')}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-memorial-md hover:bg-accent/90 transition-colors"
              >
                Browse Memorials
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!memorial) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user ? {
          id: user?.id,
          name: userProfile?.full_name || user?.email?.split('@')?.[0],
          email: user?.email
        } : null} 
        onAuthAction={handleAuthAction}
      />
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <MemorialBreadcrumb 
            memorialName={memorial?.full_name}
            isPreview={isPreview}
          />
          
          {/* Success Message for Newly Created Memorial */}
          {isNewlyCreated && !isPreview && (
            <div className="memorial-card p-4 border-green-200 bg-green-50 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-green-800 font-medium">Memorial created successfully!</p>
                  <p className="text-green-600 text-sm">Your memorial is now live and can be shared with family and friends.</p>
                </div>
              </div>
            </div>
          )}

          {/* Preview Banner */}
          {isPreview && (
            <div className="memorial-card p-4 border-blue-200 bg-blue-50 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-800 font-medium">Preview Mode</p>
                    <p className="text-blue-600 text-sm">This is how your memorial will appear to visitors.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/create-memorial')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-memorial-sm hover:bg-blue-700 transition-colors text-sm"
                >
                  Back to Edit
                </button>
              </div>
            </div>
          )}

          {/* Memorial Content */}
          <div className="space-y-8">
            <MemorialHeader memorial={memorial} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <PhotoGallery images={memorial?.memorial_images || []} />
                <BiographySection memorial={memorial} />
                {!isPreview && <TributeSection memorial={memorial} currentUser={user} onTributeAdded={() => loadMemorial(memorialId)} onAddTribute={handleAddTribute} />}
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <ShareSection memorial={memorial} onShare={handleShare} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemorialPage;