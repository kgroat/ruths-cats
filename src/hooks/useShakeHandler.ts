import { useEffect } from "react";

// Request permission (Required for iOS 13+ and some Android devices)
async function addDeviceMotionEvent(
  handler: (event: DeviceMotionEvent) => void,
  { signal }: { signal?: AbortSignal } = {}
) {
  if (
    'requestPermission' in DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    DeviceMotionEvent.requestPermission()
      .then((permissionState: 'granted' | 'denied') => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', handler, { signal });
        }
      })
      .catch(console.error);
  } else {
    // For non-iOS devices or older browsers without permission APIs
    window.addEventListener('devicemotion', handler, { signal });
  }
}

export function useShakeHandler(onShake: () => void, threshold = 15) {
  useEffect(() => {
    const abortController = new AbortController();

    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    let lastTime = 0;

    addDeviceMotionEvent((event) => {
      if (!event.accelerationIncludingGravity) return;

      const { x, y, z } = event.accelerationIncludingGravity;
      const currentTime = Date.now();

      if (currentTime - lastTime < 100) {
        return;
      }

      // const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (
        x !== null && y !== null && z !== null &&
        lastX !== null && lastY !== null && lastZ !== null
      ) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
          onShake();
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    }, { signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  }, [onShake, threshold]);
}
