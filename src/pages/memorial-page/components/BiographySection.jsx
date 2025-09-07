import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BiographySection = ({ memorial }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldShowExpandButton = memorial?.biography && memorial?.biography?.length > 500;
  const displayText = shouldShowExpandButton && !isExpanded 
    ? memorial?.biography?.substring(0, 500) + '...'
    : memorial?.biography;

  const formatLifeEvents = (events) => {
    if (!events || events?.length === 0) return null;

    return events?.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatEventDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const lifeEvents = formatLifeEvents(memorial?.lifeEvents);

  return (
    <div className="space-y-8">
      {/* Biography */}
      {memorial?.biography && (
        <div className="bg-card rounded-memorial-lg p-6 lg:p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Icon name="BookOpen" size={24} className="text-accent" />
            <h2 className="text-2xl font-heading font-semibold text-foreground">Life Story</h2>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-line">
              {displayText}
            </div>
            
            {shouldShowExpandButton && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                  iconPosition="right"
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Personal Details */}
      <div className="bg-card rounded-memorial-lg p-6 lg:p-8">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="User" size={24} className="text-accent" />
          <h2 className="text-2xl font-heading font-semibold text-foreground">Personal Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memorial?.personalDetails?.map((detail, index) => (
            <div key={index} className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">{detail?.label}</dt>
              <dd className="text-foreground">{detail?.value}</dd>
            </div>
          ))}
        </div>
      </div>
      {/* Life Events Timeline */}
      {lifeEvents && lifeEvents?.length > 0 && (
        <div className="bg-card rounded-memorial-lg p-6 lg:p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Icon name="Clock" size={24} className="text-accent" />
            <h2 className="text-2xl font-heading font-semibold text-foreground">Life Events</h2>
          </div>

          <div className="space-y-6">
            {lifeEvents?.map((event, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-accent rounded-full mt-2"></div>
                  {index < lifeEvents?.length - 1 && (
                    <div className="w-0.5 h-16 bg-border ml-1 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="font-medium text-foreground">{event?.title}</h3>
                    <span className="text-sm text-muted-foreground">{formatEventDate(event?.date)}</span>
                  </div>
                  {event?.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{event?.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Achievements */}
      {memorial?.achievements && memorial?.achievements?.length > 0 && (
        <div className="bg-card rounded-memorial-lg p-6 lg:p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Icon name="Award" size={24} className="text-accent" />
            <h2 className="text-2xl font-heading font-semibold text-foreground">Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memorial?.achievements?.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-memorial-md">
                <Icon name="Star" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">{achievement?.title}</h4>
                  {achievement?.description && (
                    <p className="text-sm text-muted-foreground mt-1">{achievement?.description}</p>
                  )}
                  {achievement?.year && (
                    <span className="text-xs text-muted-foreground">{achievement?.year}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BiographySection;