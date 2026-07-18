import { useEffect } from "react";

const clipsObj = import.meta.glob('./clips/*.{mp3,ogg,wav}', {
  eager: true,
});

const clipUrls = Object.values(clipsObj).map((module) => (
  module && typeof module === 'object' && 'default' in module && typeof module.default === 'string'
    ? module.default
    : null
)).filter(url => url !== null);

export function Meow() {
  useEffect(() => {
    const abortController = new AbortController();

    window.addEventListener('click', () => {
      const audio = document.createElement('audio')
      audio.src = clipUrls[Math.floor(Math.random() * clipUrls.length)]
      audio.autoplay = true;
      audio.onended = () => audio.remove();
      document.body.appendChild(audio)
    }, { signal: abortController.signal });

    return () => abortController.abort();
  }, []);

  return null;
}
