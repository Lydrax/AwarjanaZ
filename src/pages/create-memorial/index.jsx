import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import MemorialBreadcrumb from '../../components/ui/MemorialBreadcrumb';
import BasicInformationForm from './components/BasicInformationForm';
import BiographicalDetailsForm from './components/BiographicalDetailsForm';
import ImageUploadSection from './components/ImageUploadSection';
import TemplateSelection from './components/TemplateSelection';
import PrivacySettings from './components/PrivacySettings';
import FormActions from './components/FormActions';
import Icon from '../../components/AppIcon';
import memorialService from '../../services/memorialService';

const CreateMemorial = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    birthDate: '',
    deathDate: '',
    birthLocation: '',
    restingPlace: '',
    relationship: '',
    
    // Biographical Details
    biography: '',
    occupation: '',
    hobbies: '',
    favoriteQuote: '',
    
    // Images
    images: [],
    
    // Template
    template: 'classic',
    
    // Privacy
    privacy: 'public',
    notifications: {
      tributes: true,
      anniversaries: true,
      photoUploads: false
    }
  });

  // Auto-save draft functionality
  useEffect(() => {
    if (!user) return;

    const autoSaveInterval = setInterval(() => {
      if (formData?.fullName || formData?.biography) {
        handleSaveDraft(true); // Silent save
      }
    }, 120000); // Auto-save every 2 minutes

    return () => clearInterval(autoSaveInterval);
  }, [formData, user]);

  const validateForm = () => {
    const newErrors = {};

    // Basic Information Validation
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData?.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }
    if (!formData?.deathDate) {
      newErrors.deathDate = 'Date of passing is required';
    }
    if (formData?.birthDate && formData?.deathDate && new Date(formData.birthDate) >= new Date(formData.deathDate)) {
      newErrors.deathDate = 'Date of passing must be after birth date';
    }
    if (!formData?.relationship) {
      newErrors.relationship = 'Please specify your relationship';
    }

    // Biography Validation
    if (!formData?.biography?.trim()) {
      newErrors.biography = 'Biography is required to create a meaningful memorial';
    } else if (formData?.biography?.trim()?.length < 50) {
      newErrors.biography = 'Please provide a more detailed biography (at least 50 characters)';
    }

    // Images Validation
    if (!formData?.images || formData?.images?.length === 0) {
      newErrors.images = 'Please upload at least one photo';
    }

    // Template Validation
    if (!formData?.template) {
      newErrors.template = 'Please select a memorial template';
    }

    // Privacy Validation
    if (!formData?.privacy) {
      newErrors.privacy = 'Please select privacy settings';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSaveDraft = async (silent = false) => {
    if (!user) return;
    if (!silent) setIsDraftSaving(true);
    
    try {
      // Save to localStorage as backup
      localStorage.setItem('memorial_draft', JSON.stringify({
        ...formData,
        lastSaved: new Date()?.toISOString(),
        userId: user?.id
      }));
      
      if (!silent) {
        // Could implement draft saving to database here
        console.log('Draft saved successfully');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      if (!silent) setIsDraftSaving(false);
    }
  };

  const handlePreview = () => {
    if (validateForm()) {
      // Navigate to preview with form data
      navigate('/memorial-page', { 
        state: { 
          previewData: formData,
          isPreview: true 
        } 
      });
    } else {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.text-error');
      if (firstErrorElement) {
        firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setErrors({ submit: 'Please sign in to create a memorial' });
      return;
    }

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.text-error');
      if (firstErrorElement) {
        firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare memorial data for Supabase
      const memorialData = {
        full_name: formData?.fullName,
        birth_date: formData?.birthDate,
        death_date: formData?.deathDate,
        birth_location: formData?.birthLocation,
        resting_place: formData?.restingPlace,
        relationship: formData?.relationship,
        biography: formData?.biography,
        occupation: formData?.occupation,
        hobbies: formData?.hobbies,
        favorite_quote: formData?.favoriteQuote,
        template: formData?.template,
        privacy: formData?.privacy,
        created_by: user?.id
      };

      // Create memorial in Supabase
      const { data: memorial, error } = await memorialService?.createMemorial(memorialData);

      if (error) {
        setErrors({ submit: error?.message || 'Failed to create memorial' });
        return;
      }

      // Upload images if any
      if (formData?.images?.length > 0 && memorial?.id) {
        for (let i = 0; i < formData?.images?.length; i++) {
          const image = formData?.images?.[i];
          const isPrimary = i === 0; // First image is primary
          
          await memorialService?.uploadMemorialImage(
            memorial?.id,
            image?.file || image, // Handle both File objects and URLs
            image?.caption || '',
            isPrimary
          );
        }
      }
      
      // Clear draft from localStorage
      localStorage.removeItem('memorial_draft');
      
      // Navigate to the created memorial
      navigate('/memorial-page', { 
        state: { 
          memorialId: memorial?.id,
          isNewlyCreated: true 
        } 
      });
    } catch (error) {
      console.error('Failed to create memorial:', error);
      setErrors({ submit: 'Failed to create memorial. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthAction = (action) => {
    if (action === 'logout') {
      navigate('/memorial-search');
    } else if (action === 'login' || action === 'register') {
      navigate('/memorial-search');
    }
  };

  // Load draft on component mount
  useEffect(() => {
    if (!user) return;

    const savedDraft = localStorage.getItem('memorial_draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        // Only load draft if it belongs to current user
        if (draftData?.userId === user?.id) {
          setFormData(draftData);
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [user]);

  const canPreview = formData?.fullName && formData?.biography && formData?.images?.length > 0;
  const canSubmit = canPreview && formData?.relationship && formData?.birthDate && formData?.deathDate && user;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user ? {
          id: user?.id,
          name: userProfile?.full_name || user?.email?.split('@')?.[0],
          email: user?.email
        } : null} 
        onAuthAction={handleAuthAction}
      />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <MemorialBreadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={24} className="text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Create Memorial
                </h1>
                <p className="text-muted-foreground">
                  Honor your loved one with a beautiful digital memorial
                </p>
              </div>
            </div>
            
            <div className="bg-accent/10 border border-accent/20 rounded-memorial-md p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Heart" size={16} className="text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="text-accent font-medium mb-1">Creating with Care</p>
                  <p className="text-muted-foreground">
                    Take your time to create a meaningful tribute. Your progress is automatically saved, 
                    and you can return to complete this memorial at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Check */}
          {!user && (
            <div className="memorial-card p-6 mb-8 border-accent bg-accent/5">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="User" size={20} className="text-accent" />
                <h3 className="text-lg font-semibold text-accent">Sign In Required</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Please sign in to create and save memorial pages. You can preview your memorial without signing in.
              </p>
              <button
                onClick={() => navigate('/memorial-search')}
                className="bg-accent text-accent-foreground px-4 py-2 rounded-memorial-sm hover:bg-accent/90 transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          )}

          {/* Form Sections */}
          <div className="space-y-8">
            <BasicInformationForm
              formData={formData}
              onChange={setFormData}
              errors={errors}
            />

            <BiographicalDetailsForm
              formData={formData}
              onChange={setFormData}
              errors={errors}
            />

            <ImageUploadSection
              formData={formData}
              onChange={setFormData}
              errors={errors}
            />

            <TemplateSelection
              formData={formData}
              onChange={setFormData}
              errors={errors}
            />

            <PrivacySettings
              formData={formData}
              onChange={setFormData}
              errors={errors}
            />

            {/* Submit Error */}
            {errors?.submit && (
              <div className="memorial-card p-4 border-error bg-error/5">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <p className="text-error text-sm">{errors?.submit}</p>
                </div>
              </div>
            )}

            <FormActions
              onSaveDraft={() => handleSaveDraft(false)}
              onPreview={handlePreview}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isDraftSaving={isDraftSaving}
              canPreview={canPreview}
              canSubmit={canSubmit}
              isAuthenticated={!!user}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateMemorial;