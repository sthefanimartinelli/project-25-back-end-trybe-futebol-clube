import { ILeaderboard } from '../Interfaces/ILeaderboard';
import MatchModel from '../models/MatchModel';
import { IMatch } from '../Interfaces/IMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class MatchService {
  constructor(private matchModel = new MatchModel()) { }

  public async getAllMatches(): Promise<ServiceResponse<IMatch[]>> {
    const allMatches = await this.matchModel.findAll();
    return { status: 'successful', data: allMatches };
  }

  public async getMatchesInProgress(): Promise<ServiceResponse<IMatch[]>> {
    const matchesInProgress = await this.matchModel.getMatchesInProgress();
    return { status: 'successful', data: matchesInProgress };
  }

  public async getMatchesFinished(): Promise<ServiceResponse<IMatch[]>> {
    const matchesFinished = await this.matchModel.getMatchesFinished();
    return { status: 'successful', data: matchesFinished };
  }

  public async changeMatchStatus(id: number): Promise<ServiceResponse<string>> {
    await this.matchModel.changeMatchStatus(id);
    return { status: 'successful', data: '' };
  }

  public async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number):
  Promise<ServiceResponse<string>> {
    await this.matchModel.updateMatch(id, homeTeamGoals, awayTeamGoals);
    return { status: 'successful', data: '' };
  }

  public async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ):
    Promise<ServiceResponse<IMatch>> {
    const newMatch = await this.matchModel
      .createMatch(homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals);
    return { status: 'successful', data: newMatch };
  }

  public async getLeaderboard(): Promise<ServiceResponse<ILeaderboard[]>> {
    const leaderboard = await this.matchModel.getLeaderboard();
    return { status: 'successful', data: leaderboard };
  }

  public async getLeaderboardAway(): Promise<ServiceResponse<ILeaderboard[]>> {
    const leaderboard = await this.matchModel.getLeaderboardAway();
    return { status: 'successful', data: leaderboard };
  }
}
