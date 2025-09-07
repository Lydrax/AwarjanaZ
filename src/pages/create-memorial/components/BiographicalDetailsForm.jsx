import React from 'react';
import Input from '../../../components/ui/Input';

const BiographicalDetailsForm = ({ formData, onChange, errors }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="memorial-card p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-sm">2</span>
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">Life Story</h2>
          <p className="text-muted-foreground text-sm">Share their story and memories</p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Biography <span className="text-error">*</span>
          </label>
          <textarea
            placeholder={`Share the story of their life, their passions, achievements, and what made them special...\n\nExample: "John was a devoted father and husband who spent 30 years as a teacher, inspiring countless students. He loved gardening, playing chess, and volunteering at the local animal shelter. His warm smile and generous heart touched everyone who knew him."`}
            value={formData?.biography}
            onChange={(e) => handleInputChange('biography', e?.target?.value)}
            rows={8}
            className={`w-full px-3 py-2 border rounded-memorial-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical min-h-[200px] ${
              errors?.biography ? 'border-error' : 'border-border'
            }`}
          />
          {errors?.biography && (
            <p className="text-error text-sm mt-1">{errors?.biography}</p>
          )}
          <p className="text-muted-foreground text-xs mt-2">
            Share their personality, achievements, hobbies, and what made them unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Occupation"
            type="text"
            placeholder="e.g., Teacher, Engineer, Homemaker"
            value={formData?.occupation}
            onChange={(e) => handleInputChange('occupation', e?.target?.value)}
            error={errors?.occupation}
          />

          <Input
            label="Hobbies & Interests"
            type="text"
            placeholder="e.g., Gardening, Reading, Cooking"
            value={formData?.hobbies}
            onChange={(e) => handleInputChange('hobbies', e?.target?.value)}
            error={errors?.hobbies}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Favorite Quote or Saying
          </label>
          <textarea
            placeholder={`A meaningful quote, saying, or words they lived by...\n\nExample: "Life is not measured by the number of breaths we take, but by the moments that take our breath away."`}
            value={formData?.favoriteQuote}
            onChange={(e) => handleInputChange('favoriteQuote', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-memorial-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
          />
          <p className="text-muted-foreground text-xs mt-2">
            Optional: A quote, motto, or saying that represented them
          </p>
        </div>
      </div>
    </div>
  );
};

export default BiographicalDetailsForm;