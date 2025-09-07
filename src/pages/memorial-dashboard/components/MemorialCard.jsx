import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PrivacyStatusIndicator from '../../../components/ui/PrivacyStatusIndicator';

const MemorialCard = ({ memorial, onEdit, onShare, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewMemorial = () => {
    navigate('/memorial-page', { state: { memorial, fromDashboard: true } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatVisitorCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000)?.toFixed(1)}k`;
    }
    return count?.toString();
  };

  return (
    <div className="memorial-card bg-card border border-border rounded-lg overflow-hidden memorial-interactive hover:shadow-memorial-medium transition-all duration-200">
      {/* Memorial Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={memorial?.profileImage}
          alt={`${memorial?.name} memorial photo`}
          className="w-full h-full object-cover"
        />
        
        {/* Privacy Status */}
        <div className="absolute top-3 left-3">
          <PrivacyStatusIndicator 
            privacyStatus={memorial?.privacyStatus} 
            size="sm"
          />
        </div>

        {/* Quick Actions Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center memorial-interactive hover:bg-black/70"
            >
              <Icon name="MoreVertical" size={16} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-popover border border-border rounded-memorial-md shadow-memorial-medium z-10 animate-memorial-scale-in">
                <div className="p-1">
                  <button
                    onClick={() => {
                      handleViewMemorial();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-memorial-sm memorial-interactive"
                  >
                    <Icon name="Eye" size={14} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => {
                      onEdit(memorial);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-memorial-sm memorial-interactive"
                  >
                    <Icon name="Edit" size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      onShare(memorial);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-memorial-sm memorial-interactive"
                  >
                    <Icon name="Share2" size={14} />
                    <span>Share</span>
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button
                    onClick={() => {
                      onDelete(memorial);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-memorial-sm memorial-interactive"
                  >
                    <Icon name="Trash2" size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Memorial Content */}
      <div className="p-4">
        {/* Name and Dates */}
        <div className="mb-3">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {memorial?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {memorial?.birthDate} - {memorial?.deathDate}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={14} />
              <span>{formatVisitorCount(memorial?.visitors)} visits</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Heart" size={14} />
              <span>{memorial?.tributes} tributes</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Created {formatDate(memorial?.createdAt)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleViewMemorial}
            className="flex-1"
            iconName="Eye"
            iconPosition="left"
            iconSize={14}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShare(memorial)}
            iconName="Share2"
            iconSize={14}
          >
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(memorial)}
            iconName="Edit"
            iconSize={14}
          >
          </Button>
        </div>
      </div>
      {/* Click overlay for mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MemorialCard;