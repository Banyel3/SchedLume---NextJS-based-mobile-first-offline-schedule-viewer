"use client";

import { ResolvedClass } from "@/types";
import { formatTime } from "@/lib/utils/time";
import { Badge, NoteDot } from "@/components/ui";

interface ClassCardProps {
  classData: ResolvedClass;
  timeFormat?: "12h" | "24h";
  onClick?: () => void;
}

export function ClassCard({
  classData,
  timeFormat = "12h",
  onClick,
}: ClassCardProps) {
  const {
    subjectName,
    startTime,
    endTime,
    location,
    professor,
    color,
    isCanceled,
    isOverridden,
    isAdded,
    hasNote,
  } = classData;

  // Modern ticket style with color strip
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden active:scale-[0.98] ${
        isCanceled ? "opacity-60 grayscale-[0.5]" : ""
      }`}
    >
      <div className="flex h-full">
        {/* Color Strip */}
        <div 
          className="w-3 h-full absolute left-0 top-0 bottom-0" 
          style={{ backgroundColor: color || "#2E2C78" }} 
        />

        {/* Content Area */}
        <div className="flex-1 pl-7 pr-5 py-5 sm:pl-8 sm:pr-6 sm:py-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              {/* Time Row */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-500 tracking-wide">
                  {formatTime(startTime, timeFormat)} - {formatTime(endTime, timeFormat)}
                </span>
                {(isCanceled || isOverridden || isAdded) && (
                  <div className="flex gap-1">
                    {isCanceled && <Badge variant="canceled">Canceled</Badge>}
                    {isOverridden && !isCanceled && <Badge variant="override">Modified</Badge>}
                    {isAdded && <Badge variant="added">Added</Badge>}
                  </div>
                )}
              </div>

              {/* Subject Name */}
              <div className="flex items-center gap-2 mb-3">
                <h3 className={`text-xl font-bold text-gray-900 leading-tight truncate ${
                  isCanceled ? "line-through decoration-gray-400" : ""
                }`}>
                  {subjectName}
                </h3>
                {hasNote && <NoteDot size="md" className="translate-y-[1px]" />}
              </div>

              {/* Details Row */}
              {(location || professor) && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-gray-400">
                  {location && (
                    <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {location}
                    </span>
                  )}
                  {professor && (
                    <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {professor}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Chevron (subtle hint) */}
            <div className="self-center">
               <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
               </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
