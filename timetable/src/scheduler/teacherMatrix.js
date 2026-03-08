export const createTeacherMatrix = () => {

  const matrix = {};

  return {

    isFree(teacher, day, period){

      if(!matrix[teacher])
        matrix[teacher] = {};

      return !matrix[teacher][`${day}-${period}`];

    },

    occupy(teacher, day, period){

      if(!matrix[teacher])
        matrix[teacher] = {};

      matrix[teacher][`${day}-${period}`] = true;

    },

    release(teacher, day, period){

      delete matrix[teacher][`${day}-${period}`];

    }

  };

};