import SequelizeTeam from '../database/models/SequelizeTeam';
import SequelizeMatch from '../database/models/SequelizeMatch';
import { IMatch } from '../Interfaces/IMatch';

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
}
