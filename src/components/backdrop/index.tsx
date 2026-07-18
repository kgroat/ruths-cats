import { useEffect, useState } from "react";
import { useShakeHandler } from "#/hooks/useShakeHandler";

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

  useEffect(() => {
    const abortController = new AbortController();

    window.addEventListener('keypress', (event) => {
      if (event.key === 'b') {
        setImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      }
    }, { signal: abortController.signal });

    return () => abortController.abort();
  }, []);

  useShakeHandler(() => {
    setImageIndex(Math.floor(Math.random() * imageUrls.length));
  });

  return (
    <div
      className='bg-center bg-cover min-h-screen min-w-screen flex flex-col'
      style={{ backgroundImage: `url(${imageUrls[imageIndex]})` }}
    >
      {children}
    </div>
  );
}
