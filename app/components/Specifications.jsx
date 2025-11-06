'use client';

const formatSpecValue = (key, value) => {
  if (value === 'Nil' || value === 'null') return value;
  if (!value) return 'Not specified';
  
  if (key === 'length' || key === 'beam' || key === 'draft') {
    return `${value} ft`;
  }
  if (key === 'cruising_knots') {
    return `${value} knots`;
  }
  return value;
};

const CONTENT = {
  heading: "Specifications"
};

const formatLabel = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const STYLES = {
  section: "lg:py-24 py-8",
  container: "max-w-7xl mx-auto px-5 flex flex-col md:gap-10 gap-5",
  heading: "text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide",
  grid: "grid grid-cols-1 lg:grid-cols-2 gap-x-12",
  specCard: "flex justify-between py-6 border-b border-b-[#D3D3D3]",
  specTitle: "text-xl text-[#404040] font-light tracking-wide",
  specValue: "text-xl text-secondary font-bold tracking-wide"
};

export default function SpecificationsSection({ specifications }) {
  if (!specifications) return null;

  const specsArray = Object.entries(specifications);
  const totalItems = specsArray.length;
  const isEvenTotal = totalItems % 2 === 0;

  return (
    <section className={STYLES.section}>
      <div className={STYLES.container}>
        <h2 className={STYLES.heading}>
           {CONTENT.heading}
        </h2>
        
        <div className={STYLES.grid}>
          {specsArray.map(([key, value], index) => {
            // Mobile: last item pe border remove
            const isLastItemMobile = index === totalItems - 1;
            
            // Desktop: last row ke items pe border remove
            const isLastRowDesktop = index >= totalItems - 2;
            const isLastItemDesktop = index === totalItems - 1;
            
            return (
              <div 
                key={key} 
                className={`${STYLES.specCard} ${
                  // Mobile: last item pe border remove
                  (isLastItemMobile) || 
                  // Desktop: last row ke items pe border remove
                  (isLastRowDesktop && isEvenTotal) || 
                  (isLastItemDesktop && !isEvenTotal)
                    ? 'border-b-1 lg:border-b-0' 
                    : ''
                }`}
              >
                <h3 className={STYLES.specTitle}>
                  {formatLabel(key)}
                </h3>
                <p className={STYLES.specValue}>
                  {formatSpecValue(key, value)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}