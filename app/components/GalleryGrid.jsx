'use client';
import { useCallback } from 'react';
import Image from 'next/image';

const IMAGE_ALT_TEXT = {
  main: (title) => `${title} - Main Image`,
  thumbnail: (title, index) => `${title} - Image ${index + 2}`
};

const OVERLAY_CONTENT = {
  seeMore: (count) => `+${count}`,
  seeMoreText: "See More..."
};

const STYLES = {
  mainContainer: "relative lg:h-[500px] h-86 rounded-xl overflow-hidden cursor-pointer group", 
  thumbnailContainer: "relative h-40 rounded-lg overflow-hidden cursor-pointer group", 
  image: "w-full h-full object-cover transition-transform duration-300",
  mainImage: "object-cover transition-transform duration-300 group-hover:scale-105",
  thumbnailImage: "group-hover:scale-110",
  overlay: "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300",
  seeMoreOverlay: "absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg",
  seeMoreText: "sm:text-5xl text-2xl font-bold text-[#D9D9D9]",
  seeMoreSubtext: "sm:text-2xl text-lg text-white"
};

export default function GalleryGrid({ 
  mainImage, 
  thumbnails, 
  remainingCount, 
  onImageClick,
  title 
}) {
  const handleMainImageClick = useCallback(() => onImageClick(0), [onImageClick]);
  
  const handleThumbnailClick = useCallback((index) => 
    () => onImageClick(index + 1), [onImageClick]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
      <div
        className={STYLES.mainContainer}
        onClick={handleMainImageClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleMainImageClick()}
      >
        <Image
          src={mainImage}
          alt={IMAGE_ALT_TEXT.main(title)}
          fill
          className={`${STYLES.image} ${STYLES.mainImage}`}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className={STYLES.overlay} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {thumbnails.map((img, index) => (
          <div
            key={`${img}-${index}`}
            className={STYLES.thumbnailContainer}
            onClick={handleThumbnailClick(index)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleThumbnailClick(index)()}
          >
            <Image
              src={img}
              alt={IMAGE_ALT_TEXT.thumbnail(title, index)}
              fill
              className={`${STYLES.image} ${STYLES.thumbnailImage}`}
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={index < 2}
            />
            <div className={STYLES.overlay} />
            {index === 5 && remainingCount > 0 && (
              <div className={STYLES.seeMoreOverlay}>
                <span className={STYLES.seeMoreText}>
                  {OVERLAY_CONTENT.seeMore(remainingCount)}
                </span>
                <span className={STYLES.seeMoreSubtext}>
                  {OVERLAY_CONTENT.seeMoreText}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}