import {
  consecutiveFree,
  slotOccupied,
  subjectToday,
} from '../utils/helpers';

export const validPlacement = (
  grid,
  teacherMatrix,
  task,
  day,
  period
)=>{

  if(task.duration===1){

    if(slotOccupied(grid,day,period))
      return false;

    if(!teacherMatrix.isFree(task.teacher,day,period))
      return false;

    if(subjectToday(grid,task.subject,day))
      return false;

  }

  if(task.duration===2){

    if(period>=6) return false;

    if(!consecutiveFree(grid,day,period))
      return false;

    if(!teacherMatrix.isFree(task.teacher,day,period))
      return false;

    if(!teacherMatrix.isFree(task.teacher,day,period+1))
      return false;

  }

  if(task.preferredDays && !task.preferredDays.includes(day))
    return false;

  return true;

};