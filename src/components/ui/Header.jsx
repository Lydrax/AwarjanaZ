import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user = null, currentMemorial = null, onAuthAction = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Search', path: '/memorial-search', icon: 'Search', authRequired: false },
    { label: 'Create', path: '/create-memorial', icon: 'Plus', authRequired: true },
    { label: 'Dashboard', path: '/memorial-dashboard', icon: 'LayoutDashboard', authRequired: true },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleAuthAction = (action) => {
    onAuthAction(action);
    setIsUserMenuOpen(false);
  };

  const getMemorialDisplayName = () => {
    if (currentMemorial && location?.pathname === '/memorial-page') {
      return currentMemorial?.name || 'Memorial';
    }
    return null;
  };

  const memorialName = getMemorialDisplayName();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <button
            onClick={() => navigate('/memorial-search')}
            className="flex items-center space-x-3 memorial-interactive hover:opacity-80"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={20} color="var(--color-primary-foreground)" />
            </div>
            <span className="font-heading font-semibold text-lg text-foreground hidden sm:block">
              Memorial Tribute
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => {
            if (item?.authRequired && !user) return null;
            
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-memorial-md text-sm font-medium transition-all duration-200 memorial-interactive ${
                  isActivePath(item?.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            );
          })}
          
          {/* Dynamic Memorial Name */}
          {memorialName && (
            <div className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-accent bg-accent/10 rounded-memorial-md">
              <Icon name="User" size={16} />
              <span className="max-w-32 truncate">{memorialName}</span>
            </div>
          )}
        </nav>

        {/* User Menu & Mobile Toggle */}
        <div className="flex items-center space-x-2">
          {/* User Authentication Menu */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-memorial-md memorial-interactive hover:bg-muted"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="var(--color-primary-foreground)" />
                  </div>
                  <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-memorial-md shadow-memorial-medium animate-memorial-scale-in">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border">
                        {user?.name || user?.email}
                      </div>
                      <button
                        onClick={() => handleAuthAction('profile')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-memorial-sm memorial-interactive"
                      >
                        <Icon name="Settings" size={16} />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => handleAuthAction('logout')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-memorial-sm memorial-interactive"
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAuthAction('login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleAuthAction('register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-memorial-md memorial-interactive hover:bg-muted"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-memorial-fade-in">
          <div className="p-4 space-y-2">
            {navigationItems?.map((item) => {
              if (item?.authRequired && !user) return null;
              
              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-memorial-md text-sm font-medium memorial-interactive ${
                    isActivePath(item?.path)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </button>
              );
            })}

            {/* Mobile Memorial Name */}
            {memorialName && (
              <div className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-accent bg-accent/10 rounded-memorial-md">
                <Icon name="User" size={18} />
                <span className="truncate">{memorialName}</span>
              </div>
            )}

            {/* Mobile Auth Actions */}
            {!user && (
              <div className="pt-4 border-t border-border space-y-2">
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => handleAuthAction('login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => handleAuthAction('register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {(isMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => {
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;