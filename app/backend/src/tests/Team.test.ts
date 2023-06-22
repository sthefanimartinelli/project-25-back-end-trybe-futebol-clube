import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeTeam from '../database/models/SequelizeTeam';
import TeamMock from './mocks/Team.mock';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa os times', () => {
  it('Deve retornar todos os times cadastrados', async () => {
    sinon.stub(SequelizeTeam, 'findAll').resolves(TeamMock.teams as any);
    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(TeamMock.teams);
  });

  it('Deve retornar um time pelo id', async () => {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(TeamMock.team as any);
    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(TeamMock.team);
  });

  it('Deve retornar erro ao buscar time com id inexistente', async () => {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(null);
    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(404);
    expect(body).to.deep.equal({ message: 'Team 1 not found'});
  });

  afterEach(sinon.restore);
});
