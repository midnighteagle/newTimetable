import { useState } from 'react';

function InputForm({ onSubmit }) {

  const [subject,setSubject] = useState("");
  const [teacher,setTeacher] = useState("");
  const [classes,setClasses] = useState(1);
  const [subjectType, setSubjectType] = useState('theory');

  const [subjects,setSubjects] = useState([]);

  const addSubject = () => {
    if (!subject || !teacher) return;

    const newSubject = {
      code: subject,
      name: subject,
      teacher: teacher,
      classesPerWeek: Number(classes),
      type: subjectType
    };

    setSubjects([...subjects,newSubject]);

    setSubject("");
    setTeacher("");
    setClasses(1);

  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {

    const semData = {

      theorySubjects: subjects.filter(s => s.type === 'theory'),
      practicalSubjects: subjects.filter(s => s.type === 'practical'),
      extraClasses: subjects.filter(s => s.type === 'extra'),
      internship: {}

    };

    onSubmit(semData);

  };

  return (

    <div className="input-form-container">

      <h2>Add Subject</h2>

      <div className="form-row">
        <input
          className="form-input"
          placeholder="Subject Name"
          value={subject}
          onChange={(e)=>setSubject(e.target.value)}
        />

        <input
          className="form-input"
          placeholder="Teacher"
          value={teacher}
          onChange={(e)=>setTeacher(e.target.value)}
        />

        <input
          className="form-input"
          type="number"
          placeholder="Classes Per Week"
          value={classes}
          onChange={(e)=>setClasses(e.target.value)}
          min="1"
          max="10"
        />

        <select
          className="form-input"
          value={subjectType}
          onChange={(e)=>setSubjectType(e.target.value)}
          style={{maxWidth: '150px'}}
        >
          <option value="theory">Theory</option>
          <option value="practical">Practical</option>
          <option value="extra">Extra</option>
        </select>

        <button className="add-subject-btn" onClick={addSubject}>
          + Add
        </button>
      </div>

      {subjects.length > 0 && (
        <div className="subjects-list">
          {subjects.map((sub, index) => (
            <div key={index} className="subject-item">
              <div className="subject-info">
                <div className="subject-name">{sub.name}</div>
                <div className="subject-details">
                  {sub.teacher} • {sub.classesPerWeek} classes/week • {sub.type}
                </div>
              </div>
              <button 
                className="delete-btn"
                onClick={() => removeSubject(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <hr/>

      <button className="generate-timetable-btn" onClick={handleGenerate}>
        Generate Timetable
      </button>

    </div>

  );

}

export default InputForm;

