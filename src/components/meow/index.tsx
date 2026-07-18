import { useEffect, useRef, useState } from "react";

const clipsObj = import.meta.glob("./clips/*.{mp3,ogg,wav}", {
  eager: true,
});

const clipUrls = Object.values(clipsObj)
  .map((module) =>
    module &&
    typeof module === "object" &&
    "default" in module &&
    typeof module.default === "string"
      ? module.default
      : null,
  )
  .filter((url) => url !== null);

type MeowBubble = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  driftX: number;
};

export function Meow() {
  const [bubbles, setBubbles] = useState<MeowBubble[]>([]);
  const nextBubbleId = useRef(0);

  useEffect(() => {
    const abortController = new AbortController();

    window.addEventListener(
      "click",
      (event) => {
        const audio = document.createElement("audio");
        audio.src = clipUrls[Math.floor(Math.random() * clipUrls.length)];
        audio.autoplay = true;
        audio.onended = () => audio.remove();
        document.body.appendChild(audio);

        const id = nextBubbleId.current++;
        setBubbles((currentBubbles) => [
          ...currentBubbles,
          {
            id,
            x: event.clientX,
            y: event.clientY,
            rotation: Math.round(Math.random() * 16 - 8),
            driftX: Math.round(Math.random() * 48 - 24),
          },
        ]);
      },
      { signal: abortController.signal },
    );

    return () => abortController.abort();
  }, []);

  return (
    <div className="meow-bubble-layer" aria-hidden="true">
      {bubbles.map((bubble) => (
        <span
          className="meow-bubble"
          key={bubble.id}
          onAnimationEnd={() => {
            setBubbles((currentBubbles) =>
              currentBubbles.filter(({ id }) => id !== bubble.id),
            );
          }}
          style={
            {
              left: bubble.x,
              top: bubble.y,
              "--meow-rotation": `${bubble.rotation}deg`,
              "--meow-drift-x": `${bubble.driftX}px`,
            } as React.CSSProperties
          }
        >
          meow
        </span>
      ))}
    </div>
  );
}
