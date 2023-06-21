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
    const newArr = allTeams.map((team) => ({ name: team.teamName,
      totalPoints: MatchModel.getTotalPoints(team.id, finishedMatches, 'home'),
      totalGames: MatchModel.getTotalGames(team.id, finishedMatches, 'home'),
      totalVictories: MatchModel.getTotalVictories(team.id, finishedMatches, 'home'),
      totalDraws: MatchModel.getTotalDraws(team.id, finishedMatches, 'home'),
      totalLosses: MatchModel.getTotalLosses(team.id, finishedMatches, 'home'),
      goalsFavor: MatchModel.getGoalsInFavor(team.id, finishedMatches, 'home'),
      goalsOwn: MatchModel.getGoalsOwn(team.id, finishedMatches, 'home'),
      goalsBalance: MatchModel.getGoalsBalance(team.id, finishedMatches, 'home'),
      efficiency: MatchModel.getEfficiency(team.id, finishedMatches, 'home') }));
    const sortedArr = sortedArray(newArr);
    return sortedArr;
  }

  async getLeaderboardAway(): Promise<ILeaderboard[]> {
    const allMatches = await this.findAll();
    const finishedMatches = allMatches.filter((match) => match.inProgress === false);
    const allTeams = await SequelizeTeam.findAll();
    const newArr = allTeams.map((team) => (
      { name: team.teamName,
        totalPoints: MatchModel.getTotalPointsAway(team.id, finishedMatches, 'away'),
        totalGames: MatchModel.getTotalGames(team.id, finishedMatches, 'away'),
        totalVictories: MatchModel.getTotalLosses(team.id, finishedMatches, 'away'),
        totalDraws: MatchModel.getTotalDraws(team.id, finishedMatches, 'away'),
        totalLosses: MatchModel.getTotalVictories(team.id, finishedMatches, 'away'),
        goalsFavor: MatchModel.getGoalsOwn(team.id, finishedMatches, 'away'),
        goalsOwn: MatchModel.getGoalsInFavor(team.id, finishedMatches, 'away'),
        goalsBalance: MatchModel.getGoalsBalance(team.id, finishedMatches, 'away') * -1,
        efficiency: MatchModel.getEfficiencyAway(team.id, finishedMatches, 'away'),
      }
    ));
    const sortedArr = sortedArray(newArr);
    return sortedArr;
  }

  static getFilteredMatches(teamId: number, finishedMatches: IMatch[], teamType: string): IMatch[] {
    if (teamType === 'home') {
      const filteredMatches = finishedMatches.filter((match: IMatch) => match
        .homeTeamId === teamId);
      return filteredMatches;
    } const filteredMatches = finishedMatches.filter((match: IMatch) => match
      .awayTeamId === teamId);
    return filteredMatches;
  }

  static getTotalPoints(teamId: number, finishedMatches: IMatch[], teamType: string): number {
    const homeTeamMatches = MatchModel.getFilteredMatches(teamId, finishedMatches, teamType);
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

  static getTotalPointsAway(teamId: number, finishedMatches: IMatch[], teamType: string): number {
    const homeTeamMatches = MatchModel.getFilteredMatches(teamId, finishedMatches, teamType);
    let totalPoints = 0;
    homeTeamMatches.forEach((match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        totalPoints += 3;
      } else if (match.homeTeamGoals > match.awayTeamGoals) {
        totalPoints += 0;
      } else {
        totalPoints += 1;
      }
    });
    return totalPoints;
  }

  static getTotalGames(teamId: number, finishedMatches: IMatch[], teamType: string): number {
    const totalGames = MatchModel.getFilteredMatches(teamId, finishedMatches, teamType).length;
    return totalGames;
  }

  static getTotalVictories(teamId: number, finishedMatches: IMatch[], teamType: string): number {
    const totalVictories = MatchModel.getFilteredMatches(teamId, finishedMatches, teamType)
      .filter((match: IMatch) => match.homeTeamGoals > match.awayTeamGoals).length;
    return totalVictories;
  }

  static getTotalDraws(teamId: number, finishedMatches: IMatch[], teamType: string): number {
    const totalDraws = MatchModel.getFilteredMatches(teamId, finishedMatches, teamType)
      .filter((match: IMatch) => match.homeTeamGoals === match.awayTeamGoals).length;
    return totalDraws;
  }

  static getTotalLosses(teamId: number, finishedMatches: IMatch[], teamType: string): number {
    const totalLosses = MatchModel.getFilteredMatches(teamId, finishedMatches, teamType)
      .filter((match: IMatch) => match.homeTeamGoals < match.awayTeamGoals).length;
    return totalLosses;
  }

  static getGoalsInFavor(teamId: number, finishedMatches: IMatch[], teamType: string): number {
    const filteredMatches = MatchModel.getFilteredMatches(teamId, finishedMatches, teamType);
    const goalsInFavor = filteredMatches.reduce((acc, curr) => acc + curr.homeTeamGoals, 0);
    return goalsInFavor;
  }

  static getGoalsOwn(teamId: number, finishedMatches: IMatch[], teamType: string): number {
    const filteredMatches = MatchModel.getFilteredMatches(teamId, finishedMatches, teamType);
    const goalsOwn = filteredMatches.reduce((acc, curr) => acc + curr.awayTeamGoals, 0);
    return goalsOwn;
  }

  static getGoalsBalance(teamId: number, finishedMatches: IMatch[], teamType: string): number {
    const filteredMatches = MatchModel.getFilteredMatches(teamId, finishedMatches, teamType);
    const goalsInFavor = filteredMatches.reduce((acc, curr) => acc + curr.homeTeamGoals, 0);
    const goalsOwn = filteredMatches.reduce((acc, curr) => acc + curr.awayTeamGoals, 0);
    return goalsInFavor - goalsOwn;
  }

  static getEfficiency(teamId: number, finishedMatches: IMatch[], teamType: string): string {
    const games = MatchModel.getTotalGames(teamId, finishedMatches, teamType);
    const points = MatchModel.getTotalPoints(teamId, finishedMatches, teamType);
    const result = (points / (games * 3)) * 100;
    return result.toFixed(2);
  }

  static getEfficiencyAway(teamId: number, finishedMatches: IMatch[], teamType: string): string {
    const games = MatchModel.getTotalGames(teamId, finishedMatches, teamType);
    const points = MatchModel.getTotalPointsAway(teamId, finishedMatches, teamType);
    const result = (points / (games * 3)) * 100;
    return result.toFixed(2);
  }
}
