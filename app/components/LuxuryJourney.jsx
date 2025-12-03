import React from 'react';
import { 
  FiMap, 
  FiHeart, 
  FiUser,
  FiCompass,
  FiStar,
  FiAnchor
} from 'react-icons/fi';

const LuxuryJourney = ({
  mainHeading = "Start Your Journey: Your World of Luxury Awaits",
  description = "Experience the freedom, beauty, and serenity of private yachting. Whether you're chasing sunsets, celebrating milestones, or exploring hidden coastlines, your dream journey begins with HalaYachts.",
  subHeading = "Live the Extraordinary",
  subDescription = "HalaYachts welcomes you into a world where every sunrise, shore, and every moment feels truly special. From serene island retreats to vibrant coastlines, we provide top-of-the-line yachts that guarantee flexibility, privacy, and the thrill of boundless exploration.",
  features = [
    {
      title: "Iconic Coastlines",
      description: "Sail the world's most coveted coastlines from Miami and the Bahamas to the Arabian Gulf with effortless elegance.",
      icon: <FiMap className="w-7 h-7" />
    },
    {
      title: "Memorable Moments",
      description: "Whether intimate or grand, we transform your time at sea into experiences you will cherish forever.",
      icon: <FiHeart className="w-7 h-7" />
    },
    {
      title: "Personalized Journey",
      description: "No two voyages are alike. Your taste and choices guide every detail of your escape.",
      icon: <FiUser className="w-7 h-7" />
    }
  ],
  customClass = "",
  highlightText = "HalaYachts",
  columns = 3,
  iconSize = "w-8 h-8",
  showIcons = true
}) => {
  
  const renderHeadingWithHighlight = (heading, highlight) => {
    if (!highlight) return heading;
    const regex = new RegExp(`(${highlight})`, 'gi');
    return heading.replace(
      regex,
      '<span class="text-secondary font-medium">$1</span>'
    );
  };

  const renderDescriptionWithHighlight = (description, highlight) => {
    if (!highlight) return description;
    const regex = new RegExp(`(${highlight})`, 'gi');
    return description.replace(
      regex,
      '<span class="text-secondary font-medium">$1</span>'
    );
  };

  // Grid column configuration
  const gridColumns = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
  };

  // Default icons - more relevant to the feature titles
  const defaultIcons = [FiMap, FiHeart, FiUser, FiCompass, FiStar, FiAnchor];

  return (
    <section className={`lg:py-24 py-8  ${customClass}`}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col gap-10">
          {/* Main Heading Section */}
          <div className="flex flex-col gap-5">
            {mainHeading && (
              <h2
                className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide text-[#333333]"
                dangerouslySetInnerHTML={{
                  __html: renderHeadingWithHighlight(mainHeading, highlightText)
                }}
              />
            )}
            
            {description && (
              <p className="text-base md:text-lg lg:text-xl tracking-wider font-light text-[#333333]">
                {description}
              </p>
            )}
          </div>

          {/* Sub Heading Section */}
          <div className="flex flex-col gap-5">
            {subHeading && (
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-[#333333]">
                {subHeading}
              </h3>
            )}
            
            {subDescription && (
              <p
                className="text-base md:text-lg tracking-wider font-light text-[#333333]"
                dangerouslySetInnerHTML={{
                  __html: renderDescriptionWithHighlight(subDescription, highlightText)
                }}
              />
            )}
          </div>

          {/* Features Grid with Icons */}
          {features && features.length > 0 && (
            <div className={`grid ${gridColumns[columns]} gap-6`}>
              {features.map((feature, index) => {
                // Get icon - use provided icon or default
                let IconComponent = feature.icon;
                if (!IconComponent && showIcons) {
                  const DefaultIcon = defaultIcons[index % defaultIcons.length];
                  IconComponent = <DefaultIcon className={`${iconSize}`} />;
                }

                return (
                  <div
                    key={index}
                    className="group text-center bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer p-8 flex flex-col items-center justify-center min-h-[220px]"
                  >
                    <div className="flex-col flex gap-4 w-full">
                      {/* Icon Section */}
                      {showIcons && IconComponent && (
                        <div className="flex justify-center mb-2">
                          <div className="p-4 bg-[#F2F2F2] rounded-full shadow-sm group-hover:bg-primary/10 transition-colors duration-300">
                            <div className="text-secondary group-hover:text-primary transition-colors duration-300">
                              {IconComponent}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <h3 className="text-xl md:text-2xl font-semibold text-secondary tracking-wider group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-base md:text-lg font-light tracking-wider text-[#666666]">
                        {feature.description}
                      </p>
                      
                      <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500 mx-auto max-w-[60px]" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LuxuryJourney;