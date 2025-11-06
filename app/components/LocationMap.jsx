'use client';

const STYLES = {
    mapContainer: "w-full h-96 lg:h-[650px] overflow-hidden ",
    mapFrame: "w-full h-full border-0",
};

export default function LocationMap({ location }) {
    if (!location) return null;

    const mapUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`;

    return (
        <section>
            <div >
                <div className={STYLES.mapContainer}>
                    <iframe
                        src={mapUrl}
                        className={STYLES.mapFrame}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Yacht Location"
                    />
                </div>
            </div>
        </section>
    );
}