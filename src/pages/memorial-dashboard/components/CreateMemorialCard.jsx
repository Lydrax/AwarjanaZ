import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreateMemorialCard = () => {
  const navigate = useNavigate();

  const handleCreateMemorial = () => {
    navigate('/create-memorial');
  };

  return (
    <div className="memorial-card bg-card border-2 border-dashed border-border rounded-lg h-full min-h-[320px] flex flex-col items-center justify-center p-6 memorial-interactive hover:border-accent hover:bg-accent/5 transition-all duration-200 cursor-pointer"
         onClick={handleCreateMemorial}>
      
      {/* Icon */}
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
        <Icon name="Plus" size={32} className="text-accent" />
      </div>

      {/* Content */}
      <div className="text-center mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          Create New Memorial
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          Honor your loved one with a beautiful digital memorial page that preserves their memory forever.
        </p>
      </div>

      {/* Action Button */}
      <Button
        variant="default"
        onClick={handleCreateMemorial}
        iconName="Plus"
        iconPosition="left"
        iconSize={16}
        className="memorial-interactive"
      >
        Get Started
      </Button>

      {/* Features List */}
      <div className="mt-6 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Image" size={12} className="text-accent" />
          <span>Upload photos & videos</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={12} className="text-accent" />
          <span>Invite family & friends</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Heart" size={12} className="text-accent" />
          <span>Collect loving tributes</span>
        </div>
      </div>
    </div>
  );
};

export default CreateMemorialCard;