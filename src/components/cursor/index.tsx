import { useCallback, useEffect, useRef, useState } from "react";
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

export function Cursor({ seed }: { seed?: number }) {
  const [imageIndex, setImageIndex] = useState(seed ? seed % imageUrls.length : Math.floor(Math.random() * imageUrls.length));
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback(() => {
    if (containerRef.current && imgRef.current) {
      containerRef.current.style.left = `${mousePositionRef.current.x - imgRef.current.width / 2}px`;
      containerRef.current.style.top = `${mousePositionRef.current.y - imgRef.current.height / 2}px`;
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    window.addEventListener('keypress', (event) => {
      if (event.key === 'c') {
        setLoadingIndex(imageIndex);
        setImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      }
    }, { signal: abortController.signal });

    window.addEventListener('mousemove', (event) => {
      mousePositionRef.current.x = event.clientX;
      mousePositionRef.current.y = event.clientY;
      handleMouseMove();
    }, { signal: abortController.signal });

    window.addEventListener('touchmove', (event) => {
      mousePositionRef.current.x = event.touches[0].clientX;
      mousePositionRef.current.y = event.touches[0].clientY;
      handleMouseMove();
    }, { signal: abortController.signal });

    return () => abortController.abort();
  }, [handleMouseMove, imageIndex]);

  useShakeHandler(() => {
    const newIndex = Math.floor(Math.random() * imageUrls.length);
    if (newIndex === imageIndex) return;

    setLoadingIndex(imageIndex);
    setImageIndex(newIndex);
  });

  return (
    <div
      ref={containerRef}
      className='absolute z-10 pointer-events-none overflow-visible'
    >
      <img
        ref={imgRef}
        className='h-25 w-auto'
        alt='cursor'
        src={imageUrls[imageIndex]}
        onLoad={() => {
          setLoadingIndex(null);
          handleMouseMove();
        }}
        style={{
          filter: 'drop-shadow(0 8px 4px #222)',
        }}
      />
      {loadingIndex !== null && (
        <div
          className='bg-gray-500/50 absolute inset-0 z-10 flex items-center justify-center'
          style={{
            maskImage: `url(${imageUrls[loadingIndex]})`,
            maskMode: 'alpha',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain',
          }}
        >
          <Spinner />
        </div>
      )}
    </div>
  );
}
