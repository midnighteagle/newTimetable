import Timetable from './Timetable';

function SemesterGroupView({ data }){

  if(!data) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📅</div>
        <h2>No Timetable Generated</h2>
        <p>Select a semester mode and click "Generate Timetable" to create your schedule</p>
      </div>
    );
  }

  return (
    <div className="semester-grid">
      {Object.keys(data).map(sem=>(
        <div key={sem} className="semester-card">
          <div className="semester-header">
            <h2>Semester {sem}</h2>
          </div>
          <Timetable grid={data[sem]} />
        </div>
      ))}
    </div>
  );

}

export default SemesterGroupView;

