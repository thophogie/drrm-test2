import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);

  const images = [
    'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
    'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575261/489043126_1065374988952984_1331524645056736117_n_fbmvch.jpg',
    'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg',
    'https://images.pexels.com/photos/73833/worm-s-eye-view-us-flag-low-angle-shot-flag-73833.jpeg',
    'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
    'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg'
  ];

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    let scrollInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth) {
          gallery.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          gallery.scrollBy({ left: 1, behavior: 'smooth' });
        }
      }, 30);
    };

    const stopAutoScroll = () => {
      clearInterval(scrollInterval);
    };

    startAutoScroll();

    gallery.addEventListener('mouseenter', stopAutoScroll);
    gallery.addEventListener('mouseleave', startAutoScroll);

    return () => {
      clearInterval(scrollInterval);
      gallery.removeEventListener('mouseenter', stopAutoScroll);
      gallery.removeEventListener('mouseleave', startAutoScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const scrollAmount = 300;
    gallery.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16 bg-blue-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-yellow-500 mb-4">
          Our Activities and Events
        </h2>
        <p className="text-center text-gray-200 max-w-2xl mx-auto mb-8">
          Photos from our disaster preparedness activities and community events
        </p>
        
        {/* Horizontal Scrolling Gallery */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center z-10">
            <button
              onClick={() => scroll('left')}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg ml-2 transition-all"
            >
              <ChevronLeft className="text-blue-900" size={20} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center z-10">
            <button
              onClick={() => scroll('right')}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg mr-2 transition-all"
            >
              <ChevronRight className="text-blue-900" size={20} />
            </button>
          </div>
          
          <div className="bg-white rounded-lg border-2 border-blue-100 py-4 overflow-hidden">
            <div
              ref={galleryRef}
              className="flex space-x-4 px-4 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;