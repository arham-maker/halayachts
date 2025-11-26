// import Link from "next/link";
// import Banner from "../../components/Banner";
// import { GoArrowUpRight } from "react-icons/go";
// import YachtCard from "../../components/YachtCard";
// import PerfectYachtBanner from "../../components/PerfectYachtBanner";
// import LocationCard from "../../components/LocationCard";

// const YACHT_DISPLAY_CONFIG = {
//   limit: 6,
//   grid: {
//     base: "grid-cols-1",
//     md: "md:grid-cols-2",
//     lg: "lg:grid-cols-2",
//     xl: "xl:grid-cols-3",
//   },
// };

// const LOCATIONS_GRID_CONFIG = {
//   base: "grid-cols-1",
//   md: "md:grid-cols-2",
//   lg: "lg:grid-cols-3",
//   gap: "gap-8"
// };

// const Curated_Global_Ports = {
//   title: "Curated Global Ports",
//   description:
//     "Every port in our network has been selected for its charm, accessibility, and experience. Each marina offers world-class facilities and a gateway to adventure."
// };

// const FLEET_SECTION = {
//   title: "Featured Yachts",
//   description:
//     "Discover the art of yachting with our featured collection, where luxury meets precision. From modern superyachts to timeless classics, every vessel reflects excellence and effortless sophistication.",
//   viewMore: {
//     text: "View more",
//     link: "/charter",
//   },
// };

// const Design_Routes = {
//   title: "Design Your Own Route",
//   description:
//     "Your journey doesn't have to follow a map, it follows your imagination. Combine multiple destinations, request a bespoke route, or allow our team to curate the perfect itinerary, from coastal Europe to the Caribbean and beyond.",
//   viewMore: {
//     text: "About Us",
//     link: "/about",
//   },
// };

// import { getApiUrl } from '@/lib/utils';

// // Server component that fetches yachts from database
// async function getYachts(limit = null) {
//   try {
//     const apiUrl = getApiUrl('/api/yachts');
    
//     const response = await fetch(apiUrl, {
//       cache: 'no-store',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch yachts: ${response.status}`);
//     }

//     const allYachts = await response.json();
//     return typeof limit === "number" ? allYachts.slice(0, limit) : allYachts;
//   } catch (error) {
//     // Errors are logged by API route
//     return [];
//   }
// }

// // Server component that fetches locations from database
// async function getLocations() {
//   try {
//     const apiUrl = getApiUrl('/api/locations');
    
//     const response = await fetch(apiUrl, {
//       cache: 'no-store',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch locations: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     // Errors are logged by API route
//     return [];
//   }
// }

// // Force dynamic rendering for real-time data
// export const dynamic = 'force-dynamic';

// export default async function Location() {
//   // Fetch both yachts and locations from database
//   const [yachtsData, locationsData] = await Promise.all([
//     getYachts(),
//     getLocations()
//   ]);

//   const displayedYachts = yachtsData.slice(0, YACHT_DISPLAY_CONFIG.limit);
//   const yachtGridClasses = `grid ${YACHT_DISPLAY_CONFIG.grid.base} ${YACHT_DISPLAY_CONFIG.grid.md} ${YACHT_DISPLAY_CONFIG.grid.lg} ${YACHT_DISPLAY_CONFIG.grid.xl} gap-8`;
//   const locationGridClasses = `grid ${LOCATIONS_GRID_CONFIG.base} ${LOCATIONS_GRID_CONFIG.md} ${LOCATIONS_GRID_CONFIG.lg} ${LOCATIONS_GRID_CONFIG.gap}`;

//   // Dynamic count calculate karo - database se aaye yachts data ke according
//   const locationsWithCount = locationsData.map((location) => {
//     const yachtsCount = yachtsData.filter(yacht =>
//       yacht.location?.city === location.title
//     ).length;

//     return {
//       ...location,
//       yachtsCount
//     };
//   });

