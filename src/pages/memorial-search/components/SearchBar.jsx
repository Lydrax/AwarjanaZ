import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  suggestions = [], 
  recentSearches = [],
  isLoading = false 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const allSuggestions = [
    ...suggestions?.map(s => ({ ...s, type: 'suggestion' })),
    ...recentSearches?.map(s => ({ ...s, type: 'recent' }))
  ]?.slice(0, 8);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions || allSuggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setFocusedIndex(prev => 
          prev < allSuggestions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : allSuggestions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (focusedIndex >= 0) {
          handleSuggestionSelect(allSuggestions?.[focusedIndex]);
        } else {
          onSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    onSearchChange(suggestion?.query || suggestion?.name);
    setShowSuggestions(false);
    setFocusedIndex(-1);
    onSearch();
  };

  const handleInputFocus = () => {
    if (allSuggestions?.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    
    if (value?.trim()?.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setFocusedIndex(-1);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
        
        <Input
          type="search"
          placeholder="Search by name, location, or date..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-24 h-12 text-base rounded-memorial-lg border-2 focus:border-accent"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button
            variant="default"
            size="sm"
            onClick={onSearch}
            disabled={isLoading}
            loading={isLoading}
            className="h-8 px-4"
          >
            Search
          </Button>
        </div>
      </div>
      {/* Suggestions Dropdown */}
      {showSuggestions && allSuggestions?.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-memorial-lg shadow-memorial-strong z-50 animate-memorial-fade-in"
        >
          <div className="py-2 max-h-80 overflow-y-auto">
            {allSuggestions?.map((item, index) => (
              <button
                key={`${item?.type}-${index}`}
                onClick={() => handleSuggestionSelect(item)}
                className={`w-full px-4 py-3 text-left hover:bg-muted memorial-interactive flex items-center space-x-3 ${
                  focusedIndex === index ? 'bg-muted' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <Icon 
                    name={item?.type === 'recent' ? 'Clock' : 'Search'} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {item?.query || item?.name}
                  </div>
                  {item?.location && (
                    <div className="text-xs text-muted-foreground truncate">
                      {item?.location}
                    </div>
                  )}
                </div>
                {item?.type === 'recent' && (
                  <div className="text-xs text-muted-foreground">
                    Recent
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;