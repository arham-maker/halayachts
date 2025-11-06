'use client';

import GalleryGrid from "./GalleryGrid";

const CONTENT = {
  heading: "Image Gallery"
};

const STYLES = {
  section: "lg:py-24 py-8",
  container: "max-w-7xl mx-auto px-5 flex flex-col md:gap-10 gap-5",
  heading: "text-3xl md:text-6xl lg:text-6xl xl:text-[65px] font-light tracking-wide"
};

export default function GallerySection({ 
  mainImage,
  thumbnails,
  remainingCount,
  onImageClick,
  title,
  heading = CONTENT.heading
}) {
  return (
    <section className={STYLES.section}>
      <div className={STYLES.container}>
        <h2 className={STYLES.heading}>
          {heading}
        </h2>
        <GalleryGrid
          mainImage={mainImage}
          thumbnails={thumbnails}
          remainingCount={remainingCount}
          onImageClick={onImageClick}
          title={title}
        />
      </div>
    </section>
  );
}