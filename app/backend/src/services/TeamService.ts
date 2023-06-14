import TeamModel from '../models/TeamModel';
import { ITeamModel } from '../Interfaces/ITeamModel';
import { ITeam } from '../Interfaces/ITeam';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class TeamService {
  constructor(private teamModel: ITeamModel = new TeamModel()) { }

  public async getAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    const allTeams = await this.teamModel.findAll();
    return { status: 'successful', data: allTeams };
  }

  public async getTeamById(id: number): Promise<ServiceResponse<ITeam>> {
    const team = await this.teamModel.findById(id);
    if (!team) return { status: 'notFound', data: { message: `Team ${id} not found` } };
    return { status: 'successful', data: team };
  }
}
