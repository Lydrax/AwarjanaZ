import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacySettings = ({ formData, onChange, errors }) => {
  const privacyOptions = [
    {
      id: 'public',
      name: 'Public Memorial',
      description: 'Anyone can view and contribute to this memorial',
      details: 'Visible in search results, allows public tributes and condolences',
      icon: 'Globe',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'family',
      name: 'Family & Friends Only',
      description: 'Visible to invited family members and close friends',
      details: 'You control who can view and contribute by sending invitations',
      icon: 'Users',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      id: 'private',
      name: 'Private Memorial',
      description: 'Only you can view and edit this memorial',
      details: 'Completely private, not visible to anyone else unless you share the link',
      icon: 'Lock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const handlePrivacyChange = (privacyId) => {
    onChange({ ...formData, privacy: privacyId });
  };

  const handleNotificationChange = (field, checked) => {
    onChange({
      ...formData,
      notifications: {
        ...formData?.notifications,
        [field]: checked
      }
    });
  };

  return (
    <div className="memorial-card p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-sm">5</span>
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">Privacy & Sharing</h2>
          <p className="text-muted-foreground text-sm">Control who can view and contribute</p>
        </div>
      </div>
      {/* Privacy Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Memorial Visibility</h3>
        
        {privacyOptions?.map((option) => (
          <div
            key={option?.id}
            className={`relative border-2 rounded-memorial-lg p-4 cursor-pointer memorial-interactive transition-all duration-200 ${
              formData?.privacy === option?.id
                ? 'border-accent bg-accent/5 shadow-memorial-medium'
                : 'border-border hover:border-accent/50 hover:shadow-memorial-soft'
            }`}
            onClick={() => handlePrivacyChange(option?.id)}
          >
            {/* Selection Indicator */}
            {formData?.privacy === option?.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Icon name="Check" size={14} className="text-accent-foreground" />
              </div>
            )}

            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-memorial-md flex items-center justify-center ${option?.bgColor}`}>
                <Icon name={option?.icon} size={20} className={option?.color} />
              </div>
              
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="font-medium text-foreground">{option?.name}</h4>
                  <p className="text-sm text-muted-foreground">{option?.description}</p>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {option?.details}
                </p>
              </div>
            </div>
          </div>
        ))}

        {errors?.privacy && (
          <p className="text-error text-sm">{errors?.privacy}</p>
        )}
      </div>
      {/* Notification Settings */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-lg font-medium text-foreground">Notification Preferences</h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Email me when someone leaves a tribute"
            description="Receive notifications when visitors add condolences or memories"
            checked={formData?.notifications?.tributes || false}
            onChange={(e) => handleNotificationChange('tributes', e?.target?.checked)}
          />
          
          <Checkbox
            label="Email me on memorial anniversaries"
            description="Gentle reminders on birthdays and anniversary dates"
            checked={formData?.notifications?.anniversaries || false}
            onChange={(e) => handleNotificationChange('anniversaries', e?.target?.checked)}
          />
          
          <Checkbox
            label="Allow others to upload photos"
            description="Let family and friends contribute photos to the memorial"
            checked={formData?.notifications?.photoUploads || false}
            onChange={(e) => handleNotificationChange('photoUploads', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Privacy Information */}
      <div className="bg-muted/30 rounded-memorial-md p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} className="text-accent mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Your Privacy Matters</p>
            <p>You can change these privacy settings at any time from your memorial dashboard. We never share personal information with third parties, and all data is securely encrypted.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;