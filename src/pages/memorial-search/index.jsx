import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import MemorialBreadcrumb from '../../components/ui/MemorialBreadcrumb';
import SearchBar from './components/SearchBar';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import PopularMemorials from './components/PopularMemorials';
import RecentSearches from './components/RecentSearches';
import Icon from '../../components/AppIcon';
import memorialService from '../../services/memorialService';

const MemorialSearch = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [featuredMemorials, setFeaturedMemorials] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    dateRange: { start: '', end: '' },
    relationship: ''
  });

  // Load featured memorials on mount
  useEffect(() => {
    loadFeaturedMemorials();
    loadRecentSearches();
  }, []);

  // Search when query or filters change
  useEffect(() => {
    if (searchQuery?.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, filters]);

  const loadFeaturedMemorials = async () => {
    try {
      setFeaturedLoading(true);
      const { data, error } = await memorialService?.getFeaturedMemorials();
      if (error) {
        console.error('Error loading featured memorials:', error);
      } else {
        setFeaturedMemorials(data || []);
      }
    } catch (error) {
      console.error('Failed to load featured memorials:', error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const loadRecentSearches = () => {
    try {
      const savedSearches = localStorage.getItem('memorial_recent_searches');
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const saveRecentSearch = (query) => {
    if (!query?.trim()) return;
    
    try {
      const searches = recentSearches?.filter(search => search !== query) || [];
      const updatedSearches = [query, ...searches]?.slice(0, 5);
      localStorage.setItem('memorial_recent_searches', JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  const performSearch = async () => {
    if (!searchQuery?.trim()) return;
    
    try {
      setLoading(true);
      
      // Clean filters for API
      const apiFilters = {
        location: filters?.location?.trim() || undefined,
        dateRange: (filters?.dateRange?.start && filters?.dateRange?.end) ? filters?.dateRange : undefined
      };

      const { data, error } = await memorialService?.searchMemorials(searchQuery, apiFilters);
      
      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
        saveRecentSearch(searchQuery);
      }
    } catch (error) {
      console.error('Failed to search memorials:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRecentSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearRecentSearches = () => {
    localStorage.removeItem('memorial_recent_searches');
    setRecentSearches([]);
  };

  const handleAuthAction = (action) => {
    if (action === 'logout') {
      // Stay on search page after logout
      return;
    } else if (action === 'login' || action === 'register') {
      // Could implement auth modals here
      return;
    }
  };

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
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center">
                <Icon name="Search" size={32} className="text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-heading font-bold text-foreground">
                  Search Memorials
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Find and honor the memories of loved ones
                </p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar
                searchQuery={searchQuery}
                onSearch={handleSearch}
                onSearchChange={handleSearch}
                onSubmit={performSearch}
                loading={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onFiltersChange={handleFilterChange}
                  onClearFilters={() => setFilters({
                    location: '',
                    dateRange: { start: '', end: '' },
                    relationship: ''
                  })}
                  onToggleExpanded={() => {}}
                />
                
                <RecentSearches
                  searches={recentSearches}
                  onSearchSelect={handleRecentSearch}
                  onClear={handleClearRecentSearches}
                  onClearSearch={(query) => {
                    const updatedSearches = recentSearches.filter(search => search !== query);
                    localStorage.setItem('memorial_recent_searches', JSON.stringify(updatedSearches));
                    setRecentSearches(updatedSearches);
                  }}
                  onClearAll={handleClearRecentSearches}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {searchQuery?.trim() ? (
                <SearchResults
                  query={searchQuery}
                  results={searchResults}
                  loading={loading}
                  onMemorialClick={(memorial) => 
                    navigate('/memorial-page', { 
                      state: { memorialId: memorial?.id } 
                    })
                  }
                  onShare={(memorial) => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Memorial for ${memorial?.name}`,
                        url: window.location.href
                      });
                    }
                  }}
                  onLoadMore={() => {}}
                />
              ) : (
                <PopularMemorials
                  memorials={featuredMemorials}
                  loading={featuredLoading}
                  onMemorialClick={(memorial) => 
                    navigate('/memorial-page', { 
                      state: { memorialId: memorial?.id } 
                    })
                  }
                  onViewAll={() => navigate('/memorials')}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemorialSearch;