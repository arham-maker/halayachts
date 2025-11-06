'use client';
import Link from 'next/link';

const CONTENT = {
  heading: "Find Your Perfect Yacht Today!",
  text: "Discover luxury yachts, plan your dream excursions, and connect with premium services all with Hala Yachts. Share, Favorite, download brochure.",
  buttonText: "Book A Yacht Now",
  buttonLink: "/charter",
  bgImage: "/images/perfectyachtbanner.png"
};

const STYLES = {
  section: "lg:py-24 py-8 px-5 bg-white",
  container: "max-w-7xl mx-auto bg-cover bg-center bg-no-repeat rounded-[20px] xl:py-20 sm:py-16 py-10 text-white",
  content: "flex flex-col sm:gap-7 gap-5 px-5 lg:px-20 sm:px-10 text-white",
  heading: "text-3xl md:text-6xl xl:text-[65px] font-light",
  text: "text-base md:text-lg lg:text-xl lg:max-w-[86%] lg:leading-relaxed tracking-wider font-light",
  button: "bg-text-primary text-center text-base p-3 sm:w-2xs w-40 md:text-base font-light tracking-wider rounded cursor-pointer hover:bg-opacity-90 transition duration-300 text-white"
};

export default function PerfectYachtBanner({
  heading = CONTENT.heading,
  text = CONTENT.text,
  buttonText = CONTENT.buttonText,
  buttonLink = CONTENT.buttonLink,
  bgImage = CONTENT.bgImage,
  customStyles = {} // Custom styles object for overriding
}) {
  
  // Merge default styles with custom styles
  const mergedStyles = {
    section: customStyles.section || STYLES.section,
    container: customStyles.container || STYLES.container,
    content: customStyles.content || STYLES.content,
    heading: customStyles.heading || STYLES.heading,
    text: customStyles.text || STYLES.text,
    button: customStyles.button || STYLES.button
  };

  return (
    <section className={mergedStyles.section}>
      <div 
        className={mergedStyles.container}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className={mergedStyles.content}>
          <h1 className={mergedStyles.heading}>
            {heading}
          </h1>

          <p className={mergedStyles.text}>
            {text}
          </p>

          <Link href={buttonLink} className={mergedStyles.button}>
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}