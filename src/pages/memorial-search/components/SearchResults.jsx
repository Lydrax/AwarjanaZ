import React from 'react';
import MemorialCard from './MemorialCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchResults = ({ 
  results = [], 
  isLoading = false, 
  searchQuery = '', 
  onShare,
  onLoadMore,
  hasMore = false,
  totalCount = 0
}) => {
  if (isLoading && results?.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(6)]?.map((_, index) => (
          <div key={index} className="memorial-card animate-pulse">
            <div className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-24 lg:w-32 h-48 sm:h-24 lg:h-32 bg-muted rounded-memorial-md"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && results?.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No memorials found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We couldn't find any memorials matching "{searchQuery}". Try adjusting your search terms or filters.
        </p>
        <div className="space-y-4">
          <div className="text-sm font-medium text-foreground mb-2">
            Try searching for:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'John Smith',
              'New York',
              'Teacher',
              'Vietnam Veteran',
              'Born 1950'
            ]?.map((suggestion) => (
              <button
                key={suggestion}
                className="px-3 py-1 bg-muted text-muted-foreground rounded-memorial-md text-sm memorial-interactive hover:bg-accent hover:text-accent-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && results?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Heart" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Discover Memorials
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Search for memorials by name, location, or browse our featured memorials to get started.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <button className="p-4 bg-card border border-border rounded-memorial-md memorial-interactive hover:shadow-memorial-soft text-left">
            <Icon name="MapPin" size={20} className="text-accent mb-2" />
            <div className="font-medium text-foreground">Browse by Location</div>
            <div className="text-sm text-muted-foreground">Find memorials near you</div>
          </button>
          
          <button className="p-4 bg-card border border-border rounded-memorial-md memorial-interactive hover:shadow-memorial-soft text-left">
            <Icon name="Calendar" size={20} className="text-accent mb-2" />
            <div className="font-medium text-foreground">Recent Memorials</div>
            <div className="text-sm text-muted-foreground">Newly created tributes</div>
          </button>
          
          <button className="p-4 bg-card border border-border rounded-memorial-md memorial-interactive hover:shadow-memorial-soft text-left">
            <Icon name="Star" size={20} className="text-accent mb-2" />
            <div className="font-medium text-foreground">Featured</div>
            <div className="text-sm text-muted-foreground">Most visited memorials</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {results?.length} of {totalCount} memorial{totalCount !== 1 ? 's' : ''}
          {searchQuery && (
            <span> for "{searchQuery}"</span>
          )}
        </div>
      </div>
      {/* Results Grid */}
      <div className="space-y-4">
        {results?.map((memorial) => (
          <MemorialCard
            key={memorial?.id}
            memorial={memorial}
            onShare={onShare}
            className="animate-memorial-fade-in"
          />
        ))}
      </div>
      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            loading={isLoading}
            iconName="ChevronDown"
            iconPosition="right"
          >
            Load More Memorials
          </Button>
        </div>
      )}
      {/* Loading More */}
      {isLoading && results?.length > 0 && (
        <div className="space-y-4">
          {[...Array(3)]?.map((_, index) => (
            <div key={index} className="memorial-card animate-pulse">
              <div className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 lg:w-32 h-48 sm:h-24 lg:h-32 bg-muted rounded-memorial-md"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;