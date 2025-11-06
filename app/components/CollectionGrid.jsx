import React from 'react'
import AnimatedCollectionCard from './AnimatedCollectionCard'

const CollectionGrid = ({
  items = [
    {
      number: "2000+",
      title: "Yachts Collection",
    },
    {
      number: "50+",
      title: "Renowned Locations",
    },
    {
      number: "300+",
      title: "Satisfied Clients",
    },
    {
      number: "1200+",
      title: "Expert Crews",
    }
  ],
  columns = 4,
  customClass = ""
}) => {

  const gridColumns = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
  };

  return (
    <section className={`lg:py-24 py-8 ${customClass}`}>
      <div className="max-w-7xl mx-auto px-5">
        <div className={`grid ${gridColumns[columns]} gap-6`}>
          {items.map((item, index) => (
            <AnimatedCollectionCard 
              key={index} 
              item={item} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CollectionGrid