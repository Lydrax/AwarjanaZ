import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FormActions = ({ 
  onSaveDraft, 
  onPreview, 
  onSubmit, 
  isLoading, 
  isDraftSaving, 
  canPreview,
  canSubmit 
}) => {
  return (
    <div className="memorial-card p-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Draft Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSaveDraft}
            loading={isDraftSaving}
            iconName="Save"
            iconPosition="left"
            disabled={isLoading}
          >
            Save Draft
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>Auto-saved 2 minutes ago</span>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onPreview}
            disabled={!canPreview || isLoading}
            iconName="Eye"
            iconPosition="left"
          >
            Preview
          </Button>
          
          <Button
            variant="default"
            onClick={onSubmit}
            loading={isLoading}
            disabled={!canSubmit}
            iconName="Heart"
            iconPosition="left"
            size="lg"
          >
            Create Memorial
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Memorial Creation Progress</span>
          <span>4 of 5 sections completed</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: '80%' }}
          ></div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Complete all sections to create your memorial
        </p>
      </div>

      {/* Help Text */}
      <div className="mt-4 bg-muted/30 rounded-memorial-md p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Need Help?</p>
            <p>
              Take your time creating this memorial. Your progress is automatically saved, 
              and you can return to complete it later. If you need assistance, our support 
              team is here to help at{' '}
              <a href="mailto:support@memorialtribute.com" className="text-accent hover:underline">
                support@memorialtribute.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormActions;