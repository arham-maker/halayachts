'use client';
import { useEffect } from 'react';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';

const ICON_SIZE = 24;
const OVERLAY_STYLES = 'bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-all';

export default function ImageLightbox({
    isOpen,
    onClose,
    images,
    currentIndex,
    onNext,
    onPrev,
    title
}) {
    useEffect(() => {
        const handleKeydown = (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [isOpen, onClose, onNext, onPrev]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <button
                onClick={onClose}
                className={`absolute top-6 right-6 text-white cursor-pointer z-10 ${OVERLAY_STYLES}`}
                aria-label="Close lightbox"
            >
                <IoClose size={ICON_SIZE} />
            </button>
            {images.length > 1 && (
                <>
                    <button
                        onClick={onPrev}
                        className={`absolute left-6 text-white z-10 cursor-pointer ${OVERLAY_STYLES}`}
                        aria-label="Previous image"
                    >
                        <IoChevronBack size={ICON_SIZE} />
                    </button>
                    <button
                        onClick={onNext}
                        className={`absolute right-6 text-white z-10 cursor-pointer ${OVERLAY_STYLES}`}
                        aria-label="Next image"
                    >
                        <IoChevronForward size={ICON_SIZE} />
                    </button>
                </>
            )}
            <div className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center">
                <img
                    src={images[currentIndex]}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    className="max-w-full max-h-[85vh] object-contain"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
}