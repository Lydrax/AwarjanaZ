import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TributeSection = ({ tributes = [], onAddTribute }) => {
  const [isAddingTribute, setIsAddingTribute] = useState(false);
  const [newTribute, setNewTribute] = useState({
    name: '',
    email: '',
    message: '',
    relationship: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setNewTribute(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitTribute = async (e) => {
    e?.preventDefault();
    if (!newTribute?.name?.trim() || !newTribute?.message?.trim()) return;

    setIsSubmitting(true);
    
    try {
      const tribute = {
        id: Date.now(),
        name: newTribute?.name?.trim(),
        email: newTribute?.email?.trim(),
        message: newTribute?.message?.trim(),
        relationship: newTribute?.relationship?.trim(),
        createdAt: new Date()?.toISOString(),
        isApproved: true // In real app, this would be false and require moderation
      };

      if (onAddTribute) {
        await onAddTribute(tribute);
      }

      // Reset form
      setNewTribute({
        name: '',
        email: '',
        message: '',
        relationship: ''
      });
      setIsAddingTribute(false);
    } catch (error) {
      console.error('Error submitting tribute:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTributeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const approvedTributes = tributes?.filter(tribute => tribute?.isApproved);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="MessageCircle" size={24} className="text-accent" />
          <div>
            <h2 className="text-2xl font-heading font-semibold text-foreground">Tributes & Memories</h2>
            <p className="text-muted-foreground">
              {approvedTributes?.length} {approvedTributes?.length === 1 ? 'tribute' : 'tributes'}
            </p>
          </div>
        </div>

        {!isAddingTribute && (
          <Button
            variant="default"
            onClick={() => setIsAddingTribute(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Leave Tribute
          </Button>
        )}
      </div>
      {/* Add Tribute Form */}
      {isAddingTribute && (
        <div className="bg-card rounded-memorial-lg p-6 border-2 border-accent/20">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Edit3" size={20} className="text-accent" />
            <h3 className="text-lg font-medium text-foreground">Share Your Memory</h3>
          </div>

          <form onSubmit={handleSubmitTribute} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                type="text"
                placeholder="Enter your full name"
                value={newTribute?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                required
              />
              <Input
                label="Email (Optional)"
                type="email"
                placeholder="your.email@example.com"
                value={newTribute?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                description="Will not be displayed publicly"
              />
            </div>

            <Input
              label="Relationship (Optional)"
              type="text"
              placeholder="e.g., Friend, Colleague, Neighbor"
              value={newTribute?.relationship}
              onChange={(e) => handleInputChange('relationship', e?.target?.value)}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Your Message <span className="text-error">*</span>
              </label>
              <textarea
                className="w-full min-h-[120px] px-3 py-2 border border-border rounded-memorial-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                placeholder="Share your favorite memory, story, or message of condolence..."
                value={newTribute?.message}
                onChange={(e) => handleInputChange('message', e?.target?.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <Button
                type="submit"
                variant="default"
                loading={isSubmitting}
                disabled={!newTribute?.name?.trim() || !newTribute?.message?.trim()}
              >
                Submit Tribute
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddingTribute(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Tributes List */}
      <div className="space-y-4">
        {approvedTributes?.length === 0 ? (
          <div className="bg-card rounded-memorial-lg p-8 text-center">
            <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Tributes Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share a memory or leave a tribute.
            </p>
            {!isAddingTribute && (
              <Button
                variant="default"
                onClick={() => setIsAddingTribute(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Leave First Tribute
              </Button>
            )}
          </div>
        ) : (
          approvedTributes?.map((tribute) => (
            <div key={tribute?.id} className="bg-card rounded-memorial-lg p-6 shadow-memorial-soft">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} color="var(--color-accent-foreground)" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{tribute?.name}</h4>
                      {tribute?.relationship && (
                        <span className="text-sm text-muted-foreground">
                          • {tribute?.relationship}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatTributeDate(tribute?.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {tribute?.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TributeSection;