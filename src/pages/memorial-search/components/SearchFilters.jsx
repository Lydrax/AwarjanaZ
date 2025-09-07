import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SearchFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  resultCount = 0,
  isExpanded = false,
  onToggleExpanded 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'new-york', label: 'New York, NY' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'houston', label: 'Houston, TX' },
    { value: 'phoenix', label: 'Phoenix, AZ' },
    { value: 'philadelphia', label: 'Philadelphia, PA' },
    { value: 'san-antonio', label: 'San Antonio, TX' },
    { value: 'san-diego', label: 'San Diego, CA' },
    { value: 'dallas', label: 'Dallas, TX' },
    { value: 'san-jose', label: 'San Jose, CA' }
  ];

  const memorialTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'traditional', label: 'Traditional Memorial' },
    { value: 'celebration', label: 'Celebration of Life' },
    { value: 'tribute', label: 'Tribute Page' },
    { value: 'remembrance', label: 'Remembrance Garden' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'date-created-desc', label: 'Recently Created' },
    { value: 'date-created-asc', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'birth-date-desc', label: 'Birth Date (Newest)' },
    { value: 'birth-date-asc', label: 'Birth Date (Oldest)' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const updatedFilters = {
      ...localFilters,
      dateRange: {
        ...localFilters?.dateRange,
        [type]: value
      }
    };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      location: '',
      memorialType: '',
      dateRange: { from: '', to: '' },
      sortBy: 'relevance',
      hasPhotos: false,
      hasVideos: false,
      recentlyUpdated: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return localFilters?.location || 
           localFilters?.memorialType || 
           localFilters?.dateRange?.from || 
           localFilters?.dateRange?.to ||
           localFilters?.hasPhotos ||
           localFilters?.hasVideos ||
           localFilters?.recentlyUpdated;
  };

  return (
    <div className="bg-card border border-border rounded-memorial-lg shadow-memorial-soft">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={onToggleExpanded}
          className="w-full flex items-center justify-between p-4 memorial-interactive hover:bg-muted"
        >
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={18} />
            <span className="font-medium">Filters</span>
            {hasActiveFilters() && (
              <div className="w-2 h-2 bg-accent rounded-full"></div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {resultCount} results
            </span>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </div>
        </button>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Results Count & Clear */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {resultCount} memorial{resultCount !== 1 ? 's' : ''} found
            </div>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                iconName="X"
                iconPosition="left"
                iconSize={14}
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Sort By */}
          <div>
            <Select
              label="Sort By"
              options={sortOptions}
              value={localFilters?.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
              className="w-full"
            />
          </div>

          {/* Location Filter */}
          <div>
            <Select
              label="Location"
              options={locationOptions}
              value={localFilters?.location}
              onChange={(value) => handleFilterChange('location', value)}
              searchable
              clearable
              className="w-full"
            />
          </div>

          {/* Memorial Type */}
          <div>
            <Select
              label="Memorial Type"
              options={memorialTypeOptions}
              value={localFilters?.memorialType}
              onChange={(value) => handleFilterChange('memorialType', value)}
              className="w-full"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="date"
                label="From"
                value={localFilters?.dateRange?.from || ''}
                onChange={(e) => handleDateRangeChange('from', e?.target?.value)}
              />
              <Input
                type="date"
                label="To"
                value={localFilters?.dateRange?.to || ''}
                onChange={(e) => handleDateRangeChange('to', e?.target?.value)}
              />
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Additional Options
            </label>
            <div className="space-y-3">
              <Checkbox
                label="Has Photos"
                checked={localFilters?.hasPhotos}
                onChange={(e) => handleFilterChange('hasPhotos', e?.target?.checked)}
              />
              <Checkbox
                label="Has Videos"
                checked={localFilters?.hasVideos}
                onChange={(e) => handleFilterChange('hasVideos', e?.target?.checked)}
              />
              <Checkbox
                label="Recently Updated"
                description="Updated in the last 30 days"
                checked={localFilters?.recentlyUpdated}
                onChange={(e) => handleFilterChange('recentlyUpdated', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Mobile Clear Button */}
          <div className="lg:hidden pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {resultCount} results
              </div>
              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  iconName="X"
                  iconPosition="left"
                  iconSize={14}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;