import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import PrivacyStatusIndicator from '../../../components/ui/PrivacyStatusIndicator';

const MemorialCard = ({ memorial, onShare, className = '' }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();

const handleViewMemorial = () => {
  navigate(`/memorial/${memorial.id}`, { 
    state: { 
      memorial,
      fromSearch: true 
    } 
  });
};

  const handleShare = (e) => {
    e?.stopPropagation();
    onShare(memorial);
  };

  const formatDateRange = (birthDate, deathDate) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date?.getFullYear();
    };

    const birth = formatDate(birthDate);
    const death = formatDate(deathDate);
    
    if (birth && death) {
      return `${birth} - ${death}`;
    } else if (birth) {
      return `Born ${birth}`;
    } else if (death) {
      return `Died ${death}`;
    }
    return '';
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div 
      className={`memorial-card memorial-interactive hover:shadow-memorial-medium cursor-pointer ${className}`}
      onClick={handleViewMemorial}
    >
      <div className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Memorial Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-full sm:w-24 lg:w-32 h-48 sm:h-24 lg:h-32 bg-muted rounded-memorial-md overflow-hidden">
              <Image
                src={memorial?.profileImage}
                alt={`${memorial?.name} memorial photo`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsImageLoaded(true)}
              />
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="User" size={24} className="text-muted-foreground" />
                </div>
              )}
              
              {/* Privacy Status */}
              <div className="absolute top-2 right-2">
                <PrivacyStatusIndicator 
                  privacyStatus={memorial?.privacyStatus} 
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Memorial Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg lg:text-xl font-semibold text-foreground truncate">
                      {memorial?.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                      <span>{formatDateRange(memorial?.birthDate, memorial?.deathDate)}</span>
                      {memorial?.age && (
                        <>
                          <span>•</span>
                          <span>Age {memorial?.age}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {memorial?.location && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-3">
                    <Icon name="MapPin" size={14} />
                    <span className="truncate">{memorial?.location}</span>
                  </div>
                )}

                {/* Biography Excerpt */}
                {memorial?.biography && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {memorial?.biography}
                  </p>
                )}

                {/* Memorial Stats */}
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                  {memorial?.photoCount > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Image" size={12} />
                      <span>{memorial?.photoCount} photos</span>
                    </div>
                  )}
                  {memorial?.tributeCount > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Heart" size={12} />
                      <span>{memorial?.tributeCount} tributes</span>
                    </div>
                  )}
                  {memorial?.visitCount > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Eye" size={12} />
                      <span>{memorial?.visitCount} visits</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Created {getTimeAgo(memorial?.createdAt)}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    iconName="Share2"
                    iconSize={14}
                    className="h-8 px-3"
                  >
                    Share
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 px-4"
                  >
                    View Memorial
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorialCard;