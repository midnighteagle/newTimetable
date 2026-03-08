import 'jspdf-autotable';

import React, {
  useEffect,
  useState,
} from 'react';

import { jsPDF } from 'jspdf';
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  FileDown,
  FileSpreadsheet,
  FlaskConical,
  Library,
  Plus,
  Printer,
  RefreshCw,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
import * as XLSX from 'xlsx';

import { generateGroupSchedule } from './scheduler/generateGroupSchedule';

// Period Data
const PERIOD_DATA = [
  { label: "I", start: "09:00", end: "09:50" },
  { label: "II", start: "09:50", end: "10:40" },
  { label: "III", start: "10:40", end: "11:30" },
  { label: "IV", start: "11:30", end: "12:20" },
  { label: "LUNCH", start: "12:20", end: "01:05", isLunch: true },
  { label: "V", start: "01:05", end: "01:55" },
  { label: "VI", start: "01:55", end: "02:40" },
  { label: "VII", start: "02:40", end: "03:30" },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Semester Groups
const ODD_SEMESTERS = [3, 5, 7];
const EVEN_SEMESTERS = [4, 6, 8];

// Create empty semester data structure
const createEmptySemesterData = (semester) => ({
  semester,
  section: 'A',
  room: '301',
  theorySubjects: [
    { code: '', name: '', teacher: '', classesPerWeek: 3 }
  ],
  practicalSubjects: [
    { code: '', name: '', teacher: '', classesPerWeek: 2 }
  ],
  extraClasses: [
    { name: '', teacher: '', classesPerWeek: 2, preferredDays: [] }
  ],
  internship: [
    { subjectCode: '', name: '', teacher: '', classesPerWeek: 2 }
  ],
  mentorPeriod: {
    enabled: true,
    teacher: 'Mentor'
  },
  libraryPeriod: {
    enabled: true,
    teacher: 'Librarian'
  }
});

export default function App() {
  const [step, setStep] = useState(1);
  const [generatedTimetables, setGeneratedTimetables] = useState({});
  const [errors, setErrors] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Semester Group Selection
  const [semesterGroup, setSemesterGroup] = useState('odd');
  
  // Multi-semester data
  const [semesterData, setSemesterData] = useState({
    3: createEmptySemesterData(3),
    5: createEmptySemesterData(5),
    7: createEmptySemesterData(7)
  });

  // Get current semester list based on group
  const currentSemesters = semesterGroup === 'odd' ? ODD_SEMESTERS : EVEN_SEMESTERS;
  const [activeSemesterTab, setActiveSemesterTab] = useState(currentSemesters[0]);

  // Helper functions for semester data
  const updateSemesterData = (semester, field, value) => {
    setSemesterData(prev => ({
      ...prev,
      [semester]: {
        ...prev[semester],
        [field]: value
      }
    }));
  };

  // Theory Subjects
  const addTheorySubject = (semester) => {
    const current = semesterData[semester].theorySubjects;
    updateSemesterData(semester, 'theorySubjects', [...current, { code: '', name: '', teacher: '', classesPerWeek: 1 }]);
  };

  const removeTheorySubject = (semester, index) => {
    const current = semesterData[semester].theorySubjects;
    updateSemesterData(semester, 'theorySubjects', current.filter((_, i) => i !== index));
  };

  const updateTheorySubject = (semester, index, field, value) => {
    const current = [...semesterData[semester].theorySubjects];
    current[index][field] = value;
    updateSemesterData(semester, 'theorySubjects', current);
  };

  // Practical Subjects
  const addPracticalSubject = (semester) => {
    const current = semesterData[semester].practicalSubjects;
    updateSemesterData(semester, 'practicalSubjects', [...current, { code: '', name: '', teacher: '', classesPerWeek: 1 }]);
  };

  const removePracticalSubject = (semester, index) => {
    const current = semesterData[semester].practicalSubjects;
    updateSemesterData(semester, 'practicalSubjects', current.filter((_, i) => i !== index));
  };

  const updatePracticalSubject = (semester, index, field, value) => {
    const current = [...semesterData[semester].practicalSubjects];
    current[index][field] = value;
    updateSemesterData(semester, 'practicalSubjects', current);
  };

  // Extra Classes
  const addExtraClass = (semester) => {
    const current = semesterData[semester].extraClasses;
    updateSemesterData(semester, 'extraClasses', [...current, { name: '', teacher: '', classesPerWeek: 1, preferredDays: [] }]);
  };

  const removeExtraClass = (semester, index) => {
    const current = semesterData[semester].extraClasses;
    updateSemesterData(semester, 'extraClasses', current.filter((_, i) => i !== index));
  };

  const updateExtraClass = (semester, index, field, value) => {
    const current = [...semesterData[semester].extraClasses];
    current[index][field] = value;
    updateSemesterData(semester, 'extraClasses', current);
  };

  const toggleExtraClassDay = (semester, index, day) => {
    const current = [...semesterData[semester].extraClasses];
    const currentDays = current[index].preferredDays || [];
    if (currentDays.includes(day)) {
      current[index].preferredDays = currentDays.filter(d => d !== day);
    } else {
      current[index].preferredDays = [...currentDays, day].sort();
    }
    updateSemesterData(semester, 'extraClasses', current);
  };

  // Internship
  const updateInternship = (semester, index, field, value) => {
    const current = [...semesterData[semester].internship];
    current[index][field] = value;
    updateSemesterData(semester, 'internship', current);
  };

  // Change semester group and reset data
  const changeSemesterGroup = (group) => {
    if (group === 'odd') {
      setActiveSemesterTab(3);
      setSemesterData({
        3: createEmptySemesterData(3),
        5: createEmptySemesterData(5),
        7: createEmptySemesterData(7)
      });
    } else {
      setActiveSemesterTab(4);
      setSemesterData({
        4: createEmptySemesterData(4),
        6: createEmptySemesterData(6),
        8: createEmptySemesterData(8)
      });
    }
    setSemesterGroup(group);
    setGeneratedTimetables({});
  };

  // Update active tab when semester group changes
  useEffect(() => {
    setActiveSemesterTab(currentSemesters[0]);
  }, [semesterGroup]);

  // ========== TIMETABLE GENERATION (USING EXISTING SCHEDULER) ==========
  const generateTimetable = () => {
    setIsGenerating(true);
    setErrors([]);

    // Convert UI data format to scheduler format
    const semesterInputs = {};
    
    currentSemesters.forEach(semester => {
      const semData = semesterData[semester];
      
      semesterInputs[semester] = {
        semester: semData.semester,
        subjects: semData.theorySubjects.filter(s => s.name && s.teacher).map(s => ({
          name: s.name,
          teacher: s.teacher,
          weekly: s.classesPerWeek,
          type: 'theory',
          subjectCode: s.code || s.name.substring(0, 3).toUpperCase()
        })),
        practicals: semData.practicalSubjects.filter(s => s.name && s.teacher).map(s => ({
          name: s.name,
          teacher: s.teacher,
          weekly: s.classesPerWeek,
          duration: 2,
          subjectCode: s.code || s.name.substring(0, 3).toUpperCase()
        })),
        extras: semData.extraClasses.filter(s => s.name && s.teacher).map(s => ({
          name: s.name,
          teacher: s.teacher,
          weekly: s.classesPerWeek
        }))
      };

      // Add library if enabled
      if (semData.libraryPeriod.enabled) {
        semesterInputs[semester].extras.push({
          name: 'Library',
          teacher: semData.libraryPeriod.teacher || 'Librarian',
          weekly: 1
        });
      }

      // Add mentor if enabled
      if (semData.mentorPeriod.enabled) {
        semesterInputs[semester].extras.push({
          name: 'Mentor',
          teacher: semData.mentorPeriod.teacher || 'Mentor',
          weekly: 1
        });
      }
    });

    // Use existing scheduler
    setTimeout(() => {
      const result = generateGroupSchedule(
        semesterGroup === 'odd' ? 'Odd' : 'Even',
        semesterInputs
      );

      if (result) {
        // Transform result to include section and room info
        const transformedResult = {};
        currentSemesters.forEach(sem => {
          transformedResult[sem] = {
            grid: result[sem],
            section: semesterData[sem].section,
            room: semesterData[sem].room
          };
        });
        setGeneratedTimetables(transformedResult);
        setStep(2);
      } else {
        setErrors(['Unable to generate complete timetable. Try reducing classes or changing teachers.']);
      }
      setIsGenerating(false);
      window.scrollTo(0, 0);
    }, 500);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    let yPosition = 15;
    
    currentSemesters.forEach((semester, index) => {
      if (index > 0) {
        doc.addPage();
        yPosition = 15;
      }
      
      const timetable = generatedTimetables[semester];
      if (!timetable) return;
      
      doc.setFontSize(18);
      doc.text(`Timetable - Semester ${semester}`, 105, yPosition, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Section: ${timetable.section} | Room: ${timetable.room}`, 105, yPosition + 7, { align: 'center' });

      const tableData = DAYS.map((day, dayIndex) => {
        return PERIOD_DATA.map((period, periodIndex) => {
          const cell = timetable.grid[dayIndex]?.[periodIndex];
          if (period.isLunch) return 'LUNCH';
          if (!cell) return '';
          return `${cell.subject}\n${cell.teacher || ''}`;
        });
      });

      const headers = ['Day', ...PERIOD_DATA.map(p => p.isLunch ? 'L' : p.label)];
      
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: yPosition + 12,
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold' } }
      });
    });

    const groupName = semesterGroup === 'odd' ? 'Odd' : 'Even';
    doc.save(`timetable_${groupName}_semesters.pdf`);
  };

  // Export to Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    currentSemesters.forEach(semester => {
      const timetable = generatedTimetables[semester];
      if (!timetable) return;
      
      const headers = ['Day', ...PERIOD_DATA.map(p => p.isLunch ? 'LUNCH' : `${p.label} (${p.start}-${p.end})`)];
      
      const data = DAYS.map((day, dayIndex) => {
        return [day, ...PERIOD_DATA.map((period, periodIndex) => {
          const cell = timetable.grid[dayIndex]?.[periodIndex];
          if (period.isLunch) return 'LUNCH BREAK';
          if (!cell) return '';
          return `${cell.subject}\n${cell.teacher || ''}`;
        })];
      });

      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      XLSX.utils.book_append_sheet(wb, ws, `Sem ${semester}`);
    });
    
    const groupName = semesterGroup === 'odd' ? 'Odd' : 'Even';
    XLSX.writeFile(wb, `timetable_${groupName}_semesters.xlsx`);
  };

  const getCellColor = (type) => {
    switch(type) {
      case 'theory': return 'bg-blue-50 border-blue-200';
      case 'practical': return 'bg-purple-50 border-purple-200';
      case 'extra': return 'bg-emerald-50 border-emerald-200';
      case 'internship': return 'bg-cyan-50 border-cyan-200';
      case 'library': return 'bg-amber-50 border-amber-200';
      case 'mentor': return 'bg-rose-50 border-rose-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Render semester tabs
  const renderSemesterTabs = () => (
    <div className="flex gap-2 mb-6">
      {currentSemesters.map(sem => (
        <button
          key={sem}
          onClick={() => setActiveSemesterTab(sem)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSemesterTab === sem
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semester {sem}
        </button>
      ))}
    </div>
  );

  // Render input forms for a semester
  const renderSemesterForm = (semester) => {
    const semData = semesterData[semester];
    
    return (
      <div className="space-y-6">
        {/* General Information for this semester */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold">Semester {semester} - General Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Section</label>
              <input 
                type="text"
                value={semData.section}
                onChange={(e) => updateSemesterData(semester, 'section', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Room Number</label>
              <input 
                type="text"
                value={semData.room}
                onChange={(e) => updateSemesterData(semester, 'room', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="301"
              />
            </div>
          </div>
        </div>

        {/* Theory Subjects */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold">Theory Subjects</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">1 Period = 1 Class</span>
            </div>
            <button onClick={() => addTheorySubject(semester)} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {semData.theorySubjects.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No theory subjects added</p>
          ) : (
            <div className="space-y-3">
              {semData.theorySubjects.map((subject, index) => (
                <div key={index} className="flex gap-2 p-3 bg-slate-50 rounded-xl items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Subject Code</label>
                    <input 
                      type="text"
                      value={subject.code}
                      onChange={(e) => updateTheorySubject(semester, index, 'code', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                      placeholder="AD-501"
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-xs text-slate-500 mb-1">Subject Name</label>
                    <input 
                      type="text"
                      value={subject.name}
                      onChange={(e) => updateTheorySubject(semester, index, 'name', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                      placeholder="Machine Learning"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Teacher</label>
                    <input 
                      type="text"
                      value={subject.teacher}
                      onChange={(e) => updateTheorySubject(semester, index, 'teacher', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                      placeholder="Dr. Sharma"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-slate-500 mb-1">Classes/Week</label>
                    <input 
                      type="number"
                      min="1"
                      max="5"
                      value={subject.classesPerWeek}
                      onChange={(e) => updateTheorySubject(semester, index, 'classesPerWeek', parseInt(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <button onClick={() => removeTheorySubject(semester, index)} className="p-2 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Practical Subjects */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold">Practical Subjects</h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">1 Class = 2 Periods</span>
            </div>
            <button onClick={() => addPracticalSubject(semester)} className="flex items-center gap-1 text-sm bg-purple-50 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {semData.practicalSubjects.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No practical subjects added</p>
          ) : (
            <div className="space-y-3">
              {semData.practicalSubjects.map((subject, index) => (
                <div key={index} className="flex gap-2 p-3 bg-slate-50 rounded-xl items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Subject Code</label>
                    <input 
                      type="text"
                      value={subject.code}
                      onChange={(e) => updatePracticalSubject(semester, index, 'code', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                      placeholder="AD-505"
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-xs text-slate-500 mb-1">Subject Name</label>
                    <input 
                      type="text"
                      value={subject.name}
                      onChange={(e) => updatePracticalSubject(semester, index, 'name', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                      placeholder="ML Lab"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Teacher</label>
                    <input 
                      type="text"
                      value={subject.teacher}
                      onChange={(e) => updatePracticalSubject(semester, index, 'teacher', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                      placeholder="Dr. Sharma"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-slate-500 mb-1">Classes/Week</label>
                    <input 
                      type="number"
                      min="1"
                      max="4"
                      value={subject.classesPerWeek}
                      onChange={(e) => updatePracticalSubject(semester, index, 'classesPerWeek', parseInt(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <button onClick={() => removePracticalSubject(semester, index)} className="p-2 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extra Classes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold">Extra Classes</h2>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">1 Class = 2 Periods</span>
            </div>
            <button onClick={() => addExtraClass(semester)} className="flex items-center gap-1 text-sm bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-100">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {semData.extraClasses.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No extra classes added</p>
          ) : (
            <div className="space-y-4">
              {semData.extraClasses.map((extra, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1">Extra Class Name</label>
                      <input 
                        type="text"
                        value={extra.name}
                        onChange={(e) => updateExtraClass(semester, index, 'name', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                        placeholder="Placement Training"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1">Teacher</label>
                      <input 
                        type="text"
                        value={extra.teacher}
                        onChange={(e) => updateExtraClass(semester, index, 'teacher', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                        placeholder="Mr. Verma"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-slate-500 mb-1">Classes/Week</label>
                      <input 
                        type="number"
                        min="1"
                        max="5"
                        value={extra.classesPerWeek}
                        onChange={(e) => updateExtraClass(semester, index, 'classesPerWeek', parseInt(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <button onClick={() => removeExtraClass(semester, index)} className="p-2 text-slate-400 hover:text-red-500 self-end">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">Preferred Days (Select multiple)</label>
                    <div className="flex gap-2 flex-wrap">
                      {DAYS_OF_WEEK.map((day, dayIndex) => (
                        <button
                          key={day}
                          onClick={() => toggleExtraClassDay(semester, index, dayIndex)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            extra.preferredDays?.includes(dayIndex)
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Periods */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold">Fixed Periods</h2>
            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">1 Period Each</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <Library className="w-8 h-8 text-amber-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={semData.libraryPeriod.enabled}
                    onChange={(e) => updateSemesterData(semester, 'libraryPeriod', {...semData.libraryPeriod, enabled: e.target.checked})}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className="font-medium">Library Period</span>
                </div>
                <input 
                  type="text"
                  value={semData.libraryPeriod.teacher}
                  onChange={(e) => updateSemesterData(semester, 'libraryPeriod', {...semData.libraryPeriod, teacher: e.target.value})}
                  disabled={!semData.libraryPeriod.enabled}
                  className="mt-2 w-full p-1.5 text-sm border border-amber-200 rounded bg-white disabled:bg-slate-100"
                  placeholder="Librarian Name"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-xl border border-rose-200">
              <Users className="w-8 h-8 text-rose-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={semData.mentorPeriod.enabled}
                    onChange={(e) => updateSemesterData(semester, 'mentorPeriod', {...semData.mentorPeriod, enabled: e.target.checked})}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-medium">Mentor Period</span>
                </div>
                <input 
                  type="text"
                  value={semData.mentorPeriod.teacher}
                  onChange={(e) => updateSemesterData(semester, 'mentorPeriod', {...semData.mentorPeriod, teacher: e.target.value})}
                  disabled={!semData.mentorPeriod.enabled}
                  className="mt-2 w-full p-1.5 text-sm border border-rose-200 rounded bg-white disabled:bg-slate-100"
                  placeholder="Mentor Name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render timetable display for a semester
  const renderTimetableDisplay = (semester) => {
    const timetable = generatedTimetables[semester];
    if (!timetable) return null;
    
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Semester {semester} - Section {timetable.section}
              </h2>
              <p className="text-slate-300 text-sm">Room: {timetable.room}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Academic Year</p>
              <p className="font-medium">2024-2025</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 border-r font-bold text-slate-600 text-sm text-center w-24">Day</th>
                {PERIOD_DATA.map((period, index) => (
                  <th key={index} className={`p-3 font-bold text-center min-w-[120px] ${period.isLunch ? 'bg-orange-50 text-orange-500' : 'text-slate-700'}`}>
                    <div className="text-xs uppercase tracking-wider opacity-60 mb-1">
                      {period.isLunch ? 'BREAK' : `Period ${period.label}`}
                    </div>
                    <div className="text-xs">{period.start} - {period.end}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, dayIndex) => (
                <tr key={day} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-3 border-r bg-slate-50 font-bold text-slate-600 text-center text-sm uppercase">
                    {day}
                  </td>
                  {PERIOD_DATA.map((period, periodIndex) => {
                    const cell = timetable.grid[dayIndex]?.[periodIndex];
                    
                    if (period.isLunch) {
                      return (
                        <td key={periodIndex} className="p-2 border-r border-slate-100 bg-orange-50/30 text-center">
                          <span className="text-orange-400 font-medium text-xs">LUNCH</span>
                        </td>
                      );
                    }
                    
                    if (!cell) {
                      return (
                        <td key={periodIndex} className="p-2 border-r border-slate-100">
                          <div className="h-20 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center">
                            <span className="text-slate-300 text-xs">Free</span>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td 
                        key={periodIndex} 
                        className="p-2 border-r border-slate-100"
                      >
                        <div className={`h-full min-h-[80px] rounded-lg p-2 border-2 ${getCellColor(cell.type)}`}>
                          <div className="font-bold text-xs leading-tight mb-1">
                            {cell.subject}
                          </div>
                          <div className="text-[10px] opacity-75 truncate">
                            {cell.teacher}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded"></div>
              <span className="text-xs text-slate-600">Theory</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-50 border-2 border-purple-200 rounded"></div>
              <span className="text-xs text-slate-600">Practical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-50 border-2 border-emerald-200 rounded"></div>
              <span className="text-xs text-slate-600">Extra Class</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-50 border-2 border-amber-200 rounded"></div>
              <span className="text-xs text-slate-600">Library</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-rose-50 border-2 border-rose-200 rounded"></div>
              <span className="text-xs text-slate-600">Mentor</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">College Timetable Generator</h1>
                <p className="text-xs text-white/70">Multi-Semester Schedule Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>35 Periods/Week</span>
              </div>
              {/* Semester Group Selector */}
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-xs text-white/70">Group:</span>
                <button
                  onClick={() => changeSemesterGroup('odd')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    semesterGroup === 'odd' 
                      ? 'bg-white text-indigo-600' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Odd (3,5,7)
                </button>
                <button
                  onClick={() => changeSemesterGroup('even')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    semesterGroup === 'even' 
                      ? 'bg-white text-indigo-600' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Even (4,6,8)
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {step === 1 ? (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-900">Multi-Semester Timetable Generation</h3>
                  <p className="text-sm text-indigo-700">
                    Generating for: <span className="font-bold">{semesterGroup === 'odd' ? 'Semesters 3, 5, 7' : 'Semesters 4, 6, 8'}</span> 
                    {' '}&bull; Teachers will be scheduled globally to avoid conflicts across all semesters
                  </p>
                </div>
              </div>
            </div>

            {/* Semester Tabs */}
            {renderSemesterTabs()}

            {/* Active Semester Form */}
            {renderSemesterForm(activeSemesterTab)}

            {/* Generate Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <button 
                onClick={generateTimetable}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Calendar className="w-5 h-5" />
                )}
                Generate Timetables for All {semesterGroup === 'odd' ? 'Odd' : 'Even'} Semesters
              </button>
            </div>
          </div>
        ) : (
          /* Timetable Display */
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                ← Edit Configuration
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={generateTimetable}
                  disabled={isGenerating}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                    isGenerating 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Regenerate'}
                </button>
                <button 
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100"
                >
                  <FileDown className="w-4 h-4" /> PDF
                </button>
                <button 
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Excel
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                  <AlertCircle className="w-5 h-5" />
                  Scheduling Warnings
                </div>
                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

