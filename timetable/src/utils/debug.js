export const printGrid = (grid) => {

  console.table(
    grid.map(day =>
      day.map(cell =>
        cell ? cell.name : "-"
      )
    )
  );

};