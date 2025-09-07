import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ stats = {} }) => {
  const defaultStats = {
    totalMemorials: 0,
    totalVisitors: 0,
    totalTributes: 0,
    thisMonthVisitors: 0,
    ...stats
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000)?.toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000)?.toFixed(1)}K`;
    }
    return num?.toString();
  };

  const statItems = [
    {
      label: 'Total Memorials',
      value: defaultStats?.totalMemorials,
      icon: 'Users',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Total Visitors',
      value: formatNumber(defaultStats?.totalVisitors),
      icon: 'Eye',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Total Tributes',
      value: formatNumber(defaultStats?.totalTributes),
      icon: 'Heart',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      label: 'This Month',
      value: formatNumber(defaultStats?.thisMonthVisitors),
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems?.map((stat, index) => (
        <div key={index} className="memorial-card bg-card border border-border rounded-lg p-4 memorial-interactive hover:shadow-memorial-medium transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-heading font-bold text-foreground">
                {stat?.value}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {stat?.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;