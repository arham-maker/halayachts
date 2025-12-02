import { TbCrown, TbUsersGroup } from "react-icons/tb";
import Banner from "../../components/Banner";
import CollectionGrid from "../../components/CollectionGrid";
import Escape from "../../components/Escape";
import ExceptionalService from "../../components/ExceptionalService";
import MeetOurTeam from "../../components/MeetOurTeam";
import WhyHalaYachts from "../../components/WhyHalaYachts";
import { FaGlobeAmericas } from "react-icons/fa";
import { AiTwotoneSafetyCertificate } from "react-icons/ai";

export default function About() {
  return (
    <>
      <Banner
        mainHeading="About Us"
        showContact={true}
        height="medium"
        backgroundImage="/images/about_us.png"
      />
      <Escape />
      <CollectionGrid />
      <MeetOurTeam />
      <ExceptionalService />
      <WhyHalaYachts
        mainHeading="Why HalaYachts is the right choice for you"
        mainText="Choosing HalaYachts means stepping into a world where precision, privacy, and passion for the sea shape every detail of your journey. We don't just charter yachts, we design moments that stay with you long after you've returned to shore."
        leftColumnHeading="Exclusive Fleet Access"
        leftColumnText1="Each yacht is hand-picked for its superior craftsmanship and performance, from sleek modern superyachts to timeless classics, to bring you the highest standards in luxury travel"
        leftColumnText2="We boast a wide array of sailing and motor yachts available across a range of sizes to accommodate all clients, whether you want a mega, modern, sailing, or family yacht. Speak to our expert brokers today, whether you're a first-time buyer or an experienced owner."
        learnMoreLink="/charter"
        learnMoreText="Book your charter"
        imageSrc="/images/whyhalayachts.png"
        features={[
          {
            icon: <TbUsersGroup className="text-white" size={28} />,
            title: "Elite Crew",
            description: "From seasoned captains to attentive staff, our crews deliver seamless service with discretion, expertise, and care."
          },
          {
            icon: <FaGlobeAmericas className="text-white" size={28} />,
            title: "Bespoke Journeys",
            description: "No two charters are the same. Each itinerary is designed around your preferences, destinations, and lifestyle."
          },
          {
            icon: <AiTwotoneSafetyCertificate className="text-white" size={28} />,
            title: "Safety Assured",
            description: "Every vessel undergoes rigorous inspections and carries a flawless safety record, so you can sail with confidence."
          },
          {
            icon: <TbCrown className="text-white" size={28} />,
            title: "Dedicated Charter Management:",
            description: "We streamline the entire process from initial booking to final departure to make your journey hassle-free"
          }
        ]}
      />
    </>
  );
}