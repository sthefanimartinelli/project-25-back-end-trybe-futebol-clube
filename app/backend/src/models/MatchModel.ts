import SequelizeTeam from '../database/models/SequelizeTeam';
import SequelizeMatch from '../database/models/SequelizeMatch';
import { IMatch } from '../Interfaces/IMatch';
import { ILeaderboard } from '../Interfaces/ILeaderboard';
import sortedArray from '../utils/sortArray';

export default class MatchModel {
  private model = SequelizeMatch;

  async findAll(): Promise<IMatch[]> {
    const dbData = await this.model.findAll({ include: [
      { model: SequelizeTeam,
        as: 'homeTeam',
        attributes: ['teamName'],
      },
      { model: SequelizeTeam,
        as: 'awayTeam',
        attributes: ['teamName'],
      },
    ],
    });
    return dbData;
  }

  async getMatchesInProgress(): Promise<IMatch[]> {
    const dbData = await this.model.findAll({ include: [
      { model: SequelizeTeam,
        as: 'homeTeam',
        attributes: ['teamName'],
      },
      { model: SequelizeTeam,
        as: 'awayTeam',
        attributes: ['teamName'],
      },
    ],
    where: { inProgress: true },
    });
    return dbData;
  }

  async getMatchesFinished(): Promise<IMatch[]> {
    const dbData = await this.model.findAll({ include: [
      { model: SequelizeTeam,
        as: 'homeTeam',
        attributes: ['teamName'],
      },
      { model: SequelizeTeam,
        as: 'awayTeam',
        attributes: ['teamName'],
      },
    ],
    where: { inProgress: false },
    });
    return dbData;
  }

  async changeMatchStatus(id: number) {
    await this.model.update({ inProgress: false }, { where: { id } });
  }

  async updateMatch(id: number, newHomeGoals: number, newAwayGoals: number) {
    await this.model.update(
      { homeTeamGoals: newHomeGoals, awayTeamGoals: newAwayGoals },
      { where: { id } },
    );
  }

  async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<IMatch> {
    const matchInfo = { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress: true };
    const dbData = await this.model.create(matchInfo);
    return dbData;
  }

  async getLeaderboard(): Promise<ILeaderboard[]> {
    const allMatches = await this.findAll();
    const finishedMatches = allMatches.filter((match) => match.inProgress === false);
    const allTeams = await SequelizeTeam.findAll();
    const newArr = allTeams.map((team) => (
      { name: team.teamName,
        totalPoints: MatchModel.getTotalPoints(team.id, finishedMatches),
        totalGames: MatchModel.getTotalGames(team.id, finishedMatches),
        totalVictories: MatchModel.getTotalVictories(team.id, finishedMatches),
        totalDraws: MatchModel.getTotalDraws(team.id, finishedMatches),
        totalLosses: MatchModel.getTotalLosses(team.id, finishedMatches),
        goalsFavor: MatchModel.getGoalsInFavor(team.id, finishedMatches),
        goalsOwn: MatchModel.getGoalsOwn(team.id, finishedMatches),
        goalsBalance: MatchModel.getGoalsBalance(team.id, finishedMatches),
        efficiency: MatchModel.getEfficiency(team.id, finishedMatches),
      }
    ));

    const sortedArr = sortedArray(newArr);
    return sortedArr;
  }

  static getFilteredMatches(teamId: number, finishedMatches: IMatch[]): IMatch[] {
    const filteredMatches = finishedMatches.filter((match: IMatch) => match
      .homeTeamId === teamId);
    return filteredMatches;
  }

  static getTotalPoints(teamId: number, finishedMatches: IMatch[]): number {
    const homeTeamMatches = MatchModel.getFilteredMatches(teamId, finishedMatches);
    let totalPoints = 0;
    homeTeamMatches.forEach((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        totalPoints += 3;
      } else if (match.homeTeamGoals < match.awayTeamGoals) {
        totalPoints += 0;
      } else {
        totalPoints += 1;
      }
    });
    return totalPoints;
  }

  static getTotalGames(teamId: number, finishedMatches: IMatch[]): number {
    const totalGames = MatchModel.getFilteredMatches(teamId, finishedMatches).length;
    return totalGames;
  }

  static getTotalVictories(teamId: number, finishedMatches: IMatch[]): number {
    const totalVictories = MatchModel.getFilteredMatches(teamId, finishedMatches)
      .filter((match: IMatch) => match.homeTeamGoals > match.awayTeamGoals).length;
    return totalVictories;
  }

  static getTotalDraws(teamId: number, finishedMatches: IMatch[]): number {
    const totalDraws = MatchModel.getFilteredMatches(teamId, finishedMatches)
      .filter((match: IMatch) => match.homeTeamGoals === match.awayTeamGoals).length;
    return totalDraws;
  }

  static getTotalLosses(teamId: number, finishedMatches: IMatch[]): number {
    const totalLosses = MatchModel.getFilteredMatches(teamId, finishedMatches)
      .filter((match: IMatch) => match.homeTeamGoals < match.awayTeamGoals).length;
    return totalLosses;
  }

  static getGoalsInFavor(teamId: number, finishedMatches: IMatch[]): number {
    const filteredMatches = MatchModel.getFilteredMatches(teamId, finishedMatches);
    const goalsInFavor = filteredMatches.reduce((acc, curr) => acc + curr.homeTeamGoals, 0);
    return goalsInFavor;
  }

  static getGoalsOwn(teamId: number, finishedMatches: IMatch[]): number {
    const filteredMatches = MatchModel.getFilteredMatches(teamId, finishedMatches);
    const goalsOwn = filteredMatches.reduce((acc, curr) => acc + curr.awayTeamGoals, 0);
    return goalsOwn;
  }

  static getGoalsBalance(teamId: number, finishedMatches: IMatch[]): number {
    const filteredMatches = MatchModel.getFilteredMatches(teamId, finishedMatches);
    const goalsInFavor = filteredMatches.reduce((acc, curr) => acc + curr.homeTeamGoals, 0);
    const goalsOwn = filteredMatches.reduce((acc, curr) => acc + curr.awayTeamGoals, 0);
    return goalsInFavor - goalsOwn;
  }

  static getEfficiency(teamId: number, finishedMatches: IMatch[]): string {
    const games = MatchModel.getTotalGames(teamId, finishedMatches);
    const points = MatchModel.getTotalPoints(teamId, finishedMatches);
    const result = (points / (games * 3)) * 100;
    return result.toFixed(2);
  }
}
