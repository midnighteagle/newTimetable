export const slotOccupied = (grid, day, period) => {
  return grid[day][period] !== null;
};

export const subjectToday = (grid, subject, day) => {

  return grid[day].some(
    (cell) => cell && cell.subject === subject
  );

};

export const consecutiveFree = (grid, day, period) => {

  return (
    grid[day][period] === null &&
    grid[day][period+1] === null
  );

};