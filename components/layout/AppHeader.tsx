"use client";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function AppHeader({
  title,
  subtitle,
  showBackButton,
  onBack,
  rightAction,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-surface-100/80 backdrop-blur-md transition-all duration-300">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {showBackButton && (
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-gray-500 hover:text-primary rounded-xl hover:bg-white/50 transition-colors shrink-0"
              aria-label="Go back"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <div className="min-w-0 flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm font-medium text-gray-500 truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {rightAction && <div className="shrink-0 ml-4">{rightAction}</div>}
      </div>
    </header>
  );
}
