# SchedLume – Offline Class Schedule & Notes PWA

**A mobile-first Progressive Web App for managing your class schedule, completely offline.**

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Overview

**SchedLume** is a lightweight, offline-capable class schedule viewer designed for students with recurring weekly timetables. Import your schedule once from a simple CSV file, and access it anytime—even without an internet connection.

Unlike cloud-based calendar apps, SchedLume stores everything locally on your device using modern browser storage APIs. This means your data stays private, loads instantly, and works perfectly offline. Whether you're in a basement classroom or on an airplane, your schedule is always available.

Perfect for students who need quick access to their weekly classes, want to track per-class notes throughout the semester, or need to handle special schedule overrides like makeup classes, canceled sessions, or exam schedules.

---

## Tech Stack

- **[Next.js 16.1.1](https://nextjs.org/)** (App Router) – React framework with server components and optimized routing
- **[React 19.2.3](https://react.dev/)** – UI library for building interactive components
- **[TypeScript 5](https://www.typescriptlang.org/)** – Type-safe JavaScript for better developer experience
- **[Tailwind CSS v4](https://tailwindcss.com/)** – Utility-first CSS framework for responsive design
- **[Zustand 5](https://github.com/pmndrs/zustand)** – Lightweight state management
- **Service Worker + Web App Manifest** – Progressive Web App capabilities for offline functionality
- **IndexedDB + localStorage** – Client-side storage for schedules, notes, and settings
- **Deployed on [Vercel](https://vercel.com/)** – Serverless deployment with automatic HTTPS and CDN

---

## Key Features

### 📅 Schedule Management

- **CSV-based import/export** – Import your weekly schedule from a simple CSV file
- **Flexible schedule format** – Define classes with subject, day, time, location, professor, and color
- **Schedule templates** – Download pre-configured CSV templates to get started quickly

### 📱 Multiple Views

- **Today view** – See your current day's classes with date navigation strip
- **Week view** – Browse all classes organized by weekday with tab navigation
- **Calendar view** – Month calendar with date selection and class listings
- **Smart navigation** – Quickly jump between today, specific weeks, or any calendar date

### ✏️ Notes & Overrides

- **Per-class-per-day notes** – Add notes to any class on any specific date
- **Historical notes** – View notes from previous days to track what happened in past classes
- **Day overrides** – Create special schedule variations for specific dates
- **Flexible editing** – Add makeup classes, cancel sessions, or modify times for holidays/exams

### 🔌 Offline-First Design

- **Works without internet** – Access your schedule anytime after initial load
- **Local-only storage** – All data stays on your device (IndexedDB + localStorage)
- **PWA installable** – Add to home screen on mobile or install as desktop app
- **Fast & responsive** – Instant load times with client-side rendering

### 🎨 User Experience

- **Mobile-first UI** – Optimized touch targets and responsive layouts
- **Color-coded classes** – Visual differentiation with customizable class colors
- **Accessible design** – Keyboard navigation and screen reader support
- **Modern design** – Clean interface with coral accent colors and smooth transitions

---

## Getting Started

### Prerequisites

- **Node.js 20+** and **npm** (or yarn/pnpm)
- Modern web browser with IndexedDB support

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/schedlume.git
   cd schedlume
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

### Environment Configuration

No environment variables required! SchedLume is entirely client-side and requires no backend configuration.

---

## Usage Guide

### Import a Schedule

1. **Download the CSV template**

   - Navigate to **Settings** page
   - Click **"Download CSV template"** to get the example file
   - Or use the included `sample-schedule.csv` as a reference

2. **Fill in your schedule**

   Create a CSV file with the following columns:

   ```csv
   subject_name,day_of_week,start_time,end_time,location,professor,color
   ```

   **Example:**

   ```csv
   Mathematics,Monday,09:00,10:30,Room 201,Dr. Smith,#FF6B6B
   Physics,Tuesday,11:00,12:30,Lab A,Prof. Johnson,#4ECDC4
   Computer Science,Wednesday,14:00,15:30,Lab B,Dr. Chen,#45B7D1
   ```

   **Column details:**

   - `subject_name` – Course name (required)
   - `day_of_week` – Monday through Sunday (required)
   - `start_time` – 24-hour format HH:MM (required)
   - `end_time` – 24-hour format HH:MM (required)
   - `location` – Classroom/building (optional)
   - `professor` – Instructor name (optional)
   - `color` – Hex color code like #FF6B6B (optional)

3. **Import to SchedLume**
   - Go to **Settings** → **Schedule** section
   - Click the CSV import area or drag & drop your file
   - Your schedule will be loaded and saved locally

### View Schedules

#### Today View

- Shows all classes scheduled for the current day
- Use the **date strip** to navigate to previous or future days
- Click any class card to view details and notes

#### Week View

- Displays all classes grouped by weekday (Monday–Sunday)
- Use **day tabs** at the top to switch between days
- Navigate weeks with **previous/next week arrows**

#### Calendar View

- Month calendar with visual indicators for days with classes
- Click any date to see that day's schedule
- **Color dots** under dates indicate:
  - **Yellow** – Has notes on that date
  - **Blue** – Has schedule overrides/changes

### Overrides & Notes

#### Add a Day Override

1. Navigate to the specific date (in any view)
2. Click **"Add Class"** or edit an existing class
3. Modify the schedule for just that date:
   - Add a makeup class
   - Change time/location for one-time events
   - Mark a class as canceled
4. Changes apply only to the selected date

#### Add Class Notes

1. Click on any class card to open details
2. Scroll to the **Notes** section
3. Type your notes for that specific class on that specific date
4. Notes are auto-saved as you type
5. Return to that date later to view historical notes

#### View Past Notes

- Navigate to previous dates using the calendar or date strip
- Open class cards to see notes from past sessions
- Perfect for reviewing what was covered or tasks mentioned

---

## PWA & Offline Behavior

### Installing as a PWA

**On Mobile (iOS/Android):**

1. Open SchedLume in Safari (iOS) or Chrome (Android)
2. Tap the **Share** button (iOS) or **Menu** (Android)
3. Select **"Add to Home Screen"**
4. The app will appear as an icon on your home screen

**On Desktop (Chrome/Edge):**

1. Look for the **install icon** in the address bar
2. Click **"Install SchedLume"**
3. The app will open in its own window

### Offline Capabilities

- **Works without internet** after the first load
- **All data stored locally** using IndexedDB and localStorage:
  - Class schedules
  - Day overrides
  - Notes
  - User preferences (week start day, time format)
- **Service worker caching** ensures the app shell loads instantly

### Data Persistence & Caveats

⚠️ **Important Notes:**

- Clearing your browser data/cache will **delete all schedules and notes**
- Data is **device-specific** – it won't sync between devices
- Use the **Export Backup** feature in Settings to save your data
- Consider exporting backups before clearing browser storage or reinstalling

---

## Project Structure

```
schedlume/
├── app/                    # Next.js App Router pages
│   ├── calendar/          # Calendar view page
│   ├── settings/          # Settings & data management
│   ├── today/             # Today view page
│   ├── week/              # Week view page
│   ├── layout.tsx         # Root layout with PWA setup
│   └── globals.css        # Global styles & design tokens
├── components/            # React components
│   ├── calendar/          # Calendar grid & date components
│   ├── forms/             # CSV importer, note editor, overrides
│   ├── layout/            # Header, navigation, date strip
│   ├── pwa/               # Service worker registration
│   ├── schedule/          # Class cards & detail views
│   └── ui/                # Reusable UI components (buttons, badges, modals)
├── hooks/                 # Custom React hooks
│   ├── useClasses.ts      # Class schedule management
│   ├── useSettings.ts     # User preferences
│   └── useNote.ts         # Notes CRUD operations
├── lib/                   # Utilities & business logic
│   ├── db/                # IndexedDB wrapper
│   ├── csv/               # CSV parsing & generation
│   ├── utils/             # Date, time, formatting helpers
│   └── constants.ts       # App-wide constants
├── public/                # Static assets
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   ├── favicon.svg        # App icon
│   └── icons/             # PWA icons (generated)
├── types/                 # TypeScript type definitions
├── package.json           # Dependencies & scripts
└── tsconfig.json          # TypeScript configuration
```

---

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

### Code Quality

- **TypeScript** for type safety
- **ESLint** with Next.js recommended rules
- **Tailwind CSS** with custom design tokens
- **Component-driven architecture**

---

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and commit
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style (checked by ESLint)
- Write clear, descriptive commit messages
- Update documentation for new features
- Test your changes across different screen sizes
- Ensure the production build succeeds (`npm run build`)

### Areas for Contribution

- 🌐 Internationalization/translations
- 🎨 Additional themes or color schemes
- 📊 Analytics/statistics features (time spent in classes, attendance tracking)
- 🔄 Export/import from other calendar formats (iCal, Google Calendar)
- ♿ Accessibility improvements
- 📱 Enhanced PWA features (push notifications for class reminders)

---

## License

This project is licensed under the **MIT License**.

**In short:** You can use, copy, modify, and distribute this software for any purpose (including commercial projects) with attribution and without warranty.

See the [LICENSE](./LICENSE) file for the full legal text.

---

## Acknowledgments

Built with modern web technologies for students who need simple, reliable access to their class schedules. No cloud, no subscriptions, no tracking—just your schedule, on your device.

---

## Support

If you encounter any issues or have questions:

- **Report bugs** via [GitHub Issues](https://github.com/yourusername/schedlume/issues)
- **Request features** through the issue tracker
- **Ask questions** in GitHub Discussions (if enabled)

---

**Made with ❤️ for students everywhere.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/schedlume)
