import React from 'react'

const ExceptionalService = ({
  backgroundImage = "/images/about_us.png",
  subHeading = "Exceptional Service",
  mainHeading = "Redefining the Luxury Yachting Experience",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  features = [
    {
      title: "Expertise You Can Trust",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et"
    },
    {
      title: "Expertise You Can Trust",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et"
    },
    {
      title: "Expertise You Can Trust",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et"
    }
  ],
  customClass = ""
}) => {
  return (
    <section className={`relative ${customClass}`}>
      <div className="bg-white h-1/3 absolute top-0 left-0 w-full z-0"></div>

      <div className="relative z-10 lg:py-16 py-8">
        <div className="max-w-7xl mx-auto px-5">
          <div
            className="relative rounded-2xl overflow-hidden bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          >

            <div className="relative z-10 text-white px-6 md:px-12 lg:px-10 py-6 w-full flex flex-col gap-5">
              {subHeading && (
                <h3 className="text-lg lg:text-3xl font-light tracking-wider">
                  {subHeading}
                </h3>
              )}

              {mainHeading && (
                <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-6xl font-light tracking-wide">
                  {mainHeading}
                </h2>
              )}

              {description && (
                <p className="text-base md:text-lg tracking-wider font-light">
                  {description}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl md:p-6 p-3.5 border flex flex-col gap-2.5"
                  >
                    <h4 className="text-xl md:text-4xl font-light text-secondary">
                      {feature.title}
                    </h4>
                    <p className="text-base md:text-xl font-light text-black tracking-wider">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExceptionalService