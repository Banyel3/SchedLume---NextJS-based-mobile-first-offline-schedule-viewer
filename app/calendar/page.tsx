"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useSelectedDate,
  useSettings,
  useDatesWithNotes,
  useGeneralNotes,
  useDatesWithGeneralNotes,
} from "@/hooks";
import { AppHeader } from "@/components/layout";
import { CalendarGrid } from "@/components/calendar";
import { GeneralNoteModal, GeneralNoteCard } from "@/components/notes";
import { Button } from "@/components/ui";
import {
  getYearMonth,
  formatDateDisplay,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getToday,
  isToday,
} from "@/lib/utils/date";
import { getDatesWithOverrides } from "@/lib/db/overrideStore";
import type { GeneralNote } from "@/types";

export default function CalendarPage() {
  const router = useRouter();
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const { settings } = useSettings();

  // Calendar month/year state
  const [viewDate, setViewDate] = useState(() => {
    const { year, month } = getYearMonth(selectedDate);
    return { year, month };
  });

  // Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<GeneralNote | null>(null);

  // Get date range for this month view
  const monthRange = useMemo(() => {
    return {
      start: getFirstDayOfMonth(viewDate.year, viewDate.month),
      end: getLastDayOfMonth(viewDate.year, viewDate.month),
    };
  }, [viewDate.year, viewDate.month]);

  // Get dates with notes and overrides
  const { datesWithNotes } = useDatesWithNotes(
    monthRange.start,
    monthRange.end
  );
  const datesWithGeneralNotes = useDatesWithGeneralNotes(
    monthRange.start,
    monthRange.end
  );
  const [datesWithOverrides, setDatesWithOverrides] = useState<Set<string>>(
    new Set()
  );

  // General notes for selected date
  const {
    notes: generalNotes,
    loading: notesLoading,
    saveNote,
    removeNote,
    refresh: refreshNotes,
  } = useGeneralNotes(selectedDate);

  // Load overrides for the month
  useEffect(() => {
    getDatesWithOverrides(monthRange.start, monthRange.end).then(
      setDatesWithOverrides
    );
  }, [monthRange.start, monthRange.end]);

  const handleDateSelect = useCallback(
    (date: string) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  }, []);

  const handleGoToToday = useCallback(() => {
    const today = getToday();
    const { year, month } = getYearMonth(today);
    setViewDate({ year, month });
    setSelectedDate(today);
  }, [setSelectedDate]);

  const handleViewDay = useCallback(() => {
    router.push("/today");
  }, [router]);

  const handleAddNote = useCallback(() => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  }, []);

  const handleEditNote = useCallback((note: GeneralNote) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
  }, []);

  const handleSaveNote = useCallback(
    async (
      note: Omit<GeneralNote, "id" | "createdAt" | "updatedAt"> & { id?: string }
    ) => {
      const savedNote = await saveNote(note);
      await refreshNotes();
      return savedNote;
    },
    [saveNote, refreshNotes]
  );

  const handleDeleteNote = useCallback(
    async (id: string) => {
      await removeNote(id);
    },
    [removeNote]
  );

  return (
    <>
      <AppHeader
        title="Calendar"
        rightAction={
          !isToday(selectedDate) && (
            <Button variant="ghost" size="sm" onClick={handleGoToToday} className="text-primary font-medium">
              Today
            </Button>
          )
        }
      />

      <main className="w-full px-5 py-5 pb-28 animate-fade-in space-y-6">
        <CalendarGrid
          year={viewDate.year}
          month={viewDate.month}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          datesWithNotes={datesWithNotes}
          datesWithOverrides={datesWithOverrides}
          datesWithGeneralNotes={datesWithGeneralNotes}
          weekStart={settings.weekStart}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* Selected date preview container */}
        <div className="bg-white rounded-3xl shadow-soft p-5 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                {formatDateDisplay(selectedDate)}
              </h3>
              <div className="flex flex-wrap gap-3 mt-2">
                 {/* Compact Legend / Status */}
                 {datesWithNotes.has(selectedDate) && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold uppercase tracking-wider">
                       Class Notes
                    </span>
                 )}
                 {datesWithGeneralNotes.has(selectedDate) && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[11px] font-bold uppercase tracking-wider">
                       Notes
                    </span>
                 )}
                 {datesWithOverrides.has(selectedDate) && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider">
                       Modified
                    </span>
                 )}
              </div>
            </div>
            
            <Button onClick={handleViewDay} className="bg-primary text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl active:scale-95 transition-all">
              View Day
            </Button>
          </div>
          
          <div className="border-t border-gray-100 my-4" />

          {/* Notes Section within the card */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tasks & Notes</h4>
              <button onClick={handleAddNote} className="text-primary hover:text-primary-600 text-sm font-semibold flex items-center gap-1 transition-colors">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                 </svg>
                 Add
              </button>
            </div>

            {notesLoading ? (
               <div className="py-8 text-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
               </div>
            ) : generalNotes.length === 0 ? (
               <div className="py-6 text-center bg-surface-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">No notes allowed... just kidding.</p>
                  <p className="text-gray-500 font-medium text-sm mt-1">Tap + to add a note.</p>
               </div>
            ) : (
               <div className="space-y-3">
                  {generalNotes.map((note) => (
                    <GeneralNoteCard
                      key={note.id}
                      note={note}
                      onClick={() => handleEditNote(note)}
                    />
                  ))}
               </div>
            )}
          </div>
        </div>
      </main>

      {/* Note Modal */}
      <GeneralNoteModal
        isOpen={isNoteModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        initialNote={editingNote}
        defaultDate={selectedDate}
      />
    </>
  );
}
