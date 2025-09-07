import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImageUploadSection = ({ formData, onChange, errors }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleFileInput = (e) => {
    if (e?.target?.files) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files)?.filter(file => {
      const isValidType = file?.type?.startsWith('image/');
      const isValidSize = file?.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles?.length > 0) {
      const newImages = validFiles?.map(file => ({
        id: Date.now() + Math.random(),
        file,
        url: URL.createObjectURL(file),
        name: file?.name,
        size: file?.size
      }));

      onChange({
        ...formData,
        images: [...(formData?.images || []), ...newImages]?.slice(0, 10) // Max 10 images
      });
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = (formData?.images || [])?.filter(img => img?.id !== imageId);
    onChange({ ...formData, images: updatedImages });
  };

  const setMainImage = (imageId) => {
    const updatedImages = (formData?.images || [])?.map(img => ({
      ...img,
      isMain: img?.id === imageId
    }));
    onChange({ ...formData, images: updatedImages });
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="memorial-card p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-sm">3</span>
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">Photos</h2>
          <p className="text-muted-foreground text-sm">Upload cherished memories</p>
        </div>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-memorial-lg p-8 text-center memorial-interactive transition-all duration-200 ${
          dragActive 
            ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50 hover:bg-accent/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Icon name="ImagePlus" size={24} className="text-muted-foreground" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Upload Photos
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Drag and drop images here, or click to browse
            </p>
            <Button variant="outline" size="sm">
              Choose Files
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported formats: JPG, PNG, GIF</p>
            <p>Maximum file size: 5MB per image</p>
            <p>Maximum 10 images total</p>
          </div>
        </div>
      </div>
      {errors?.images && (
        <p className="text-error text-sm">{errors?.images}</p>
      )}
      {/* Image Previews */}
      {formData?.images && formData?.images?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">
            Uploaded Photos ({formData?.images?.length}/10)
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData?.images?.map((image) => (
              <div key={image?.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-memorial-md bg-muted">
                  <Image
                    src={image?.url}
                    alt={image?.name}
                    className="w-full h-full object-cover memorial-interactive group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-memorial-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    {!image?.isMain && (
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          setMainImage(image?.id);
                        }}
                        className="p-2 bg-white rounded-full memorial-interactive hover:bg-accent hover:text-accent-foreground"
                        title="Set as main photo"
                      >
                        <Icon name="Star" size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        removeImage(image?.id);
                      }}
                      className="p-2 bg-white rounded-full memorial-interactive hover:bg-error hover:text-error-foreground"
                      title="Remove photo"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Main Photo Badge */}
                {image?.isMain && (
                  <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded-memorial-sm text-xs font-medium flex items-center space-x-1">
                    <Icon name="Star" size={12} />
                    <span>Main</span>
                  </div>
                )}
                
                {/* File Info */}
                <div className="mt-2">
                  <p className="text-xs text-foreground truncate" title={image?.name}>
                    {image?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(image?.size / 1024 / 1024)?.toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground">
            Click the star icon to set a main photo. The main photo will be displayed prominently on the memorial page.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;