import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BasicInformationForm = ({ formData, onChange, errors }) => {
  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'child', label: 'Son/Daughter' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Brother/Sister' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'friend', label: 'Friend' },
    { value: 'relative', label: 'Other Relative' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="memorial-card p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-sm">1</span>
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">Basic Information</h2>
          <p className="text-muted-foreground text-sm">Tell us about your loved one</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter full name"
          value={formData?.fullName}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
          className="col-span-1 md:col-span-2"
        />

        <Input
          label="Date of Birth"
          type="date"
          value={formData?.birthDate}
          onChange={(e) => handleInputChange('birthDate', e?.target?.value)}
          error={errors?.birthDate}
          required
        />

        <Input
          label="Date of Passing"
          type="date"
          value={formData?.deathDate}
          onChange={(e) => handleInputChange('deathDate', e?.target?.value)}
          error={errors?.deathDate}
          required
        />

        <Input
          label="Birth Location"
          type="text"
          placeholder="City, State/Country"
          value={formData?.birthLocation}
          onChange={(e) => handleInputChange('birthLocation', e?.target?.value)}
          error={errors?.birthLocation}
        />

        <Input
          label="Final Resting Place"
          type="text"
          placeholder="Cemetery, City, State"
          value={formData?.restingPlace}
          onChange={(e) => handleInputChange('restingPlace', e?.target?.value)}
          error={errors?.restingPlace}
        />

        <Select
          label="Your Relationship"
          placeholder="Select your relationship"
          options={relationshipOptions}
          value={formData?.relationship}
          onChange={(value) => handleInputChange('relationship', value)}
          error={errors?.relationship}
          required
          className="col-span-1 md:col-span-2"
        />
      </div>
    </div>
  );
};

export default BasicInformationForm;