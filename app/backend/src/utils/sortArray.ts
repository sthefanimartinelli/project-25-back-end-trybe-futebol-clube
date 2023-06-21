import { ILeaderboard } from '../Interfaces/ILeaderboard';

export default function sortedArray(newArr: ILeaderboard[]) {
  const sortedArr = newArr.sort((a: ILeaderboard, b: ILeaderboard) => {
    if (a.totalPoints > b.totalPoints) { return -1; }
    if (a.totalPoints < b.totalPoints) { return 1; }
    if (a.totalVictories > b.totalVictories) { return -1; }
    if (a.totalVictories < b.totalVictories) { return 1; }
    if (a.goalsBalance > b.goalsBalance) { return -1; }
    if (a.goalsBalance < b.goalsBalance) { return 1; }
    if (a.goalsFavor > b.goalsFavor) { return -1; }
    if (a.goalsFavor < b.goalsFavor) { return 1; }
    return 0;
  });
  return sortedArr;
}
