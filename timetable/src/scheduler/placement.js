export const placeTask = (
  grid,
  teacherMatrix,
  task,
  day,
  period
)=>{

  for(let i=0;i<task.duration;i++){

    grid[day][period+i] = {
      subject:task.subject,
      teacher:task.teacher
    };

    teacherMatrix.occupy(task.teacher,day,period+i);

  }

};

export const removeTask = (
  grid,
  teacherMatrix,
  task,
  day,
  period
)=>{

  for(let i=0;i<task.duration;i++){

    grid[day][period+i] = null;

    teacherMatrix.release(task.teacher,day,period+i);

  }

};