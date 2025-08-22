import React from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const defaultNotice = {
  text: '',
  enabled: false,
};

export default function NoticeBar() {
  const [notice] = useLocalStorage('site_notice', defaultNotice);
  // Compute a sensible duration so very short messages stay readable.
  // 0.18s per character, clamped between 12s and 60s.
  const duration = Math.max(12, Math.min(60, Math.ceil((notice.text?.length || 0) * 0.18)));
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref.current) {
      try {
        ref.current.style.setProperty('--marquee-duration', `${duration}s`);
      } catch (e) {
        // ignore if setting CSS variable fails in older browsers
      }
    }
  }, [duration]);

  if (!notice?.enabled || !notice?.text) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative">
          <div ref={ref} className="animate-marquee whitespace-nowrap" style={{ display: 'inline-block' }}>
            <span className="text-yellow-800 font-medium pr-8">{notice.text}</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          /* use CSS variable so JS can tune duration */
          animation: marquee var(--marquee-duration, 18s) linear infinite;
        }
      `}</style>
    </div>
  );
}
