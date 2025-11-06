import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Escape = ({
  mainHeading = "Hala Yachts – Let's Plan Your Escape.",
  description = "We are committed to delivering an exceptional yachting experience, combining world-class luxury, performance, and personalized service.",
  paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  showButton = true,
  buttonText = "Contact Us",
  buttonLink = "/contact",
  imageSrc = "/images/about01.png",
  imageAlt = "Hala Yachts",
  showImage = true,
  customClass = ""
}) => {

  const renderHeadingWithHighlight = (heading) => {
    return heading.replace(
      'Hala Yachts',
      '<span class="text-secondary font-medium">Hala Yachts</span>'
    );
  };

  return (
    <section className={`lg:py-24 py-8 bg-white ${customClass}`}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col gap-5">
          {mainHeading && (
            <h2
              className="text-3xl md:text-5xl lg:text-6xl xl:text-[65px] font-light tracking-wide leading-tight"
              dangerouslySetInnerHTML={{
                __html: renderHeadingWithHighlight(mainHeading)
              }}
            />
          )}
          {description && (
            <p className="text-base md:text-lg lg:text-3xl max-w-6xl font-light text-[#333333]">
              {description}
            </p>
          )}
          {paragraph && (
            <p className="text-base md:text-lg lg:text-xl font-light tracking-wider text-[#333333] ">
              {paragraph}
            </p>
          )}
          {showButton && (
            <Link href={buttonLink}>
              <button className="bg-text-primary text-base p-3 sm:w-2xs w-40 md:text-base font-light tracking-wider rounded cursor-pointer hover:bg-opacity-90 transition duration-300 text-white">
                {buttonText}
              </button>
            </Link>
          )}
          {showImage && (
            <div className="mt-8">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={1200}
                height={600}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Escape