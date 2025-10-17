import React from 'react';
import { useLanguage } from '../App';
import { Search } from './Icons';

const GallerySection: React.FC = () => {
  const { t } = useLanguage();

  const images = [
    {
      src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
      alt: "Group of friends jogging together outdoors",
      className: "md:row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
      alt: "Colorful assortment of fresh fruits and vegetables",
      className: "",
    },
    {
      src: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1887&auto=format&fit=crop",
      alt: "Person pouring a green smoothie into a glass",
      className: "",
    },
    {
      src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop",
      alt: "Woman practicing yoga on a dock by the water",
      className: "md:col-span-2",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 dark:text-green-200 mb-12">{t('galleryTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className={`relative overflow-hidden rounded-xl shadow-lg group min-h-[300px] ${image.className}`}>
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Search className="w-10 h-10 text-white transform scale-75 group-hover:scale-100 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;