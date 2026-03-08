import {
  DAYS,
  PERIODS,
} from '../utils/constants';
import {
  placeTask,
  removeTask,
} from './placement';
import { validPlacement } from './validator';

export const scheduleSemester = (
  grid,
  teacherMatrix,
  tasks,
  index=0
)=>{

  if(index===tasks.length)
    return true;

  const task = tasks[index];

  for(let d=0; d<DAYS.length; d++){

    for(let p=0; p<PERIODS; p++){

      if(!validPlacement(grid,teacherMatrix,task,d,p))
        continue;

      placeTask(grid,teacherMatrix,task,d,p);

      if(scheduleSemester(grid,teacherMatrix,tasks,index+1))
        return true;

      removeTask(grid,teacherMatrix,task,d,p);

    }

  }

  return false;

};