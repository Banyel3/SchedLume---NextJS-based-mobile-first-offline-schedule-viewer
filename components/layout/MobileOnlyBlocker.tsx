"use client";

import { useEffect, useState } from "react";

export function MobileOnlyBlocker() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIfDesktop = () => {
      // Check screen width (tablets and larger)
      const isWideScreen = window.innerWidth >= 768;

      // Check user agent for desktop indicators
      const userAgent = navigator.userAgent.toLowerCase();
      const isDesktopUA =
        !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );

      // Consider it desktop if either condition is true
      setIsDesktop(isWideScreen || isDesktopUA);
    };

    checkIfDesktop();

    // Recheck on window resize
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  if (!isDesktop) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 p-6">
      <div className="max-w-md text-center">
        {/* Mobile Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-coral-500/10">
          <svg
            className="h-12 w-12 text-coral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold text-white">Mobile Only</h1>

        {/* Description */}
        <p className="mb-6 text-lg text-gray-300">
          SchedLume is designed exclusively for mobile devices.
        </p>

        {/* Instructions */}
        <div className="rounded-lg bg-gray-800 p-6 text-left">
          <p className="mb-4 font-semibold text-white">To access SchedLume:</p>
          <ol className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-500 text-xs font-bold text-white">
                1
              </span>
              <span>Open this page on your smartphone</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-500 text-xs font-bold text-white">
                2
              </span>
              <span>Add it to your home screen for the best experience</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-500 text-xs font-bold text-white">
                3
              </span>
              <span>Access your schedule anytime, even offline!</span>
            </li>
          </ol>
        </div>

        {/* QR Code Suggestion */}
        <p className="mt-6 text-sm text-gray-400">
          💡 Tip: Scan a QR code or send yourself the link to open on mobile
        </p>
      </div>
    </div>
  );
}
