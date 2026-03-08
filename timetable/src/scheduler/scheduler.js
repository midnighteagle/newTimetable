import { PERIODS } from '../utils/constants';
import { printGrid } from '../utils/debug';
import {
  placeClass,
  undoPlacement,
} from './placement';
import { buildTasks } from './taskBuilder';
import { isValidPlacement } from './validator';

export const generateSchedule = (semesterData) => {

  const tasks = buildTasks(semesterData);

  const DAYS = 5;

  const grid =
    Array.from({ length: DAYS },
      () => Array(PERIODS).fill(null)
    );

  const subjectsPerDay =
    Array.from({ length: DAYS }, () => new Set());

  const globalTeacherSchedule =
    Array.from({ length: DAYS }, () => ({}));

  const teacherDailyCount = {};

  let attempts = 0;
  const MAX_ATTEMPTS = 50000;

  const scheduleClasses = (index) => {

    if (attempts++ > MAX_ATTEMPTS)
      return false;

    if (index === tasks.length)
      return true;

    const cls = tasks[index];

    for (let d = 0; d < DAYS; d++) {

      for (let p = 0; p < PERIODS; p++) {

        if (!isValidPlacement(
          d,
          p,
          cls,
          grid,
          subjectsPerDay,
          globalTeacherSchedule,
          teacherDailyCount
        )) continue;

        placeClass(
          d,
          p,
          cls,
          grid,
          subjectsPerDay,
          globalTeacherSchedule,
          teacherDailyCount
        );

        if (scheduleClasses(index + 1))
          return true;

        undoPlacement(
          d,
          p,
          cls,
          grid,
          subjectsPerDay,
          globalTeacherSchedule,
          teacherDailyCount
        );

      }

    }

    return false;

  };

  const success = scheduleClasses(0);

  if (success) printGrid(grid);

  return success ? grid : null;

};