//   return (
//     <>
//       <Banner
//         mainHeading="Explore the World's Most Exquisite Waters"
//         description="Get ready to embark on a voyage that will fascinate and excite you to the core. Whether you are drawn to the pulsating nightlife, the serenity of pure nature, or the privacy of an exclusive escape, HalaYachts unlocks the door to the world's most enchanting waters."
//         showContact={false}
//         height="medium"
//         backgroundImage="/images/location.png"
//       />

//       {/* Curated Global Ports Section with Location Cards */}
//       <section className="lg:py-24 py-8 bg-white">
//         <div className="max-w-7xl mx-auto px-5 flex flex-col gap-12">
//           <div className="flex flex-col lg:flex-row lg:justify-between gap-5 sm:gap-4">
//             <div className="flex flex-col gap-5 flex-1">
//               <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide mb-4 lg:mb-6">
//                 {Curated_Global_Ports.title}
//               </h1>
//               <p className="text-base md:text-lg lg:text-xl tracking-wider font-light text-gray-700 max-w-4xl">
//                 {Curated_Global_Ports.description}
//               </p>
//             </div>
//           </div>

//           {/* Location Cards Grid */}
//           <div className={locationGridClasses}>
//             {locationsWithCount.length > 0 ? (
//               locationsWithCount.map((location) => (
//                 <LocationCard
//                   key={location.id}
//                   location={location}
//                   yachtsCount={location.yachtsCount}
//                 />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <p className="text-gray-500 text-lg tracking-wider">
//                   No locations available at the moment.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Design Your Own Route Section */}
//       <section className="lg:py-24 py-8">
//         <div className="max-w-7xl mx-auto px-5 flex flex-col gap-10">
//           <div className="flex flex-col lg:flex-row lg:justify-between gap-5 sm:gap-4">
//             <div className="flex flex-col gap-5 flex-1">
//               <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide mb-4 lg:mb-6">
//                 {Design_Routes.title}
//               </h1>
//               <p className="text-base md:text-lg lg:text-xl xl:max-w-5xl tracking-wider font-light text-gray-700">
//                 {Design_Routes.description}
//               </p>
//             </div>

//             <Link
//               href={Design_Routes.viewMore.link}
//               className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 lg:self-center"
//             >
//               <span className="text-base md:text-lg lg:text-xl font-medium">
//                 {Design_Routes.viewMore.text}
//               </span>
//               <GoArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       <PerfectYachtBanner />

//       {/* Featured Yachts Section */}
//       <section className="lg:py-24 py-8">
//         <div className="max-w-7xl mx-auto px-5 flex flex-col gap-10">
//           <div className="flex flex-col lg:flex-row lg:justify-between gap-5 sm:gap-4">
//             <div className="flex flex-col gap-5 flex-1">
//               <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide mb-4 lg:mb-6">
//                 {FLEET_SECTION.title}
//               </h1>
//               <p className="text-base md:text-lg lg:text-xl xl:max-w-5xl tracking-wider font-light text-gray-700">
//                 {FLEET_SECTION.description}
//               </p>
//             </div>

//             <Link
//               href={FLEET_SECTION.viewMore.link}
//               className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 lg:self-center"
//             >
//               <span className="text-base md:text-lg lg:text-xl font-medium">
//                 {FLEET_SECTION.viewMore.text}
//               </span>
//               <GoArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//             </Link>
//           </div>

//           <div className="border-t border-gray-300" aria-hidden="true" />

//           <div className={yachtGridClasses}>
//             {displayedYachts.length > 0 ? (
//               displayedYachts.map((yacht) => (
//                 <YachtCard key={yacht.id} yacht={yacht} />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <p className="text-gray-500 text-lg tracking-wider">
//                   No yachts available at the moment.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

import { Suspense } from 'react';
import Banner from "../../components/Banner";
import Community from "../../components/community";
import WhyHalaYachts from "../../components/WhyHalaYachts";
import YachtCard from "../../components/YachtCard";
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";
import SearchHomeSection from "../components/SearchHomeSection";
import LocationCard from "../../components/LocationCard";
import { connectToDatabase } from '@/lib/mongodb';

function SearchSectionLoader() {
  return (
    <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
  );
}

