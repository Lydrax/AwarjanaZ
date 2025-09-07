import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const MemorialBreadcrumb = ({ 
  memorial = null, 
  searchContext = null, 
  customPath = null 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbPath = () => {
    const currentPath = location?.pathname;
    
    // Custom path override
    if (customPath) {
      return customPath;
    }

    // Memorial page breadcrumbs
    if (currentPath === '/memorial-page' && memorial) {
      if (searchContext) {
        return [
          { label: 'Search Results', path: '/memorial-search', icon: 'Search' },
          { label: memorial?.name || 'Memorial', path: null, icon: 'User' }
        ];
      }
      return [
        { label: 'Dashboard', path: '/memorial-dashboard', icon: 'LayoutDashboard' },
        { label: memorial?.name || 'Memorial', path: null, icon: 'User' }
      ];
    }

    // Create memorial breadcrumbs
    if (currentPath === '/create-memorial') {
      return [
        { label: 'Dashboard', path: '/memorial-dashboard', icon: 'LayoutDashboard' },
        { label: 'Create Memorial', path: null, icon: 'Plus' }
      ];
    }

    return null;
  };

  const breadcrumbPath = getBreadcrumbPath();

  if (!breadcrumbPath || breadcrumbPath?.length === 0) {
    return null;
  }

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav className="memorial-breadcrumb py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbPath?.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="memorial-breadcrumb-separator mx-2" 
              />
            )}
            
            {item?.path ? (
              <button
                onClick={() => handleNavigation(item?.path)}
                className="memorial-breadcrumb-link flex items-center space-x-1 memorial-interactive hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-memorial-sm px-1 py-0.5"
              >
                <Icon name={item?.icon} size={14} />
                <span>{item?.label}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1 text-foreground font-medium">
                <Icon name={item?.icon} size={14} />
                <span>{item?.label}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default MemorialBreadcrumb;