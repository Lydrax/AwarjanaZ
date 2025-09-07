import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import MemorialBreadcrumb from '../../components/ui/MemorialBreadcrumb';
import DashboardStats from './components/DashboardStats';
import RecentActivity from './components/RecentActivity';
import MemorialCard from './components/MemorialCard';
import SearchAndFilter from './components/SearchAndFilter';
import EmptyState from './components/EmptyState';
import CreateMemorialCard from './components/CreateMemorialCard';
import Icon from '../../components/AppIcon';
import memorialService from '../../services/memorialService';

const MemorialDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  
  // ... replace mock data with Supabase state ...
  const [memorials, setMemorials] = useState([]);
  const [stats, setStats] = useState({ memorialCount: 0, totalViews: 0, tributeCount: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/memorial-search');
    }
  }, [user, authLoading, navigate]);

  // Load dashboard data
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Load user's memorials
      const { data: memorialsData, error: memorialsError } = await memorialService?.getMemorialsByUser(user?.id);
      if (memorialsError) {
        console.error('Error loading memorials:', memorialsError);
      } else {
        setMemorials(memorialsData || []);
      }

      // Load dashboard stats
      const { data: statsData, error: statsError } = await memorialService?.getDashboardStats(user?.id);
      if (statsError) {
        console.error('Error loading stats:', statsError);
      } else {
        setStats(statsData || { memorialCount: 0, totalViews: 0, tributeCount: 0 });
      }

      // Load recent activity
      const { data: activityData, error: activityError } = await memorialService?.getRecentActivity(user?.id, 5);
      if (activityError) {
        console.error('Error loading activity:', activityError);
      } else {
        setRecentActivity(activityData || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... keep existing filter logic ...
  const filteredMemorials = memorials?.filter(memorial => {
    const matchesSearch = !searchQuery || 
      memorial?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      memorial?.occupation?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'public' && memorial?.privacy === 'public') ||
      (selectedFilter === 'private' && memorial?.privacy === 'private') ||
      (selectedFilter === 'family' && memorial?.privacy === 'family_only');
    
    return matchesSearch && matchesFilter;
  }) || [];

  const handleAuthAction = (action) => {
    if (action === 'logout') {
      navigate('/memorial-search');
    }
  };

  const handleDeleteMemorial = async (memorialId) => {
    if (window.confirm('Are you sure you want to delete this memorial? This action cannot be undone.')) {
      try {
        const { error } = await memorialService?.deleteMemorial(memorialId);
        if (error) {
          alert('Failed to delete memorial: ' + error?.message);
          return;
        }
        
        // Refresh dashboard data
        await loadDashboardData();
      } catch (error) {
        console.error('Error deleting memorial:', error);
        alert('Failed to delete memorial');
      }
    }
  };

  // ... keep loading state ...
  if (authLoading || loading) {
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ... keep existing component structure but use Supabase data ...
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <MemorialBreadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="LayoutDashboard" size={24} className="text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-heading font-bold text-foreground">
                    Memorial Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Manage your memorials and view activity
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/create-memorial')}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-memorial-md hover:bg-accent/90 transition-colors flex items-center space-x-2"
              >
                <Icon name="Plus" size={16} />
                <span>Create Memorial</span>
              </button>
            </div>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats stats={stats} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Memorials List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Your Memorials</h2>
                <span className="text-sm text-muted-foreground">
                  {filteredMemorials?.length} of {memorials?.length} memorials
                </span>
              </div>

              <SearchAndFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                onSearch={() => {}} // Add missing required prop
                onSortChange={() => {}} // Add missing required prop
              />

              <div className="space-y-6 mt-6">
                {/* Create Memorial Card */}
                <CreateMemorialCard />

                {/* Memorial Cards */}
                {filteredMemorials?.length > 0 ? (
                  filteredMemorials?.map(memorial => (
                    <MemorialCard
                      key={memorial?.id}
                      memorial={memorial}
                      onEdit={(id) => {
                        // Navigate to edit (could implement edit mode)
                        navigate(`/memorial-page`, { 
                          state: { memorialId: id } 
                        });
                      }}
                      onDelete={handleDeleteMemorial}
                      onView={(id) => navigate(`/memorial-page`, { 
                        state: { memorialId: id } 
                      })}
                      onShare={() => {}} // Add missing required prop
                    />
                  ))
                ) : memorials?.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="text-center py-8">
                    <Icon name="Search" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No memorials match your search criteria
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Sidebar */}
            <div className="lg:col-span-1">
              <RecentActivity activities={recentActivity} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemorialDashboard;