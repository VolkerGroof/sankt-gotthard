'use client';

import { useEffect } from 'react';

/**
 * Forces a landscape look on small portrait phones by adding the
 * `force-landscape` class to <body>. The class is matched in globals.css and
 * rotates the layout root 90° so the gallery layouts (which are designed wide)
 * always read horizontally. Removes the class on unmount and on orientation
 * change.
 */
export default function OrientationLock() {
  useEffect(() => {
    const mq = window.matchMedia(
      '(max-width: 900px) and (orientation: portrait)',
    );
    const apply = () => {
      document.body.classList.toggle('force-landscape', mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      document.body.classList.remove('force-landscape');
    };
  }, []);

  return null;
}
