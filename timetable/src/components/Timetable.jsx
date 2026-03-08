import {
  DAYS,
  PERIODS,
} from '../utils/constants';

function Timetable({ grid }){

  const getCellClass = (cell) => {
    if (!cell) return 'empty-cell';
    if (cell.type === 'practical') return 'subject-practical';
    if (cell.type === 'extra') return 'subject-extra';
    return 'subject-theory';
  };

  const formatCellContent = (cell) => {
    if (!cell) return '-';
    return (
      <div>
        <strong>{cell.subject}</strong>
        <br/>
        <small>{cell.teacher}</small>
      </div>
    );
  };

  return (

    <div className="timetable-wrapper">
      <table className="timetable">
        <thead>
          <tr>
            <th>Day</th>
            {[...Array(PERIODS)].map((_,i)=>
              <th key={i}>P{i+1}</th>
            )}
          </tr>
        </thead>

        <tbody>
          {DAYS.map((day,di)=>(

            <tr key={day}>
              <td className="day-cell">{day}</td>

              {grid[di].map((cell,i)=>(
                <td key={i} className={getCellClass(cell)}>
                  {formatCellContent(cell)}
                </td>
              ))}

            </tr>

          ))}
        </tbody>

      </table>
    </div>

  );

}

export default Timetable;

