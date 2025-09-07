import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShareSection = ({ memorial }) => {
  const [copied, setCopied] = useState(false);
  const [shareStats, setShareStats] = useState({
    facebook: 0,
    twitter: 0,
    email: 0,
    link: 0
  });

  const memorialUrl = `${window.location?.origin}/memorial-page?id=${memorial?.id}`;
  const shareTitle = `Memorial for ${memorial?.name}`;
  const shareDescription = `Remember and honor ${memorial?.name} (${new Date(memorial.birthDate)?.getFullYear()} - ${new Date(memorial.deathDate)?.getFullYear()})`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(memorialUrl);
      setCopied(true);
      setShareStats(prev => ({ ...prev, link: prev?.link + 1 }));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform) => {
    setShareStats(prev => ({ ...prev, [platform]: prev?.[platform] + 1 }));

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memorialUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(memorialUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(memorialUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription}\n\n${memorialUrl}`)}`
    };

    if (shareUrls?.[platform]) {
      window.open(shareUrls?.[platform], '_blank', 'width=600,height=400');
    }
  };

  const shareOptions = [
    {
      name: 'facebook',
      label: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'twitter',
      label: 'Twitter',
      icon: 'Twitter',
      color: 'text-sky-500',
      bgColor: 'bg-sky-50 hover:bg-sky-100'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      icon: 'Linkedin',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'email',
      label: 'Email',
      icon: 'Mail',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    }
  ];

  return (
    <div className="bg-card rounded-memorial-lg p-6 lg:p-8">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Share2" size={24} className="text-accent" />
        <h2 className="text-2xl font-heading font-semibold text-foreground">Share Memorial</h2>
      </div>
      <div className="space-y-6">
        {/* Share Description */}
        <p className="text-muted-foreground">
          Help others remember {memorial?.name} by sharing this memorial with family and friends.
        </p>

        {/* Copy Link */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Memorial Link</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 px-3 py-2 bg-muted border border-border rounded-memorial-md text-sm text-muted-foreground font-mono truncate">
              {memorialUrl}
            </div>
            <Button
              variant={copied ? "success" : "outline"}
              size="sm"
              onClick={handleCopyLink}
              iconName={copied ? "Check" : "Copy"}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Share on Social Media</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {shareOptions?.map((option) => (
              <Button
                key={option?.name}
                variant="outline"
                size="sm"
                onClick={() => handleShare(option?.name)}
                className={`${option?.bgColor} border-transparent memorial-interactive`}
                iconName={option?.icon}
                iconPosition="left"
              >
                <span className={`${option?.color} font-medium`}>{option?.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Share Statistics */}
        {Object.values(shareStats)?.some(count => count > 0) && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Share Activity</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {shareOptions?.map((option) => (
                shareStats?.[option?.name] > 0 && (
                  <div key={option?.name} className="text-center">
                    <div className={`w-8 h-8 ${option?.bgColor} rounded-full flex items-center justify-center mx-auto mb-1`}>
                      <Icon name={option?.icon} size={16} className={option?.color} />
                    </div>
                    <div className="text-sm font-medium text-foreground">{shareStats?.[option?.name]}</div>
                    <div className="text-xs text-muted-foreground">{option?.label}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="bg-muted/50 rounded-memorial-md p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Shield" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Privacy Notice</p>
              <p>
                This memorial is currently set to <strong>{memorial?.privacyStatus}</strong>. 
                {memorial?.privacyStatus === 'private' && ' Only invited family members can view this memorial.'}
                {memorial?.privacyStatus === 'family' && ' Only family members and close friends can view this memorial.'}
                {memorial?.privacyStatus === 'public' && ' Anyone with the link can view this memorial.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSection;