import { CiLocationOn } from "react-icons/ci";
import Link from 'next/link';
import Image from 'next/image';

const FALLBACK_IMAGE = '/images/charter/image01.png';

function resolveImageSrc(image) {
    if (!image) return FALLBACK_IMAGE;

    const candidate = typeof image === 'string'
        ? image.trim()
        : image.original_url || image.url || image.path || '';

    if (!candidate) return FALLBACK_IMAGE;
    if (candidate.startsWith('data:')) return candidate;
    if (candidate.startsWith('http://') || candidate.startsWith('https://')) return candidate;
    if (candidate.startsWith('//')) return `https:${candidate}`;
    if (candidate.startsWith('/')) return candidate;

    // Ensure relative paths always have a leading slash
    return `/${candidate.replace(/^\/+/, '')}`;
}

export default function YachtCard({ yacht }) {
    const { title, slug, image, location, prices } = yacht;
    const price = prices?.[0];
    const displayPrice = price ? `${price.retail_currency}${(price.retail_cents / 100).toLocaleString()}` : null;
    const imageSrc = resolveImageSrc(image);

    return (
        <Link href={`/charter/${slug}`} className="block group relative">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 relative">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform"
                    />
                </div>

                <div className="p-2 absolute bottom-2.5 z-10 w-[97%] bg-white left-1/2 -translate-x-1/2 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-base sm:text-lg font-semibold flex-1 line-clamp-1">
                            {title}
                        </h3>
                        {displayPrice && (
                            <span className="text-base text-secondary sm:text-lg font-semibold ">
                                {displayPrice}
                            </span>
                        )}
                    </div>
                    <div className="border-t border-gray-200  my-1"></div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        {location?.city && (
                            <div className="flex items-center flex-1 ">
                                <CiLocationOn className="w-4 h-4 mr-1" />
                                <span className="truncate text-wider">{location.city}</span>
                            </div>
                        )}
                        {price && (
                            <span className="whitespace-nowrap  ">
                                Per {price.charter_hours} {price.charter_hours_label}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}