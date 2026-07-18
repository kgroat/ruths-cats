import { useEffect, useState } from "react";
import { useShakeHandler } from "#/hooks/useShakeHandler";
import { Spinner } from "../ui/spinner";

const imagesObj = import.meta.glob('./images/*.{png,jpg,jpeg,svg,gif,webp}', {
  eager: true,
});

const imageUrls = Object.values(imagesObj).map((module) => (
  module && typeof module === 'object' && 'default' in module && typeof module.default === 'string'
    ? module.default
    : null
)).filter(url => url !== null);

export function Backdrop({ children, seed }: { children?: React.ReactNode; seed?: number }) {
  const [imageIndex, setImageIndex] = useState(seed ? seed % imageUrls.length : Math.floor(Math.random() * imageUrls.length));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    window.addEventListener('keypress', (event) => {
      if (event.key === 'b') {
        setIsLoading(true);
        setImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      }
    }, { signal: abortController.signal });

    return () => abortController.abort();
  }, []);

  useShakeHandler(() => {
    const newIndex = Math.floor(Math.random() * imageUrls.length);
    if (newIndex === imageIndex) return;

    setIsLoading(true);
    setImageIndex(newIndex);
  });

  return (
    <div className='min-h-screen min-w-screen relative'>
      <img
        src={imageUrls[imageIndex]}
        alt="backdrop"
        className="block w-full h-full absolute inset-0 object-cover pointer-events-none"
        onLoad={() => setIsLoading(false)}
      />
      
      {isLoading && (
        <div className='bg-gray-500/50 absolute inset-0 flex items-center justify-center'>
          <Spinner />
        </div>
      )}
      {children}
    </div>
  );
}
