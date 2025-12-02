import React from 'react'

const MeetOurTeam = ({
  mainHeading = "Sail Beyond Ordinary",
  description = "Every yacht in our curated collection is not just a vessel but an exquisitely crafted experience for those who dare to dream big. Our yachts are specially designed to deliver top-notch travel experiences for travelers who desire adventure, pleasure, and the tranquility of the world's most beautiful waters. Choose from:",
  services = [
    "Private Yacht Charters",
    "Corporate Voyages",
    "Honeymoon Escapes",
    "Luxury Yacht Rentals",
    "Explorer or Expedition Yachts",
    "Sailing Yachts"
  ],
  columns = 6,
  customClass = ""
}) => {
  const gridColumns = {
    4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
  };

  return (
    <section className={`lg:py-24 py-8 bg-white ${customClass}`}>
      <div className="max-w-7xl mx-auto px-5 flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          {mainHeading && (
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide">
              {mainHeading}
            </h2>
          )}
          {description && (
            <p className="text-base md:text-lg lg:text-xl tracking-wider font-light">
              {description}
            </p>
          )}
        </div>
        <div className={`grid ${gridColumns[columns]} gap-6`}>
          {services.map((service, index) => (
            <div
              key={index}
              className="group text-center bg-[#F2F2F2] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer p-6 flex items-center justify-center min-h-[150px]"
            >
              <div className="flex-col flex gap-1 w-full">
                <h3 className="text-xl font-semibold text-secondary tracking-wider group-hover:text-primary transition-colors duration-300">
                  {service}
                </h3>
                <div className="mt-2 h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MeetOurTeam