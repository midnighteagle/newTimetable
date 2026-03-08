import { scheduleTasks } from './backtrackingScheduler';
import { buildTasks } from './taskBuilder';

export const generateSchedule = (semesterData) => {

  const tasks = buildTasks(semesterData);

  const schedule = scheduleTasks(tasks);

  return schedule;

};