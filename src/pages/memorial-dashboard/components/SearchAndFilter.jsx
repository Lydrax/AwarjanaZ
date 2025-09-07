import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchAndFilter = ({ 
  onSearch, 
  onFilterChange, 
  onSortChange,
  searchQuery = '',
  currentFilter = 'all',
  currentSort = 'recent'
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All Memorials' },
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'family', label: 'Family Only' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'visitors', label: 'Most Visited' },
    { value: 'tributes', label: 'Most Tributes' }
  ];

  const handleSearchChange = (e) => {
    onSearch(e?.target?.value);
  };

  const handleClearSearch = () => {
    onSearch('');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        
        {/* Search Input */}
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search memorials by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground memorial-interactive"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Privacy Filter */}
          <Select
            options={filterOptions}
            value={currentFilter}
            onChange={onFilterChange}
            placeholder="Filter by privacy"
            className="w-40"
          />

          {/* Sort Options */}
          <Select
            options={sortOptions}
            value={currentSort}
            onChange={onSortChange}
            placeholder="Sort by"
            className="w-40"
          />

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            iconName="Filter"
            iconSize={16}
            className="lg:hidden"
          >
          </Button>
        </div>
      </div>
      {/* Mobile Filter Panel */}
      {isFilterOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-border space-y-3 animate-memorial-fade-in">
          <Select
            label="Privacy Filter"
            options={filterOptions}
            value={currentFilter}
            onChange={onFilterChange}
            className="w-full"
          />
          <Select
            label="Sort By"
            options={sortOptions}
            value={currentSort}
            onChange={onSortChange}
            className="w-full"
          />
        </div>
      )}
      {/* Active Filters Display */}
      {(searchQuery || currentFilter !== 'all' || currentSort !== 'recent') && (
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {searchQuery && (
            <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-memorial-sm text-xs">
              <Icon name="Search" size={12} />
              <span>"{searchQuery}"</span>
              <button onClick={handleClearSearch} className="ml-1 hover:text-accent/80">
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {currentFilter !== 'all' && (
            <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-memorial-sm text-xs">
              <Icon name="Filter" size={12} />
              <span>{filterOptions?.find(f => f?.value === currentFilter)?.label}</span>
              <button onClick={() => onFilterChange('all')} className="ml-1 hover:text-primary/80">
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {currentSort !== 'recent' && (
            <div className="flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded-memorial-sm text-xs">
              <Icon name="ArrowUpDown" size={12} />
              <span>{sortOptions?.find(s => s?.value === currentSort)?.label}</span>
              <button onClick={() => onSortChange('recent')} className="ml-1 hover:text-success/80">
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;