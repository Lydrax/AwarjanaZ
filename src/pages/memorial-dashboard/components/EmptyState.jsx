import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  type = 'no-memorials', 
  searchQuery = '',
  onClearSearch = () => {} 
}) => {
  const navigate = useNavigate();

  const getEmptyStateConfig = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: 'Search',
          title: 'No memorials found',
          description: `We couldn't find any memorials matching "${searchQuery}". Try adjusting your search terms or filters.`,
          primaryAction: {
            label: 'Clear Search',
            onClick: onClearSearch,
            variant: 'outline'
          },
          secondaryAction: {
            label: 'Create Memorial',
            onClick: () => navigate('/create-memorial'),
            variant: 'default'
          }
        };
      case 'no-memorials':
      default:
        return {
          icon: 'Users',
          title: 'Welcome to Memorial Tribute',
          description: 'You haven\'t created any memorials yet. Start by creating a beautiful tribute to honor your loved one\'s memory.',
          primaryAction: {
            label: 'Create Your First Memorial',
            onClick: () => navigate('/create-memorial'),
            variant: 'default'
          },
          secondaryAction: {
            label: 'Browse Public Memorials',
            onClick: () => navigate('/memorial-search'),
            variant: 'outline'
          }
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <div className="memorial-card bg-card border border-border rounded-lg p-8 text-center">
      {/* Icon */}
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name={config?.icon} size={32} className="text-muted-foreground" />
      </div>
      {/* Content */}
      <div className="max-w-md mx-auto mb-6">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
          {config?.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {config?.description}
        </p>
      </div>
      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
        <Button
          variant={config?.primaryAction?.variant}
          onClick={config?.primaryAction?.onClick}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          {config?.primaryAction?.label}
        </Button>
        
        {config?.secondaryAction && (
          <Button
            variant={config?.secondaryAction?.variant}
            onClick={config?.secondaryAction?.onClick}
            iconName="Search"
            iconPosition="left"
            iconSize={16}
          >
            {config?.secondaryAction?.label}
          </Button>
        )}
      </div>
      {/* Help Text */}
      {type === 'no-memorials' && (
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Heart" size={16} className="text-error" />
              <span>Forever Preserved</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-accent" />
              <span>Family Friendly</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyState;