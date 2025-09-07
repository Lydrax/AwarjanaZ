import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PhotoGallery = ({ photos = [] }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setCurrentIndex(0);
  };

  const navigatePhoto = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % photos?.length
      : (currentIndex - 1 + photos?.length) % photos?.length;
    
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos?.[newIndex]);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') closeLightbox();
    if (e?.key === 'ArrowLeft') navigatePhoto('prev');
    if (e?.key === 'ArrowRight') navigatePhoto('next');
  };

  if (!photos || photos?.length === 0) {
    return (
      <div className="bg-card rounded-memorial-lg p-8 text-center">
        <Icon name="Images" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Photos Yet</h3>
        <p className="text-muted-foreground">Photos will appear here when they are added to this memorial.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-foreground">Photo Gallery</h2>
          <p className="text-muted-foreground">{photos?.length} {photos?.length === 1 ? 'photo' : 'photos'}</p>
        </div>
      </div>
      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos?.map((photo, index) => (
          <div
            key={photo?.id}
            className="relative group cursor-pointer memorial-interactive"
            onClick={() => openLightbox(photo, index)}
          >
            <div className="aspect-square rounded-memorial-md overflow-hidden bg-muted">
              <Image
                src={photo?.url}
                alt={photo?.caption || `Memorial photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-memorial-md flex items-center justify-center">
              <Icon 
                name="Expand" 
                size={24} 
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              />
            </div>

            {/* Photo Info */}
            {photo?.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-memorial-md">
                <p className="text-white text-sm font-medium truncate">{photo?.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="memorial-lightbox-backdrop flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div 
            className="memorial-lightbox-content bg-background rounded-memorial-lg shadow-memorial-strong max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e?.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name="Images" size={20} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {photos?.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeLightbox}
                iconName="X"
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
            </div>

            {/* Photo Display */}
            <div className="relative">
              <div className="flex items-center justify-center bg-muted min-h-[400px] max-h-[60vh]">
                <Image
                  src={selectedPhoto?.url}
                  alt={selectedPhoto?.caption || 'Memorial photo'}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Navigation Buttons */}
              {photos?.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={() => navigatePhoto('prev')}
                    iconName="ChevronLeft"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={() => navigatePhoto('next')}
                    iconName="ChevronRight"
                  />
                </>
              )}
            </div>

            {/* Photo Details */}
            {selectedPhoto?.caption && (
              <div className="p-4 border-t border-border">
                <p className="text-foreground font-medium">{selectedPhoto?.caption}</p>
                {selectedPhoto?.uploadedBy && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Uploaded by {selectedPhoto?.uploadedBy}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;