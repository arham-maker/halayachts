'use client';

export default function YachtImage({ src, alt, className }) {
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
  };

  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
}