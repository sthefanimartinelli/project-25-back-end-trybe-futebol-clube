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
}