// Loading component for yachts
function YachtsLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-96 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
}

// Loading component for locations
function LocationsLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
}

const YACHT_DISPLAY_CONFIG = {
  limit: 6,
  grid: {
    base: "grid-cols-1",
    md: "md:grid-cols-2",
    lg: "lg:grid-cols-2",
    xl: "xl:grid-cols-3",
  },
};

const LOCATIONS_GRID_CONFIG = {
  base: "grid-cols-1",
  md: "md:grid-cols-2",
  lg: "lg:grid-cols-3",
  gap: "gap-8",
};

const HERO_CONTENT = {
  smallHeading: "Hala Yachts: Redefining Luxury on Water",
  mainHeading: "Exclusive Yacht Voyages",
  description: "At Hala Yachts, we are driven to provide you with the best of luxury travel in yachting. Whether you seek a serene coastal escape or an extended voyage across the world's most coveted waters, we craft experiences as limitless and refined as the sea itself.",
  cta: {
    showButton: true,
    buttonText: "Book Now",
    buttonLink: "/charter",
  },
  showContact: true,
};

const FLEET_SECTION = {
  title: "Find Your Perfect Yacht",
  description: "Browse through our curated fleet to discover the yacht that best suits your needs. Compare sizes, styles, and amenities, then select the vessel that aligns with your vision for the perfect charter experience.",
  viewMore: {
    text: "View more",
    link: "/charter",
  },
};

const Exclusive_Locations = {
  title: "Exclusive Locations",
  description: "Sail to the world's most breathtaking destinations, surrounded by the comfort and seclusion of your private yacht. Where every horizon is yours to explore in complete comfort.",
  viewMore: {
    text: "View more",
    link: "/location",
  },
};

// Direct database calls for home page
async function getYachtsDirect(limit = null) {
  try {
    const { db } = await connectToDatabase();
    let yachts = await db.collection('yachts').find({}).toArray();
    
    yachts = yachts.map(yacht => ({
      ...yacht,
      _id: yacht._id.toString(),
      id: yacht._id.toString()
    }));

    return typeof limit === "number" ? yachts.slice(0, limit) : yachts;
  } catch (error) {
    console.error('Error fetching yachts directly:', error);
    return [];
  }
}

