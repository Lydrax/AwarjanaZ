import React from 'react';
import Icon from '../../../components/AppIcon';

const TemplateSelection = ({ formData, onChange, errors }) => {
  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional memorial layout with elegant typography',
      preview: 'A timeless design with photo gallery and biographical sections',
      icon: 'BookOpen',
      color: 'bg-slate-100 border-slate-200',
      accentColor: 'text-slate-600'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, contemporary design with focus on imagery',
      preview: 'Minimalist layout emphasizing photos and key memories',
      icon: 'Layers',
      color: 'bg-blue-50 border-blue-200',
      accentColor: 'text-blue-600'
    },
    {
      id: 'garden',
      name: 'Garden',
      description: 'Nature-inspired theme with soft, peaceful colors',
      preview: 'Gentle design with floral elements and warm tones',
      icon: 'Flower',
      color: 'bg-green-50 border-green-200',
      accentColor: 'text-green-600'
    },
    {
      id: 'celebration',
      name: 'Celebration',
      description: 'Vibrant theme celebrating a life well-lived',
      preview: 'Colorful design focusing on joy and cherished moments',
      icon: 'Heart',
      color: 'bg-rose-50 border-rose-200',
      accentColor: 'text-rose-600'
    },
    {
      id: 'spiritual',
      name: 'Spiritual',
      description: 'Peaceful design with religious and spiritual elements',
      preview: 'Serene layout with space for prayers and reflections',
      icon: 'Sun',
      color: 'bg-amber-50 border-amber-200',
      accentColor: 'text-amber-600'
    },
    {
      id: 'military',
      name: 'Military Honor',
      description: 'Respectful tribute for those who served',
      preview: 'Dignified design honoring military service and sacrifice',
      icon: 'Shield',
      color: 'bg-red-50 border-red-200',
      accentColor: 'text-red-600'
    }
  ];

  const handleTemplateSelect = (templateId) => {
    onChange({ ...formData, template: templateId });
  };

  return (
    <div className="memorial-card p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-sm">4</span>
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">Memorial Theme</h2>
          <p className="text-muted-foreground text-sm">Choose a design that reflects their spirit</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((template) => (
          <div
            key={template?.id}
            className={`relative border-2 rounded-memorial-lg p-4 cursor-pointer memorial-interactive transition-all duration-200 ${
              formData?.template === template?.id
                ? 'border-accent bg-accent/5 shadow-memorial-medium'
                : 'border-border hover:border-accent/50 hover:shadow-memorial-soft'
            } ${template?.color}`}
            onClick={() => handleTemplateSelect(template?.id)}
          >
            {/* Selection Indicator */}
            {formData?.template === template?.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Icon name="Check" size={14} className="text-accent-foreground" />
              </div>
            )}

            {/* Template Preview */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-memorial-md flex items-center justify-center ${template?.accentColor} bg-white/50`}>
                  <Icon name={template?.icon} size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{template?.name}</h3>
                  <p className="text-xs text-muted-foreground">{template?.description}</p>
                </div>
              </div>

              {/* Mini Preview */}
              <div className="bg-white/50 rounded-memorial-sm p-3 space-y-2">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-muted rounded-memorial-sm"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-muted rounded w-3/4"></div>
                    <div className="h-1.5 bg-muted/60 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-muted/60 rounded"></div>
                  <div className="h-1.5 bg-muted/60 rounded w-4/5"></div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {template?.preview}
              </p>
            </div>
          </div>
        ))}
      </div>
      {errors?.template && (
        <p className="text-error text-sm">{errors?.template}</p>
      )}
      <div className="bg-muted/30 rounded-memorial-md p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Template Customization</p>
            <p>You can further customize colors, fonts, and layout after creating the memorial. Each template provides a foundation that can be personalized to honor your loved one's unique personality.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;