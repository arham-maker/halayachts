'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const STYLES = {
  section: "lg:py-24 py-8 bg-white",
  container: "max-w-7xl mx-auto px-5 flex flex-col md:gap-10 gap-5",
  heading: "text-3xl md:text-6xl lg:text-6xl xl:text-[65px] font-light tracking-wide",
  amenityCard: "p-3 rounded border-[#404040] border text-center",
  amenityName: "text-[#404040] text-xl whitespace-nowrap",
};

const CONTENT = {
  heading: "Amenities"
};

export default function AmenitiesSlider({ amenities }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <section className={STYLES.section}>
      <div className={STYLES.container}>
        <h2 className={STYLES.heading}>
          {CONTENT.heading}
        </h2>

        <div className="overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
              1536: { slidesPerView: 6 }
            }}
            className="!overflow-visible"
          >
            {amenities.map((amenity, index) => (
              <SwiperSlide key={amenity.code || index} className="!h-auto">
                <div className={STYLES.amenityCard}>
                  <span className={STYLES.amenityName}>
                    {amenity.name}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}