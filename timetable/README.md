# College Timetable Generator

A modern React-based web application for generating conflict-free college timetables across multiple semesters simultaneously. The application uses a backtracking algorithm to intelligently schedule classes while avoiding teacher conflicts and optimizing the timetable structure.

## Features

- **Multi-Semester Support**: Generate timetables for 3 semesters at once (Odd: 3, 5, 7 or Even: 4, 6, 8)
- **Smart Scheduling**: Backtracking algorithm ensures no teacher conflicts across all semesters
- **Flexible Class Types**: Support for theory, practical, extra classes, library, and mentor periods
- **Visual Timetable Display**: Color-coded grid view with easy-to-read format
- **Export Options**: Download timetables as PDF or Excel files
- **Print Support**: Direct printing capability
- **Real-time Validation**: Automatic conflict detection during scheduling

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **PDF Generation**: jsPDF with autoTable plugin
- **Excel Export**: SheetJS (xlsx)
- **Language**: JavaScript (ES6+)

## Project Structure

```
timetable/
├── src/
│   ├── components/          # React UI components
│   │   ├── InputForm.jsx     # Subject input form
│   │   ├── SemesterGroupView.jsx
│   │   └── Timetable.jsx    # Timetable display component
│   ├── data/
│   │   └── sampleData.js    # Sample semester data
│   ├── scheduler/           # Scheduling algorithms
│   │   ├── backtrackingScheduler.js
│   │   ├── generateGroupSchedule.js
│   │   ├── generateSchedule.js
│   │   ├── placement.js
│   │   ├── scheduler.js
│   │   ├── taskBuilder.js
│   │   ├── teacherMatrix.js
│   │   └── validator.js
│   ├── utils/               # Utility functions
│   │   ├── constants.js
│   │   ├── debug.js
│   │   ├── helpers.js
│   │   └── shuffle.js
│   ├── App.jsx             # Main application component
│   ├── App.css
│   ├── index.css
│   └── main.jsx            # Application entry point
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd timetable
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage Guide

### Step 1: Select Semester Group
Choose between "Odd" (Semesters 3, 5, 7) or "Even" (Semesters 4, 6, 8) from the header.

### Step 2: Configure Semester Data
For each semester, configure:
- **Section & Room**: Assign section (e.g., A, B) and room number
- **Theory Subjects**: Add subjects with subject code, name, teacher, and classes per week
- **Practical Subjects**: Lab subjects that span 2 periods
- **Extra Classes**: Additional classes like placement training with preferred days
- **Fixed Periods**: Enable/disable Library and Mentor periods

### Step 3: Generate Timetable
Click the "Generate Timetables" button to create conflict-free schedules.

### Step 4: View and Export
- View the color-coded timetable grid
- Switch between semester tabs
- Export to PDF or Excel
- Print directly from the browser

## Scheduler Algorithm

The timetable generation uses a **backtracking algorithm** with the following approach:

1. **Task Building**: Converts all subjects and classes into scheduling tasks with priorities
2. **Backtracking Search**: Recursively attempts to place each class in valid time slots
3. **Validation**: Checks for:
   - Teacher availability (no double booking)
   - Subject distribution (max once per day)
   - Practical class duration (consecutive periods)
   - Fixed period constraints
4. **Global Teacher Schedule**: Maintains a unified schedule across all semesters to prevent conflicts

### Constraints Handled
- Teacher cannot be in two places at once
- Same subject not repeated more than once per day
- Practical classes require 2 consecutive periods
- Library and Mentor periods are fixed
- Lunch break is protected

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Time Structure

The timetable follows a 35-periods-per-week structure:

| Period | Time | Type |
|--------|------|------|
| I | 09:00 - 09:50 | Class |
| II | 09:50 - 10:40 | Class |
| III | 10:40 - 11:30 | Class |
| IV | 11:30 - 12:20 | Class |
| LUNCH | 12:20 - 01:05 | Break |
| V | 01:05 - 01:55 | Class |
| VI | 01:55 - 02:40 | Class |
| VII | 02:40 - 03:30 | Class |

**Working Days**: Monday - Friday

## Color Legend

- **Blue**: Theory Classes
- **Purple**: Practical/Lab Classes
- **Green**: Extra Classes
- **Amber**: Library Period
- **Rose**: Mentor Period

## License

MIT License

---

Built with React + Vite + TailwindCSS

