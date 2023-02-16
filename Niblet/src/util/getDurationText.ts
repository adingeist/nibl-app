export const getDurationText = (minuteDuration: number) => {
  const hours = Math.floor(minuteDuration / 60);
  const minutes = minuteDuration % 60;

  if (hours && minutes) {
    return `${hours} hr ${minutes} min`;
  } else if (hours) {
    return `${hours} hr`;
  } else {
    return `${minutes} min`;
  }
};
