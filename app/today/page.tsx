"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  useSelectedDate,
  useSchedule,
  useSettings,
  useSwipeNavigation,
  useDatesWithNotes,
} from "@/hooks";
import { AppHeader, DateStrip } from "@/components/layout";
import { ClassList, ClassDetail } from "@/components/schedule";
import { DayOverrideForm } from "@/components/forms";
import { Modal, Button } from "@/components/ui";
import { ResolvedClass } from "@/types";
import { formatDateDisplay, isToday, addDays, getGreeting } from "@/lib/utils/date";

export default function TodayPage() {
  const { selectedDate, setSelectedDate, goToPrevDay, goToNextDay } =
    useSelectedDate();
  const { schedule, loading, refresh } = useSchedule(selectedDate);
  const { settings } = useSettings();
  const [greeting, setGreeting] = useState("Hello");

  // Set dynamic greeting
  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Get dates with notes for the date strip
  const dateRange = useMemo(() => {
    const start = addDays(selectedDate, -7);
    const end = addDays(selectedDate, 7);
    return { start, end };
  }, [selectedDate]);

  const { datesWithNotes } = useDatesWithNotes(dateRange.start, dateRange.end);

  // Modal states
  const [selectedClass, setSelectedClass] = useState<ResolvedClass | null>(
    null
  );
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ResolvedClass | null>(null);

  // Swipe navigation
  useSwipeNavigation({
    onSwipeLeft: goToNextDay,
    onSwipeRight: goToPrevDay,
  });

  const handleClassClick = useCallback((classData: ResolvedClass) => {
    setSelectedClass(classData);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedClass(null);
    refresh(); // Refresh to update note indicators
  }, [refresh]);

  const handleOpenOverrideForm = useCallback((classData?: ResolvedClass) => {
    setEditingClass(classData || null);
    setShowOverrideForm(true);
  }, []);

  const handleCloseOverrideForm = useCallback(() => {
    setShowOverrideForm(false);
    setEditingClass(null);
  }, []);

  const handleOverrideSave = useCallback(() => {
    handleCloseOverrideForm();
    refresh();
  }, [handleCloseOverrideForm, refresh]);

  // Determine "Next Up" class if isToday
  const { nextUpClass, otherClasses } = useMemo(() => {
    if (!schedule || schedule.length === 0) return { nextUpClass: null, otherClasses: [] };
    
    // Sort by start time just in case
    const sorted = [...schedule].sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (!isToday(selectedDate)) {
      return { nextUpClass: sorted[0], otherClasses: sorted.slice(1) };
    }

    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Find first class that hasn't ended yet
    const nextIndex = sorted.findIndex(c => c.endTime > currentTimeStr);
    
    if (nextIndex === -1) {
      // All classes ended
      return { nextUpClass: null, otherClasses: sorted };
    }

    return { 
      nextUpClass: sorted[nextIndex], 
      otherClasses: [...sorted.slice(0, nextIndex), ...sorted.slice(nextIndex + 1)]
    };
  }, [schedule, selectedDate]);


  return (
    <>
      <AppHeader
        title={isToday(selectedDate) ? greeting : "Schedule"}
        subtitle={formatDateDisplay(selectedDate)}
        rightAction={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenOverrideForm()}
            aria-label="Add class"
            className="w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md border border-gray-100 !p-0"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Button>
        }
      />

      <DateStrip
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        datesWithNotes={datesWithNotes}
      />

      <main className="w-full px-5 pb-24 pt-4 animate-fade-in group/main">
        {loading ? (
          <div className="space-y-4 mt-2">
             {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-3xl animate-pulse" />
             ))}
          </div>
        ) : schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
             <div className="w-24 h-24 bg-surface-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
             <h3 className="text-lg font-semibold text-gray-900">No classes today</h3>
             <p className="text-gray-500 mt-1 max-w-xs mx-auto">
               Enjoy your free time! Tap the + button to add a class manually.
             </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hero Section: Next Up (Only if exists) */}
            {nextUpClass && (
              <div className="space-y-3">
                 <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
                   {isToday(selectedDate) ? "Up Next" : "First Class"}
                 </h2>
                 <div className="transform transition-transform active:scale-[0.98]">
                    {/* Render Hero Card via ClassList for now, or custom Hero component later */}
                    <ClassList 
                       classes={[nextUpClass]} 
                       loading={false} 
                       timeFormat={settings.timeFormat} 
                       onClassClick={handleClassClick} 
                    />
                 </div>
              </div>
            )}

            {/* Timeline: Other Classes */}
            {otherClasses.length > 0 && (
              <div className="space-y-3">
                 <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
                   Schedule
                 </h2>
                 <ClassList 
                    classes={otherClasses} 
                    loading={false} 
                    timeFormat={settings.timeFormat} 
                    onClassClick={handleClassClick} 
                 />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Class Detail Modal */}
      <Modal isOpen={!!selectedClass} onClose={handleCloseDetail} title="Class Details">
        {selectedClass && (
          <ClassDetail
            classData={selectedClass}
            timeFormat={settings.timeFormat}
          />
        )}
      </Modal>

      {/* Override Form Modal */}
      <Modal
        isOpen={showOverrideForm}
        onClose={handleCloseOverrideForm}
        title={editingClass ? "Edit Class" : "Add Class"}
      >
        <DayOverrideForm
          date={selectedDate}
          existingClass={editingClass || undefined}
          onSave={handleOverrideSave}
          onCancel={handleCloseOverrideForm}
          onDelete={handleOverrideSave}
        />
      </Modal>
    </>
  );
}
