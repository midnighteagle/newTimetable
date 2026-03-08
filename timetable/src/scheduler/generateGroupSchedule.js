import {
  DAYS,
  EVEN_SEMESTERS,
  ODD_SEMESTERS,
  PERIODS,
} from '../utils/constants';
import { scheduleSemester } from './backtrackingScheduler';
import { buildTasks } from './taskBuilder';
import { createTeacherMatrix } from './teacherMatrix';

export const generateGroupSchedule = (
  semesterMode,
  semesterInputs
)=>{

  const semesters =
    semesterMode==="Odd"
      ? ODD_SEMESTERS
      : EVEN_SEMESTERS;

  const teacherMatrix = createTeacherMatrix();

  const results = {};

  for(const sem of semesters){

    const grid = Array.from(
      {length:DAYS.length},
      ()=>Array(PERIODS).fill(null)
    );

    const tasks = buildTasks(semesterInputs[sem]);

    const success = scheduleSemester(
      grid,
      teacherMatrix,
      tasks
    );

    if(!success)
      return null;

    results[sem] = grid;

  }

  return results;

};