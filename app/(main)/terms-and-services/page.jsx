import Banner from "../../components/Banner";
import { 
  FiFileText,
  FiUser,
  FiDollarSign,
  FiCreditCard,
  FiCalendar,
  FiUsers,
  FiXCircle,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiGlobe,
  FiMail,
  FiPhone,
  FiClipboard,
  FiAnchor,
  FiBriefcase,
  FiTrendingUp,
  FiMapPin
} from "react-icons/fi";

export default function TermsAndServices() {
  const termsSections = [
    {
      id: 1,
      title: "Introduction / Parties",
      content: `This Yacht Charter Agreement ("Agreement") is made between HalaYachts LLC ("Hala Yachts", "we", "us", "our") and you, the Client ("you", "your"). This Agreement becomes effective as of the date you accept or execute it ("Effective Date").

By booking a yacht charter through HalaYachts, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions.`,
      icon: <FiFileText className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 2,
      title: "Nature of Services & Relationship",
      content: `HalaYachts acts as a charter agent and broker, arranging yacht charters by contracting with licensed yacht operators or owners ("Operator(s)"). We do not own or manage the yachts, nor do we have operational control over them.

Each Operator remains fully responsible for the yacht's operation, crew, safety, maintenance, and compliance with all applicable maritime laws and port regulations.

Charters are subject to the rules and regulations of the United Arab Emirates Maritime Authority (FMA/UAE Coast Guard), the U.S. Coast Guard (USCG), and the Federal Maritime Commission (FMC), as well as state authorities such as the Florida Fish and Wildlife Conservation Commission (FWC) and the Texas Parks and Wildlife Department (TPWD).

For international voyages, the yacht and its operators shall comply with applicable international maritime conventions, including SOLAS and MARPOL, as administered by the International Maritime Organization (IMO).`,
      icon: <FiBriefcase className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 3,
      title: "Authorized Representatives",
      content: `Only individuals or entities you have designated as Authorized Charter Representatives may request, modify, or confirm bookings on your behalf. It's binding upon you to abide by any instructions received from these representatives.`,
      icon: <FiUser className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 4,
      title: "Charter Quotes, Services & Additional Costs",
      content: `For each requested charter, HalaYachts will provide a Charter Quote containing the following details:
• Itinerary and estimated duration
• Vessel type and specifications
• Total charter price and payment terms
• Cancellation and refund policies
• Any optional or additional services (e.g., catering, crew gratuities, water toys, transfers)
• Applicable taxes and fees

You are responsible for Additional Costs not included in the base charter fee, such as:
• Fuel consumed beyond standard allowance
• Dockage or mooring fees
• Port or customs charges
• Crew gratuities, food, and beverages
• Tenders, water sports equipment, and third-party services
• Environmental fees or taxes

Unless otherwise specified, all taxes, fees, and duties are your responsibility.`,
      icon: <FiDollarSign className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 5,
      title: "Payment & Booking Confirmation",
      content: `Charters are not confirmed until full payment or the specified deposit is received and all required documents are signed.

Payment terms will be stated in each Charter Quote. Typically:
• A 50% deposit is due upon booking
• The remaining balance is due 30 days before departure

Payments made via credit card may incur processing fees, which will be disclosed in advance.`,
      icon: <FiCreditCard className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 6,
      title: "Scheduling, Modifications & Availability",
      content: `All bookings, changes, or cancellations must be requested by an Authorized Charter Representative.

Charters are subject to yacht and crew availability at the time of booking. Any change to itinerary, duration, passengers, or destination may result in a revised Quote and additional fees.

The Operator reserves the right to modify the itinerary or reschedule the charter if necessary for safety reasons, weather conditions, or mechanical issues.`,
      icon: <FiCalendar className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 7,
      title: "Passenger Requirements & Boarding",
      content: `All passengers must provide valid government-issued identification before boarding. For international voyages, passengers must hold valid passports, visas and comply with customs and immigration requirements.

Boarding may be denied if the required documentation is not provided. HalaYachts is not responsible for delays, missed charters, or additional costs due to incomplete or invalid travel documents.`,
      icon: <FiUsers className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 8,
      title: "Cancellations, Refunds & Rescheduling",
      content: `Cancellation policies will be stated clearly in each Charter Quote. Unless otherwise stated, the following standard terms apply:
• Cancellations made 30 days or more before departure: 50% refund of the total charter price
• Cancellations made within 30 days of departure: no refund
• Cancellations due to severe weather or safety restrictions may be rescheduled, subject to yacht and crew availability

Refunds, where applicable, will be processed within 14 business days to the original payment method. Non-refundable deposits, fuel, provisioning, and third-party service costs are not eligible for refund.`,
      icon: <FiXCircle className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 9,
      title: "Liability, Indemnification & Limitations",
      content: `HalaYachts' Liability
HalaYachts shall not be liable for loss, delay, damage, or injury arising from events beyond its reasonable control, including weather, mechanical failures, strikes, port closures, or government actions.

Operator Responsibility
The Operator holds all responsibility for vessel operation, crew management, and passenger safety during the charter.

Limitation of Damages
In no event shall Hala Yachts be liable for indirect, incidental, or consequential damages. Our total liability for any claim shall not exceed the total charter price paid for the affected voyage.

Client Responsibility
You are liable for any damage caused to the yacht, its fittings, or equipment due to negligence or misconduct by you or your guests.

You agree to indemnify and hold harmless Hala Yachts, its affiliates, employees, and agents against claims or expenses arising from your breach of this Agreement, except where caused by our gross negligence or willful misconduct.`,
      icon: <FiShield className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 10,
      title: "Passenger Conduct & Onboard Rules",
      content: `You and your guests must comply with the Captain's authority at all times and adhere to all safety regulations and local maritime laws.

The following are strictly prohibited on board:
• Illegal drugs or controlled substances
• Weapons, hazardous materials, or explosives
• Reckless or disruptive behavior endangering crew or passengers

Failure to comply may result in charter termination without refund.`,
      icon: <FiAlertCircle className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 11,
      title: "Force Majeure",
      content: `Neither party shall be liable for delays or non-performance due to causes beyond their control, including but not limited to natural disasters, severe weather, port restrictions, pandemics, or government regulations.

If a Force Majeure event prevents performance, HalaYachts may reschedule the charter or issue a partial refund, depending on Operator policies.`,
      icon: <FiTrendingUp className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 12,
      title: "Insurance",
      content: `The Operator shall maintain appropriate marine insurance for the vessel, including third-party liability. Clients are advised to obtain personal travel or cancellation insurance to cover unforeseen circumstances.`,
      icon: <FiCheckCircle className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 13,
      title: "Term & Termination",
      content: `This Agreement begins on the Effective Date and remains in effect until the completion or lawful termination of the charter.

Either party may terminate the Agreement for material breach by the other party, subject to applicable cancellation policies.`,
      icon: <FiClipboard className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 14,
      title: "Governing Law & Jurisdiction",
      content: `This Agreement shall be governed by and construed in accordance with the laws of the United Arab Emirates, the USA, and Pakistan, as well as applicable maritime regulations.

All disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE, unless otherwise agreed in writing.`,
      icon: <FiGlobe className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 15,
      title: "Data Privacy & Consumer Rights",
      content: `HalaYachts collects and processes personal data in accordance with GDPR and CCPA regulations. You have rights to access, correction, deletion, and objection under these laws.

Details are provided in our Privacy Policy.`,
      icon: <FiShield className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 16,
      title: "Amendments & Notices",
      content: `We may amend these Terms & Conditions periodically. Material changes will be communicated via email or posted on our website with at least 30 days' notice. Continued use of our services constitutes acceptance of the updated terms.`,
      icon: <FiAnchor className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 17,
      title: "Contact Information",
      content: `For questions regarding these Terms & Conditions, please contact:

HalaYachts LLC
• Email: charter@halayachts.com
• Phone: +1 (555) 987-6543
• Address: [Insert Headquarters Address]`,
      icon: <FiMail className="w-5 h-5 md:w-6 md:h-6" />
    }
  ];

  const formatContent = (content) => {
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Check for sub-headings
      if (line === "HalaYachts' Liability" || 
          line === "Operator Responsibility" || 
          line === "Limitation of Damages" || 
          line === "Client Responsibility") {
        return (
          <h4 key={index} className="text-lg font-medium text-gray-900 mt-4 mb-2">
            {line}
          </h4>
        );
      }
      
      // Check for contact info
      if (line.startsWith('HalaYachts LLC')) {
        return (
          <div key={index} className="mt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">{line}</h4>
          </div>
        );
      }
      
      // Check for bullet points
      if (line.startsWith('• ')) {
        const text = line.replace('• ', '');
        
        if (text.startsWith('Email:')) {
          return (
            <div key={index} className="flex items-center gap-2">
              <FiMail className="w-4 h-4 text-secondary hidden md:block" />
              <span className="text-base md:text-lg tracking-wider font-light text-[#333333]">
                {text}
              </span>
            </div>
          );
        }
        
        if (text.startsWith('Phone:')) {
          return (
            <div key={index} className="flex items-center gap-2">
              <FiPhone className="w-4 h-4 text-secondary hidden md:block" />
              <span className="text-base md:text-lg tracking-wider font-light text-[#333333]">
                {text}
              </span>
            </div>
          );
        }
        
        if (text.startsWith('Address:')) {
          return (
            <div key={index} className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-secondary hidden md:block" />
              <span className="text-base md:text-lg tracking-wider font-light text-[#333333]">
                {text}
              </span>
            </div>
          );
        }
        
        return (
          <div key={index} className="flex items-start">
            <span className="text-secondary mr-2 mt-1">•</span>
            <span className="text-base md:text-lg tracking-wider font-light text-[#333333]">
              {text}
            </span>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-base md:text-lg tracking-wider font-light text-[#333333]">
          {line}
        </p>
      );
    });
  };

  return (
    <>
      <Banner
        mainHeading="Terms & Services"
        description="Review our terms and conditions for yacht charter services. Understand your rights and responsibilities when booking with HalaYachts."
        showContact={true}
        height="medium"
        backgroundImage="/images/banner-bg.jpg"
        overlayOpacity={0.6}
      />

      <section className="lg:py-24 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#F2F2F2] rounded-full hidden md:flex">
                <FiFileText className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
              </div>
              <div>
                <p className="text-base md:text-lg lg:text-xl tracking-wider font-light text-[#333333]">
                  Last Updated: March 2024
                </p>
                <p className="text-base md:text-lg tracking-wider font-light text-[#666666] mt-2">
                  This Agreement governs all yacht charter services provided by HalaYachts LLC.
                </p>
              </div>
            </div>

            {/* Terms Sections */}
            {termsSections.map((section) => (
              <div key={section.id} className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#F2F2F2] rounded-full hidden md:flex">
                    <div className="text-secondary">
                      {section.icon}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-[#333333]">
                    {section.id}. {section.title}
                  </h2>
                </div>
                
                <div className="flex flex-col gap-4 md:ml-16">
                  {formatContent(section.content)}
                </div>
              </div>
            ))}

            {/* Agreement Section */}
            <div className="flex flex-col gap-5 mt-8">
              <div className="bg-[#F2F2F2] p-6 md:p-8 rounded-lg">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-[#333333] mb-4 md:mb-6">
                  Accepting Our Terms
                </h3>
                <p className="text-base md:text-lg tracking-wider font-light text-[#333333] mb-6 md:mb-8">
                  By booking a charter with HalaYachts, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/contact"
                    className="bg-text-primary text-white text-base px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto md:text-lg font-medium rounded cursor-pointer hover:bg-opacity-90 transition duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-4 h-4 md:w-5 md:h-5" />
                    Contact for Questions
                  </a>
                  <a
                    href="/booking"
                    className="bg-text-primary text-white text-base px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto md:text-lg font-medium rounded cursor-pointer hover:bg-opacity-90 transition duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <FiCheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    Proceed to Booking
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}