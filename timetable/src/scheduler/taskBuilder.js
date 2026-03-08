export const buildTasks = (semesterData) => {

  const tasks = [];

  semesterData.practicalSubjects.forEach(s=>{
    for(let i=0;i<s.classesPerWeek;i++){

      tasks.push({
        type:"practical",
        subject:s.subjectCode,
        teacher:s.teacher,
        duration:2,
        priority:5
      });

    }
  });

  semesterData.internship.forEach(s=>{
    for(let i=0;i<s.classesPerWeek;i++){

      tasks.push({
        type:"internship",
        subject:s.subjectCode,
        teacher:s.teacher,
        duration:2,
        priority:4
      });

    }
  });

  semesterData.extraClasses.forEach(s=>{
    for(let i=0;i<s.classesPerWeek;i++){

      tasks.push({
        type:"extra",
        subject:s.name,
        teacher:s.teacher,
        duration:2,
        preferredDays:s.days,
        priority:3
      });

    }
  });

  semesterData.theorySubjects.forEach(s=>{
    for(let i=0;i<s.classesPerWeek;i++){

      tasks.push({
        type:"theory",
        subject:s.subjectCode,
        teacher:s.teacher,
        duration:1,
        priority:2
      });

    }
  });

  tasks.push({
    type:"mentor",
    subject:"Mentor",
    teacher:"Advisor",
    duration:1,
    priority:1
  });

  tasks.push({
    type:"library",
    subject:"Library",
    teacher:"Library",
    duration:1,
    priority:1
  });

  return tasks.sort((a,b)=>b.priority-a.priority);

};