import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeTeam from '../database/models/SequelizeTeam';
import TeamMock from './mocks/Team.Mock';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa os times', () => {
  it('Testa se ao fazer um get para a rota /teams ele retorna todos os times cadastrados', async () => {
    sinon.stub(SequelizeTeam, 'findAll').resolves(TeamMock.teams as any);
    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(TeamMock.teams);
  });
});
