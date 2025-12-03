import Banner from "../../components/Banner";
import { 
  FiShield, 
  FiLock, 
  FiEye, 
  FiUser, 
  FiMail, 
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiFileText
} from "react-icons/fi";

export default function PrivacyPolicy() {
  const privacySections = [
    {
      id: 1,
      title: "Introduction",
      content: `Welcome to Hala Yachts ("we", "our", "us").
      
Your privacy is our top priority. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you visit our website, make an inquiry, or book a yacht charter with us.

By using our website or services, you agree to the terms of this Privacy Policy. If you do not agree, please refrain from using our site or submitting personal data.`,
      icon: <FiShield className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 2,
      title: "Who We Are",
      content: `Hala Yachts is a bespoke yacht charter and luxury travel service provider, offering private yacht rentals and tailored experiences across the world's most exclusive destinations.

We are part of the Hala Group, which includes Hala Jets and related luxury travel entities. Some data may be shared within the group for service and support purposes.`,
      icon: <FiUser className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 3,
      title: "Information We Collect",
      content: `We collect the following types of personal data:

a. Information You Provide
• Personal Identifiers: full name, date of birth, nationality, and passport details (for charter travel)
• Contact Information: phone number, email address, billing and mailing address
• Booking Information: itinerary, preferred destinations, yacht preferences, passenger list, catering, or event requirements
• Payment Information: credit/debit card details, bank information (processed securely through trusted third-party payment gateways)
• Communication Data: emails, calls, or live chat messages with our support or concierge team
• Special Requests: dietary needs, allergies, celebrations, or accessibility requirements (collected only with your consent)

b. Automatically Collected Information
• IP address, device type, browser type, and operating system
• Site usage statistics (e.g., time spent, pages visited, referral source)
• Cookies and tracking pixels (for site analytics and personalization)`,
      icon: <FiEye className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 4,
      title: "How We Use Your Data",
      content: `We use your information to:
• Process and manage yacht charter bookings and inquiries
• Personalize your experience (e.g., yacht recommendations, preferred destinations)
• Communicate about your reservations, updates, or special requests
• Provide customer support and concierge services
• Send marketing or promotional messages (only with your consent)
• Fulfill legal or regulatory obligations (e.g., maritime laws, customs, tax reporting)
• Improve website performance and user experience

We do not sell or rent your personal data to any third parties.`,
      icon: <FiGlobe className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 5,
      title: "Legal Basis for Processing",
      content: `We process personal data under the following lawful bases:
• Performance of Contract: to fulfill bookings and provide services
• Consent: for optional marketing or non-essential cookies
• Legitimate Interest: to improve customer experience and prevent fraud
• Legal Obligation: to comply with applicable maritime, tax, or anti-money laundering laws`,
      icon: <FiCheckCircle className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 6,
      title: "Retention of Data",
      content: `We retain your personal data only as long as necessary:

| Type of Data | Retention Period |
|--------------|------------------|
| Charter booking and travel records | 7 years (for legal and tax purposes) |
| Marketing data | 2 years after last interaction (unless you unsubscribe sooner) |
| Technical data (cookies, logs) | Up to 12 months |
| Payment records | As required by financial regulations |

After these periods, your data will be securely deleted or anonymized.`,
      icon: <FiCalendar className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 7,
      title: "Data Sharing & Transfers",
      content: `We may share data with:
• Trusted Service Providers: yacht operators, crew, catering, event planners, and concierge partners (only as needed to fulfill your booking)
• Group Companies: within Hala Group (e.g., Hala Jets) for coordinated luxury travel experiences
• Authorities: customs, immigration, or maritime authorities when legally required
• Technology Partners: website hosting, analytics, and secure payment processors

If your data is transferred internationally, we ensure compliance using Standard Contractual Clauses (SCCs) or equivalent data protection safeguards.`,
      icon: <FiMail className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 8,
      title: "Cookies & Tracking",
      content: `We use cookies to enhance your experience.

Types of Cookies:
• Essential Cookies: enable site functionality (e.g., booking forms)
• Performance Cookies: analyze website usage and improve content
• Functional Cookies: remember preferences (e.g., currency, region, yacht type)
• Marketing Cookies: deliver personalized offers (used only with consent)

You can accept, decline, or customize cookie settings via our on-site cookie banner or your browser settings.`,
      icon: <FiFileText className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 9,
      title: "Security of Your Data",
      content: `We employ robust physical, technical, and administrative measures, including:
• Data encryption (SSL/HTTPS)
• Secure data storage and limited staff access
• Regular system audits and penetration testing
• Confidentiality agreements with all third-party partners
• Data breach response procedures to notify users within 72 hours if required by law`,
      icon: <FiShield className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 10,
      title: "Children's Privacy",
      content: `Our services are intended for individuals aged 18 and above.
We do not knowingly collect or process data from minors. If you believe a child has submitted data, please contact us immediately at privacy@halayachts.com so we can delete it.`,
      icon: <FiAlertCircle className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 11,
      title: "Your Rights",
      content: `Depending on your location (e.g., EU, UK, UAE, California), you may have rights to:
• Access the data we hold about you
• Request correction of inaccurate information
• Request deletion ("right to be forgotten")
• Withdraw consent for marketing or cookies
• Request data portability
• Lodge a complaint with a supervisory authority

You can exercise your rights by emailing privacy@halayachts.com.`,
      icon: <FiUser className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 12,
      title: "Data Breach Procedure",
      content: `In the unlikely event of a data breach, we will:
• Notify affected users and regulators within 72 hours
• Disclose the nature of the breach, data affected, and steps taken
• Provide guidance on protective measures`,
      icon: <FiAlertCircle className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 13,
      title: "Policy Updates",
      content: `We may update this Privacy Policy periodically.
• The "Last Updated" date reflects the latest version
• Material changes will be communicated via email or notice on our website
• Continued use of our site constitutes acceptance of the revised policy`,
      icon: <FiLock className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 14,
      title: "Contact Us",
      content: `For privacy inquiries, data requests, or complaints, please contact:

Hala Yachts
• Email: privacy@halayachts.com
• Phone: +1 847-845-0227
• Headquarters: [Insert Address]`,
      icon: <FiMail className="w-5 h-5 md:w-6 md:h-6" />
    }
  ];

  const formatContent = (content) => {
    const lines = content.split('\n');
    let inTable = false;
    let tableContent = [];

    return lines.map((line, index) => {
      if (line.startsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableContent = [];
        }
        tableContent.push(line);
        return null;
      } else if (inTable) {
        inTable = false;
        return (
          <div key={`table-${index}`} className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border border-gray-200">
              <tbody>
                {tableContent.map((row, rowIndex) => {
                  const cells = row.split('|').filter(cell => cell.trim() !== '');
                  if (cells.length === 0) return null;
                  
                  const isHeader = rowIndex === 0;
                  return (
                    <tr key={rowIndex} className={isHeader ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                      {cells.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex} 
                          className={`border border-gray-200 px-4 py-3 ${
                            isHeader ? 'font-medium text-gray-900' : 'text-gray-700'
                          }`}
                        >
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      if (line.startsWith('a. ') || line.startsWith('b. ') || line.startsWith('Types of Cookies:')) {
        return (
          <h4 key={index} className="text-lg font-medium text-gray-900 mt-4 mb-2">
            {line}
          </h4>
        );
      }
      
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
        
        if (text.startsWith('Headquarters:')) {
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
      
      if (line.startsWith('Hala Yachts')) {
        return (
          <div key={index} className="mt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">{line}</h4>
          </div>
        );
      }
      
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
        mainHeading="Privacy Policy"
        description="Your privacy is our priority. Learn how we protect and manage your personal data with the highest standards of security and transparency."
        showContact={true}
        height="medium"
        backgroundImage="/images/banner-bg.jpg"
        overlayOpacity={0.6}
      />

      <section className="lg:py-24 py-8 bg-white ">
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
                  This document outlines how we collect, use, and protect your personal information.
                </p>
              </div>
            </div>

            {/* Privacy Sections */}
            {privacySections.map((section) => (
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

            {/* Contact Section */}
            <div className="flex flex-col gap-5 mt-8">
              <div className="bg-[#F2F2F2] p-6 md:p-8 rounded-lg">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-[#333333] mb-4 md:mb-6">
                  Questions About Your Privacy?
                </h3>
                <p className="text-base md:text-lg tracking-wider font-light text-[#333333] mb-6 md:mb-8">
                  Our privacy team is here to help with any questions or concerns about your personal data.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:privacy@halayachts.com"
                    className="bg-text-primary text-white text-base px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto md:text-lg rounded cursor-pointer hover:bg-opacity-90 transition duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-4 h-4 md:w-5 md:h-5" />
                    Email Privacy Team
                  </a>
                  <a
                    href="/contact"
                    className="bg-text-primary text-white text-base px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto md:text-lg rounded cursor-pointer hover:bg-opacity-90 transition duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <FiPhone className="w-4 h-4 md:w-5 md:h-5" />
                    Contact Support
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