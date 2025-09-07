import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PopularMemorials = ({ memorials = [], onViewAll }) => {
  const navigate = useNavigate();

  const handleMemorialClick = (memorial) => {
    navigate(`/memorial/${memorial.id}`, {
      state: { 
        memorial,
        fromSearch: true 
      } 
    });
  };

  if (memorials?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-memorial-lg shadow-memorial-soft">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">
              Popular Memorials
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={14}
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memorials?.slice(0, 6)?.map((memorial) => (
            <button
              key={memorial?.id}
              onClick={() => handleMemorialClick(memorial)}
              className="group text-left memorial-interactive hover:shadow-memorial-soft rounded-memorial-md overflow-hidden border border-border bg-background"
            >
              <div className="aspect-w-16 aspect-h-12 relative">
                <div className="w-full h-32 bg-muted overflow-hidden">
                  <Image
                    src={memorial?.profileImage}
                    alt={`${memorial?.name} memorial`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-white font-medium text-sm truncate">
                    {memorial?.name}
                  </h3>
                  <div className="text-white/80 text-xs">
                    {memorial?.birthYear} - {memorial?.deathYear}
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    {memorial?.photoCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Image" size={10} />
                        <span>{memorial?.photoCount}</span>
                      </div>
                    )}
                    {memorial?.tributeCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Heart" size={10} />
                        <span>{memorial?.tributeCount}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Eye" size={10} />
                    <span>{memorial?.visitCount}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {memorials?.length > 6 && (
          <div className="text-center mt-6 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onViewAll}
              iconName="ArrowRight"
              iconPosition="right"
            >
              View All Popular Memorials
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularMemorials;