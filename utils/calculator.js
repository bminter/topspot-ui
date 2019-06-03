import { orderBy } from 'lodash';

export const getCurrentStreak = (userGameRecords) => {
  if (!userGameRecords.length) return '-';

  const orderedRecords = orderBy(userGameRecords, ['timeOfGame'], ['desc']);
  const lastGameOutcome = orderedRecords[0].record.gameOutcome;
  let count = 1;

  for (let i = 1; i < orderedRecords.length; i++) {
    if (orderedRecords[i].record.gameOutcome === lastGameOutcome) {
      count++;
    } else {
      break;
    }
  }
  return `${['', 'W', 'L'][lastGameOutcome]}${count}`;
};

export const getWinPercentage = (wins, losses) => {
  return losses === 0 ? Math.min(wins, 1) : wins / (wins + losses);
};