async function getLocationsDirect(limit = 6) {
  try {
    const { db } = await connectToDatabase();
    let locations = await db.collection('locations').find({}).toArray();
    
    locations = locations.map(location => ({
      ...location,
      _id: location._id.toString(),
      id: location._id.toString()
    }));

    return locations.slice(0, limit);
  } catch (error) {
    console.error('Error fetching locations directly:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

// Yachts Section component
async function YachtsSection() {
  const yachtsData = await getYachtsDirect(6);
  
  const yachtGridClasses = `grid ${YACHT_DISPLAY_CONFIG.grid.base} ${YACHT_DISPLAY_CONFIG.grid.md} ${YACHT_DISPLAY_CONFIG.grid.lg} ${YACHT_DISPLAY_CONFIG.grid.xl} gap-8`;

  return (
    <section className="lg:py-24 py-8 bg-white">
      <div className="max-w-7xl mx-auto px-5 flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-5 sm:gap-4">
          <div className="flex flex-col gap-5 flex-1">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide mb-4 lg:mb-6">
              {FLEET_SECTION.title}
            </h1>
            <p className="text-base md:text-lg lg:text-xl xl:max-w-5xl tracking-wider font-light text-gray-700">
              {FLEET_SECTION.description}
            </p>
          </div>

          <Link
            href={FLEET_SECTION.viewMore.link}
            className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 lg:self-center"
          >
            <span className="text-base md:text-lg lg:text-xl font-medium">
              {FLEET_SECTION.viewMore.text}
            </span>
            <GoArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="border-t border-gray-300" aria-hidden="true" />

        <div className={yachtGridClasses}>
          {yachtsData.length > 0 ? (
            yachtsData.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg tracking-wider">
                No yachts available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Locations Section component
async function LocationsSection() {
  const locationsData = await getLocationsDirect(6);
  const yachtsData = await getYachtsDirect();
  
  const locationGridClasses = `grid ${LOCATIONS_GRID_CONFIG.base} ${LOCATIONS_GRID_CONFIG.md} ${LOCATIONS_GRID_CONFIG.lg} ${LOCATIONS_GRID_CONFIG.gap}`;

  const locationsWithCount = locationsData.map((location) => {
    const yachtsCount = yachtsData.filter(
      (yacht) => yacht.location?.city === location.title
    ).length;

    return {
      ...location,
      yachtsCount,
    };
  });

  return (
    <section className="lg:py-24 py-8">
      <div className="max-w-7xl mx-auto px-5 flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-5 sm:gap-4">
          <div className="flex flex-col gap-5 flex-1">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide mb-4 lg:mb-6">
              {Exclusive_Locations.title}
            </h1>
            <p className="text-base md:text-lg lg:text-xl xl:max-w-5xl tracking-wider font-light text-gray-700">
              {Exclusive_Locations.description}
            </p>
          </div>

          <Link
            href={Exclusive_Locations.viewMore.link}
            className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 lg:self-center"
          >
            <span className="text-base md:text-lg lg:text-xl font-medium">
              {Exclusive_Locations.viewMore.text}
            </span>
            <GoArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="border-t border-gray-300" aria-hidden="true" />

        <div className={locationGridClasses}>
          {locationsWithCount.length > 0 ? (
            locationsWithCount.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                yachtsCount={location.yachtsCount}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg tracking-wider">
                No locations available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Banner
        smallHeading={HERO_CONTENT.smallHeading}
        mainHeading={HERO_CONTENT.mainHeading}
        description={HERO_CONTENT.description}
        showButton={HERO_CONTENT.cta.showButton}
        buttonText={HERO_CONTENT.cta.buttonText}
        buttonLink={HERO_CONTENT.cta.buttonLink}
        showContact={HERO_CONTENT.showContact}
      />
      
      <Suspense fallback={<SearchSectionLoader />}>
        <SearchHomeSection />
      </Suspense>

      <WhyHalaYachts />

      <Suspense fallback={
        <section className="lg:py-24 py-8 bg-white">
          <div className="max-w-7xl mx-auto px-5 flex flex-col gap-10">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-5 sm:gap-4">
              <div className="flex flex-col gap-5 flex-1">
                <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide mb-4 lg:mb-6">
                  {FLEET_SECTION.title}
                </h1>
                <p className="text-base md:text-lg lg:text-xl xl:max-w-5xl tracking-wider font-light text-gray-700">
                  {FLEET_SECTION.description}
                </p>
              </div>
              <div className="lg:self-center">
                <div className="group flex items-center gap-2 text-primary">
                  <span className="text-base md:text-lg lg:text-xl font-medium">
                    {FLEET_SECTION.viewMore.text}
                  </span>
                  <GoArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300" aria-hidden="true" />
            <YachtsLoader />
          </div>
        </section>
      }>
        <YachtsSection />
      </Suspense>

      <Suspense fallback={
        <section className="lg:py-24 py-8">
          <div className="max-w-7xl mx-auto px-5 flex flex-col gap-10">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-5 sm:gap-4">
              <div className="flex flex-col gap-5 flex-1">
                <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide mb-4 lg:mb-6">
                  {Exclusive_Locations.title}
                </h1>
                <p className="text-base md:text-lg lg:text-xl xl:max-w-5xl tracking-wider font-light text-gray-700">
                  {Exclusive_Locations.description}
                </p>
              </div>
              <div className="lg:self-center">
                <div className="group flex items-center gap-2 text-primary">
                  <span className="text-base md:text-lg lg:text-xl font-medium">
                    {Exclusive_Locations.viewMore.text}
                  </span>
                  <GoArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300" aria-hidden="true" />
            <LocationsLoader />
          </div>
        </section>
      }>
        <LocationsSection />
      </Suspense>

      <Community />
    </main>
  );
}