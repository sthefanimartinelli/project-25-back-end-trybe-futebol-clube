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
}
