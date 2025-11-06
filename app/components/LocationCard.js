// components/LocationCard.js
import Link from "next/link";
import Image from "next/image";
import { BsArrowUpRight } from "react-icons/bs";

const LocationCard = ({ 
  location, 
  limit = null, // Kitni locations dikhani hai
  showIds = [], // Konse specific IDs dikhane hain
  excludeIds = [], // Kin IDs ko exclude karna hai
  customLink = null, // Custom link agar different URL chahiye
  showCount = false, // Yachts count dikhana hai ya nahi
  yachtsCount = 0, // Yachts count agar showCount true ho
  cardHeight = "md:h-80 h-64", // Custom height
  showLearnMore = true, // Learn more button show/hide
  learnMoreText = "Learn more" // Custom text for learn more
}) => {
  
  // Agar limit set hai toh filter karo
  const shouldShowLocation = () => {
    if (limit && showIds.length > 0) {
      return showIds.includes(location.id);
    }
    if (limit) {
      // Pehli 'limit' locations dikhao
      return true; // Parent component mein slice karna hoga
    }
    if (showIds.length > 0) {
      return showIds.includes(location.id);
    }
    if (excludeIds.length > 0) {
      return !excludeIds.includes(location.id);
    }
    return true;
  };

  if (!shouldShowLocation()) {
    return null;
  }

  const linkUrl = customLink || `/location/${location.id}`;

  return (
    <Link
      href={linkUrl}
      className="block group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
    >
      <div className={`relative ${cardHeight} overflow-hidden`}>
        <Image
          src={location.image}
          alt={`Luxury yacht charter in ${location.title}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
        
        {/* Yachts count agar showCount true ho */}
        {showCount && yachtsCount > 0 && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {yachtsCount} {yachtsCount === 1 ? 'yacht' : 'yachts'}
          </div>
        )}
      </div>

      <div className="p-2 absolute bottom-2.5 z-10 w-[97%] bg-white left-1/2 -translate-x-1/2 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold flex-1 line-clamp-1 text-wider">
            {location.title}
          </h3>
          
          {showLearnMore && (
            <div className="flex items-center gap-1 text-gray-500 group-hover:text-primary group-hover:gap-2 transition-all duration-300">
              <span className="text-base text-secondary text-wider font-semibold">
                {learnMoreText}
              </span>
              <BsArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LocationCard;