import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'tribute':
        return 'Heart';
      case 'photo':
        return 'Image';
      case 'visit':
        return 'Eye';
      case 'share':
        return 'Share2';
      case 'comment':
        return 'MessageCircle';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'tribute':
        return 'text-error';
      case 'photo':
        return 'text-accent';
      case 'visit':
        return 'text-success';
      case 'share':
        return 'text-primary';
      case 'comment':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityTime?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (activities?.length === 0) {
    return (
      <div className="memorial-card bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Activity" size={20} className="text-accent" />
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Recent Activity
          </h3>
        </div>
        
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Activity" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            No recent activity yet
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Activity will appear here as people interact with your memorials
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="memorial-card bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon name="Activity" size={20} className="text-accent" />
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Recent Activity
        </h3>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities?.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-memorial-md hover:bg-muted/50 memorial-interactive">
            {/* Activity Icon */}
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={14} />
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity?.userName}</span>
                    <span className="text-muted-foreground"> {activity?.action}</span>
                    <span className="font-medium"> {activity?.memorialName}</span>
                  </p>
                  {activity?.content && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      "{activity?.content}"
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {activities?.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-sm text-accent hover:text-accent/80 memorial-interactive font-medium">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;