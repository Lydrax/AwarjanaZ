import React, { useState } from 'react';
import Icon from '../AppIcon';

const PrivacyStatusIndicator = ({ 
  privacyStatus = 'public', 
  size = 'default',
  showLabel = false,
  className = '' 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getPrivacyConfig = () => {
    switch (privacyStatus) {
      case 'private':
        return {
          icon: 'Lock',
          label: 'Private',
          description: 'Only you and invited family members can view this memorial',
          color: 'text-warning',
          bgColor: 'bg-warning/10'
        };
      case 'family':
        return {
          icon: 'Users',
          label: 'Family Only',
          description: 'Visible to family members and close friends',
          color: 'text-accent',
          bgColor: 'bg-accent/10'
        };
      case 'public':
        return {
          icon: 'Globe',
          label: 'Public',
          description: 'Anyone can view and contribute to this memorial',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      default:
        return {
          icon: 'Globe',
          label: 'Public',
          description: 'Anyone can view and contribute to this memorial',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          iconSize: 12,
          padding: 'px-2 py-1',
          textSize: 'text-xs',
          spacing: 'space-x-1'
        };
      case 'lg':
        return {
          iconSize: 18,
          padding: 'px-3 py-2',
          textSize: 'text-sm',
          spacing: 'space-x-2'
        };
      default:
        return {
          iconSize: 14,
          padding: 'px-2.5 py-1.5',
          textSize: 'text-xs',
          spacing: 'space-x-1.5'
        };
    }
  };

  const privacyConfig = getPrivacyConfig();
  const sizeConfig = getSizeConfig();

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        className={`flex items-center ${sizeConfig?.spacing} ${sizeConfig?.padding} ${privacyConfig?.bgColor} ${privacyConfig?.color} rounded-memorial-md ${sizeConfig?.textSize} font-medium memorial-interactive cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <Icon 
          name={privacyConfig?.icon} 
          size={sizeConfig?.iconSize} 
          className={privacyConfig?.color}
        />
        {showLabel && (
          <span className="font-medium">
            {privacyConfig?.label}
          </span>
        )}
      </div>
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-memorial-fade-in">
          <div className="bg-popover text-popover-foreground border border-border rounded-memorial-md shadow-memorial-medium px-3 py-2 text-sm max-w-xs">
            <div className="flex items-center space-x-2 mb-1">
              <Icon 
                name={privacyConfig?.icon} 
                size={14} 
                className={privacyConfig?.color}
              />
              <span className="font-medium">{privacyConfig?.label}</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {privacyConfig?.description}
            </p>
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-popover border-r border-b border-border transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyStatusIndicator;