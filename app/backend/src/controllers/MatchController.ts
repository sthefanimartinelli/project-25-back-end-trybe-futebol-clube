import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
import TeamService from '../services/TeamService';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
    private teamService = new TeamService(),
  ) { }

  public async getAllMatches(_req: Request, res: Response) {
    const serviceResponse = await this.matchService.getAllMatches();
    res.status(200).json(serviceResponse.data);
  }

  public async getMatchesInProgress(_req: Request, res: Response) {
    const serviceResponse = await this.matchService.getMatchesInProgress();
    res.status(200).json(serviceResponse.data);
  }

  public async getMatchesFinished(_req: Request, res: Response) {
    const serviceResponse = await this.matchService.getMatchesFinished();
    res.status(200).json(serviceResponse.data);
  }

  public async changeMatchStatus(req: Request, res: Response) {
    const { id } = req.params;
    await this.matchService.changeMatchStatus(Number(id));
    res.status(200).json({ message: 'Finished' });
  }

  public async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    await this.matchService.updateMatch(Number(id), homeTeamGoals, awayTeamGoals);
    res.status(200).json({ message: 'Match updated' });
  }

  public async createMatch(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    if (homeTeamId === awayTeamId) {
      res.status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

    const homeTeamExists = await this.teamService.getTeamById(homeTeamId);
    const awayTeamExists = await this.teamService.getTeamById(awayTeamId);

    if (homeTeamExists.status === 'notFound' || awayTeamExists.status === 'notFound') {
      res.status(404).json({ message: 'There is no team with such id!' });
    }
    const serviceResponse = await this.matchService
      .createMatch(homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals);
    res.status(201).json(serviceResponse.data);
  }

  public async getLeaderboard(_req: Request, res: Response) {
    const serviceResponse = await this.matchService.getLeaderboard();
    res.status(200).json(serviceResponse.data);
  }
}
