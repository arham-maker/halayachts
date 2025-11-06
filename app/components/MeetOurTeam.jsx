import React from 'react'
import Image from 'next/image'

const MeetOurTeam = ({
  mainHeading = "Meet Our Team",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  teamMembers = [
    {
      name: "Your Name",
      position: "Chief Executive Officer",
      image: "/images/team1.png",
    },
    {
      name: "Your Name",
      position: "Chief Executive Officer",
      image: "/images/team1.png",
    },
    {
      name: "Your Name",
      position: "Chief Executive Officer",
      image: "/images/team1.png",
    },
    {
      name: "Your Name",
      position: "Chief Executive Officer",
      image: "/images/team1.png",
    },
    {
      name: "Your Name",
      position: "Chief Executive Officer",
      image: "/images/team1.png",
    },
    {
      name: "Your Name",
      position: "Chief Executive Officer",
      image: "/images/team1.png",
    }
  ],
  columns = 6,
  customClass = ""
}) => {
  const gridColumns = {
    4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6"
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
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group text-center bg-[#F2F2F2] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer p-3 flex-col flex gap-3"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <div className="flex-col flex gap-1">
                <h3 className="text-xl font-semibold text-secondary tracking-wider">
                  {member.name}
                </h3>
                <p className="text-sm sm:text-base tracking-wide">
                  {member.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MeetOurTeam