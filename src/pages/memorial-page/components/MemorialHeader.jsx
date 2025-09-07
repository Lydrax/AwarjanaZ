import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import PrivacyStatusIndicator from '../../../components/ui/PrivacyStatusIndicator';

const MemorialHeader = ({ memorial }) => {
  const calculateAge = (birthDate, deathDate) => {
    const birth = new Date(birthDate);
    const death = new Date(deathDate);
    return death?.getFullYear() - birth?.getFullYear();
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const age = calculateAge(memorial?.birthDate, memorial?.deathDate);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-memorial-strong bg-card">
                  <Image
                    src={memorial?.profileImage}
                    alt={`${memorial?.name} memorial photo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <PrivacyStatusIndicator 
                    privacyStatus={memorial?.privacyStatus} 
                    size="lg"
                    showLabel
                  />
                </div>
              </div>
            </div>

            {/* Memorial Information */}
            <div className="flex-1 text-center lg:text-left">
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
                    {memorial?.name}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-muted-foreground">
                    <Icon name="Calendar" size={16} />
                    <span className="text-lg">
                      {formatDate(memorial?.birthDate)} - {formatDate(memorial?.deathDate)}
                    </span>
                    <span className="text-lg">({age} years)</span>
                  </div>
                </div>

                {memorial?.tagline && (
                  <p className="text-xl text-accent font-medium italic">
                    "{memorial?.tagline}"
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                  {memorial?.location && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Icon name="MapPin" size={16} />
                      <span>{memorial?.location}</span>
                    </div>
                  )}
                  {memorial?.occupation && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Icon name="Briefcase" size={16} />
                      <span>{memorial?.occupation}</span>
                    </div>
                  )}
                </div>

                {/* Memorial Stats */}
                <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Eye" size={16} />
                    <span>{memorial?.viewCount?.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="MessageCircle" size={16} />
                    <span>{memorial?.tributeCount} tributes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Images" size={16} />
                    <span>{memorial?.photoCount} photos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorialHeader;