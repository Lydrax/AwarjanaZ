import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentSearches = ({ 
  searches = [], 
  onSearchSelect, 
  onClearSearch, 
  onClearAll 
}) => {
  if (searches?.length === 0) {
    return null;
  }

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-memorial-lg shadow-memorial-soft">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={18} className="text-muted-foreground" />
            <h3 className="font-medium text-foreground">Recent Searches</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            iconName="X"
            iconSize={14}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        </div>

        <div className="space-y-2">
          {searches?.slice(0, 8)?.map((search) => (
            <div
              key={search?.id}
              className="flex items-center justify-between group memorial-interactive hover:bg-muted rounded-memorial-sm p-2 -m-2"
            >
              <button
                onClick={() => onSearchSelect(search?.query)}
                className="flex items-center space-x-3 flex-1 min-w-0 text-left"
              >
                <Icon name="Search" size={14} className="text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground truncate">
                    {search?.query}
                  </div>
                  {search?.resultCount !== undefined && (
                    <div className="text-xs text-muted-foreground">
                      {search?.resultCount} result{search?.resultCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </button>
              
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(search?.searchedAt)}
                </span>
                <button
                  onClick={() => onClearSearch(search?.id)}
                  className="p-1 hover:bg-muted-foreground/10 rounded memorial-interactive"
                >
                  <Icon name="X" size={12} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {searches?.length > 8 && (
          <div className="text-center mt-4 pt-4 border-t border-border">
            <button className="text-sm text-accent hover:text-accent-foreground memorial-interactive">
              View All Recent Searches
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSearches;