import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Attach listener and initialize state
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
    } else if (typeof (mql as MediaQueryList & { addListener?: (fn: () => void) => void }).addListener === 'function') {
      // Safari fallback
      (mql as MediaQueryList & { addListener: (fn: () => void) => void }).addListener(onChange);
    }

    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', onChange);
      } else if (typeof (mql as MediaQueryList & { removeListener?: (fn: () => void) => void }).removeListener === 'function') {
        (mql as MediaQueryList & { removeListener: (fn: () => void) => void }).removeListener(onChange);
      }
    };
  }, []);

  return !!isMobile;
}
