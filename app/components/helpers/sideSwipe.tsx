import React from 'react';

const VerticalGallery = () => {
  const images = [
    { src: '/assets/images/img-1.jpg', text: '1st Frame' },
    { src: '/assets/images/img-2.jpg', text: '2nd Frame' },
    { src: '/assets/images/img-3.jpg', text: '3rd Frame' },
    { src: '/assets/images/img-4.jpg', text: '4th Frame' }
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl xl:hidden">
      {images.map((image, index) => (
        <div 
          key={index} 
          className="cursor-pointer rounded-[6px] relative overflow-hidden z-[1]"
        >
          <img
            src={image.src}
            className="w-full h-48 object-cover"
            alt={`Frame ${index + 1}`}
          />
          <div className="flex flex-col justify-center items-center rounded-[3px] backdrop-blur-md bg-white/10 text-white/50 font-bold absolute right-2 bottom-2 px-6 py-2">
            {image.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerticalGallery;