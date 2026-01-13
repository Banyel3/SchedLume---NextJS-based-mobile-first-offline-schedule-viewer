"use client";

import { useState, useCallback, useEffect } from "react";
import { useSettings } from "@/hooks";
import { AppHeader } from "@/components/layout";
import { CSVImporter } from "@/components/forms";
import { Button, Toast } from "@/components/ui";
import { clearAllData } from "@/lib/db/indexedDb";
import { downloadBackup } from "@/lib/utils/export";
import {
  downloadExampleTemplate,
  downloadScheduleCSV,
} from "@/lib/csv-template";
import {
  requestNotificationPermission,
  isNotificationPermissionGranted,
  checkAndShowDueReminders,
} from "@/lib/firebase";

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
} | null;

export default function SettingsPage() {
  const { settings, updateSettings, refresh } = useSettings();
  const [toast, setToast] = useState<ToastState>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState(false);

  // ... (Keep existing handlers mostly same, logic is fine)
  const handleImportSuccess = useCallback(() => {
    setToast({ message: "Schedule imported successfully!", type: "success" });
    refresh();
  }, [refresh]);

  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      await downloadBackup();
      setToast({ message: "Backup downloaded successfully!", type: "success" });
    } catch {
      setToast({ message: "Failed to export data", type: "error" });
    } finally {
      setExporting(false);
    }
  }, []);

  const handleExportCSV = useCallback(async () => {
    try {
      setExportingCSV(true);
      await downloadScheduleCSV();
      setToast({ message: "Schedule CSV downloaded!", type: "success" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to export CSV";
      setToast({ message, type: "error" });
    } finally {
      setExportingCSV(false);
    }
  }, []);

  const handleDownloadTemplate = useCallback(() => {
    downloadExampleTemplate();
    setToast({ message: "Template downloaded!", type: "success" });
  }, []);

  const handleClearData = useCallback(async () => {
    try {
      setClearing(true);
      await clearAllData();
      setShowClearConfirm(false);
      setToast({ message: "All data cleared successfully", type: "success" });
      refresh();
    } catch {
      setToast({ message: "Failed to clear data", type: "error" });
    } finally {
      setClearing(false);
    }
  }, [refresh]);

  const handleWeekStartChange = useCallback(
    async (value: "monday" | "sunday") => {
      try {
        await updateSettings({ weekStart: value });
      } catch {
        setToast({ message: "Failed to update setting", type: "error" });
      }
    },
    [updateSettings]
  );

  const handleTimeFormatChange = useCallback(
    async (value: "12h" | "24h") => {
      try {
        await updateSettings({ timeFormat: value });
      } catch {
        setToast({ message: "Failed to update setting", type: "error" });
      }
    },
    [updateSettings]
  );

  const handleNotificationToggle = useCallback(
    async (enabled: boolean) => {
      try {
        if (enabled && !isNotificationPermissionGranted()) {
          setRequestingPermission(true);
          const { permission } = await requestNotificationPermission();
          setRequestingPermission(false);

          if (permission !== "granted") {
            setToast({
              message: "Notifications require permission to be enabled",
              type: "error",
            });
            return;
          }
        }

        await updateSettings({ notificationsEnabled: enabled });
        if (enabled) {
          const count = await checkAndShowDueReminders();
          if (count > 0) {
            setToast({
              message: `${count} reminder(s) shown`,
              type: "info",
            });
          }
        }
      } catch {
        setToast({ message: "Failed to update notification settings", type: "error" });
      }
    },
    [updateSettings]
  );

  const handleNotificationTimeChange = useCallback(
    async (value: "08:00" | "12:00" | "18:00") => {
      try {
        await updateSettings({ notificationTime: value });
      } catch {
        setToast({ message: "Failed to update setting", type: "error" });
      }
    },
    [updateSettings]
  );

  const handleRequestPermission = useCallback(async () => {
    try {
      setRequestingPermission(true);
      const { permission } = await requestNotificationPermission();
      
      if (permission === "granted") {
        setToast({ message: "Notifications enabled!", type: "success" });
        await updateSettings({ notificationsEnabled: true });
      } else if (permission === "denied") {
        setToast({
          message: "Permission denied. Enable in browser settings.",
          type: "error",
        });
      }
    } catch {
      setToast({ message: "Failed to request permission", type: "error" });
    } finally {
      setRequestingPermission(false);
    }
  }, [updateSettings]);

  return (
    <>
      <AppHeader title="Settings" />

      <main className="w-full px-5 py-6 pb-28 space-y-6 max-w-2xl mx-auto animate-fade-in">
        
        {/* Section: Schedule */}
        <div className="space-y-3">
          <h2 className="px-1 text-sm font-bold text-gray-400 uppercase tracking-widest">Schedule</h2>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-6 space-y-5">
             <div className="space-y-4">
               <div>
                  <h3 className="text-gray-900 font-semibold mb-1">Import Schedule</h3>
                  <p className="text-gray-500 text-sm mb-4">Upload a CSV file to populate your calendar</p>
                  <CSVImporter onSuccess={handleImportSuccess} />
               </div>
               
               <div className="pt-2 border-t border-gray-100 flex justify-center">
                  <button onClick={handleDownloadTemplate} className="text-sm text-primary font-medium hover:underline">
                     Download CSV Template
                  </button>
               </div>
             </div>

             {settings.lastImportedFileName && (
               <div className="bg-surface-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                  </div>
                  <div className="min-w-0">
                     <p className="text-sm font-semibold text-gray-900 truncate">{settings.lastImportedFileName}</p>
                     <p className="text-xs text-gray-500">
                        Imported {settings.lastImportedAt && new Date(settings.lastImportedAt).toLocaleDateString()}
                     </p>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Section: Preferences */}
        <div className="space-y-3">
           <h2 className="px-1 text-sm font-bold text-gray-400 uppercase tracking-widest">Preferences</h2>
           <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              {/* Week Start */}
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                 <span className="font-semibold text-gray-900">Week Starts On</span>
                 <div className="flex bg-surface-100 rounded-xl p-1">
                    {(['monday', 'sunday'] as const).map((day) => (
                       <button
                          key={day}
                          onClick={() => handleWeekStartChange(day)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                             settings.weekStart === day 
                             ? "bg-white text-gray-900 shadow-sm" 
                             : "text-gray-500 hover:text-gray-700"
                          }`}
                       >
                          {day === 'monday' ? 'Mon' : 'Sun'}
                       </button>
                    ))}
                 </div>
              </div>

               {/* Time Format */}
               <div className="p-5 flex items-center justify-between">
                 <span className="font-semibold text-gray-900">Time Format</span>
                 <div className="flex bg-surface-100 rounded-xl p-1">
                    {(['12h', '24h'] as const).map((fmt) => (
                       <button
                          key={fmt}
                          onClick={() => handleTimeFormatChange(fmt)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                             settings.timeFormat === fmt 
                             ? "bg-white text-gray-900 shadow-sm" 
                             : "text-gray-500 hover:text-gray-700"
                          }`}
                       >
                          {fmt}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Section: Notifications */}
        <div className="space-y-3">
          <h2 className="px-1 text-sm font-bold text-gray-400 uppercase tracking-widest">Notifications</h2>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-5 space-y-5">
             <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Due Date Reminders</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Alerts 3, 2, & 1 day before</p>
                </div>
                <button
                   onClick={() => handleNotificationToggle(!settings.notificationsEnabled)}
                   className={`w-12 h-7 rounded-full transition-colors relative ${
                      settings.notificationsEnabled ? "bg-primary" : "bg-gray-200"
                   }`}
                >
                   <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.notificationsEnabled ? "translate-x-6" : "translate-x-1"
                   }`} />
                </button>
             </div>

             {settings.notificationsEnabled && (
                <div className="pt-4 border-t border-gray-100">
                   <label className="text-sm font-medium text-gray-700 mb-3 block">Reminder Time</label>
                   <div className="grid grid-cols-3 gap-2">
                      {(["08:00", "12:00", "18:00"] as const).map((time) => (
                         <button
                           key={time}
                           onClick={() => handleNotificationTimeChange(time)}
                           className={`py-2 px-2 rounded-xl text-sm font-medium border transition-all ${
                              settings.notificationTime === time
                              ? "border-primary bg-primary-50 text-primary-700"
                              : "border-gray-200 text-gray-600 hover:bg-surface-50"
                           }`}
                         >
                            {time === "08:00" ? "Morning" : time === "12:00" ? "Noon" : "Evening"}
                         </button>
                      ))}
                   </div>
                </div>
             )}

            {settings.notificationPermission === "default" && !settings.notificationsEnabled && (
               <Button onClick={handleRequestPermission} disabled={requestingPermission} className="w-full">
                  Enable Notifications
               </Button>
            )}
          </div>
        </div>

        {/* Section: Data & About */}
        <div className="space-y-3">
           <h2 className="px-1 text-sm font-bold text-gray-400 uppercase tracking-widest">Data & System</h2>
           <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-2">
              <button 
                onClick={handleExportCSV}
                disabled={exportingCSV}
                className="w-full p-4 flex items-center justify-between hover:bg-surface-50 rounded-2xl transition-colors text-left"
              >
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                       </svg>
                    </div>
                    <span className="font-medium text-gray-700">Export Schedule (CSV)</span>
                 </div>
              </button>
              
              <button 
                onClick={handleExport}
                disabled={exporting}
                className="w-full p-4 flex items-center justify-between hover:bg-surface-50 rounded-2xl transition-colors text-left"
              >
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                       </svg>
                    </div>
                    <span className="font-medium text-gray-700">Backup All Data (JSON)</span>
                 </div>
              </button>

              <button 
                onClick={() => setShowClearConfirm(true)}
                className="w-full p-4 flex items-center justify-between hover:bg-red-50 rounded-2xl transition-colors text-left group"
              >
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                    </div>
                    <span className="font-medium text-red-600">Clear All Data</span>
                 </div>
              </button>
           </div>
        </div>

        {/* Clear Data Confirmation */}
        {showClearConfirm && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Delete everything?</h3>
                 <p className="text-gray-500 mb-6"> This will permenantly delete all schedules, notes, and settings. This action cannot be undone.</p>
                 <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setShowClearConfirm(false)} className="flex-1">Cancel</Button>
                    <Button variant="danger" disabled={clearing} onClick={handleClearData} className="flex-1">
                       {clearing ? "Deleting..." : "Delete"}
                    </Button>
                 </div>
              </div>
           </div>
        )}

        {/* Footer/About */}
        <div className="text-center py-6">
           <div className="inline-flex items-center gap-2 justify-center bg-white px-4 py-2 rounded-full shadow-sm mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">SchedLume v1.0</span>
           </div>
           <p className="text-xs text-gray-400">Secure, offline, and yours.</p>
        </div>
      </main>

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
