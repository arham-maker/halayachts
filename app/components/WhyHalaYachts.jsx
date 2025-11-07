import React from 'react';
import Link from 'next/link';
import { MdArrowOutward } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";
import { FaGlobeAmericas } from "react-icons/fa";
import { AiTwotoneSafetyCertificate } from "react-icons/ai";
import { TbCrown } from "react-icons/tb";
import AnimatedCard from './AnimatedCard';

const WhyHalaYachts = ({
  mainHeading = "Why HalaYachts is the right choice for you.",
  mainText = "Choosing Hala Yachts means stepping into a world where precision, privacy, and passion for the sea shape every detail of your journey. We don't just charter yachts, we design moments that stay with you long after you've returned to shore.",
  leftColumnHeading = "Unmatched Fleet",
  leftColumnText1 = "Our yachts are hand-selected for their craftsmanship, design, and performance, each maintained to the highest standards of luxury and reliability.",
  leftColumnText2 = "From sleek modern superyachts to timeless classics, every vessel offers a perfect balance of elegance, comfort, and cutting-edge innovation on the open sea.",
  learnMoreLink = "/charter",
  learnMoreText = "Learn more",
  features = [
    {
      icon: <TbUsersGroup className="text-white" size={28} />,
      title: "Elite Crews",
      description: "From seasoned captains to attentive staff, our crews deliver seamless service with discretion, expertise, and care."
    },
    {
      icon: <FaGlobeAmericas className="text-white" size={28} />,
      title: "Bespoke Journeys",
      description: "No two charters are the same, each itinerary is designed around your preferences, destinations, and lifestyle."
    },
    {
      icon: <AiTwotoneSafetyCertificate className="text-white" size={28} />,
      title: "Safety Assured",
      description: "Every vessel undergoes rigorous inspections and carries a flawless safety record, so you can sail with confidence."
    },
    {
      icon: <TbCrown className="text-white" size={28} />,
      title: "Effortless Luxury",
      description: "From booking to disembarkation, we handle every detail, leaving you free to simply enjoy the experience."
    }
  ],
  imageSrc = "/images/whyhalayachts.png",
  showDivider = true
}) => {

  const renderHeadingWithHighlight = (heading) => {
    return heading.replace('HalaYachts', '<span class="text-secondary font-medium">HalaYachts</span>');
  };

  return (
    <section className="lg:py-24 py-8">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col gap-5">
          <h2
            className="text-3xl md:text-6xl lg:text-6xl xl:text-[65px] font-light tracking-wide"
            dangerouslySetInnerHTML={{ __html: renderHeadingWithHighlight(mainHeading) }}
          />
          <p className="text-base md:text-lg lg:text-xl sm:max-w-5xl leading-relaxed font-light">
            {mainText}
          </p>
        </div>
        {showDivider && (
          <div className="border-t border-gray-300 my-10"></div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className="relative rounded-lg overflow-hidden flex-1 min-h-[400px] lg:min-h-full group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${imageSrc}')` }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative h-full flex items-center justify-center p-6 lg:p-8 z-10">
                <div className="text-white flex flex-col gap-4 lg:gap-5 w-full">
                  <h3 className="text-xl md:text-3xl lg:text-4xl tracking-wider transition-transform duration-300 group-hover:translate-y-[-2px]">
                    {leftColumnHeading}
                  </h3>
                  <p className="text-sm md:text-base lg:text-lg tracking-wider font-light transition-transform duration-300 group-hover:translate-y-[-1px]">
                    {leftColumnText1}
                  </p>
                  <p className="text-sm md:text-base lg:text-lg tracking-wider font-light transition-transform duration-300 group-hover:translate-y-[-1px]">
                    {leftColumnText2}
                  </p>
                  {learnMoreLink && (
                    <div className="pt-2">
                      <Link href={learnMoreLink} className="inline-flex items-center text-white font-medium transition-all duration-300 text-base sm:text-lg tracking-wider group/link">
                        <span className="transition-all duration-300 group-hover/link:border-transparent">
                          {learnMoreText}
                        </span>
                        <MdArrowOutward className="ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-[-2px]" size={20} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {features.map((feature, index) => (
              <AnimatedCard key={index} feature={feature} index={index}>
                <div className="relative z-10 flex flex-col gap-6 h-full">
                  <div className="">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl md:text-3xl tracking-wider">
                    {feature.title}
                  </h4>
                  <p className="text-base tracking-wider font-light">
                    {feature.description}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyHalaYachts;