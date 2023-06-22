import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import LoginValidations from '../middlewares/LoginValidations';
const { validateEmail, validatePassword, validateLogin } = LoginValidations;
// import SequelizeUser from '../database/models/SequelizeUser';
import UserMock from './mocks/User.mock';

import { Response } from 'superagent';
import SequelizeUser from '../database/models/SequelizeUser';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa o login', () => {
  it('Deve retornar erro ao tentar logar sem email', async () => {
    const { status, body } = await chai.request(app).post('/login')
      .send(UserMock.loginWithoutEmail);

    expect(status).to.equal(400);
    expect(body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('Deve retornar erro ao tentar logar sem senha', async () => {
    const { status, body } = await chai.request(app).post('/login')
      .send(UserMock.loginWithoutPassword);

    expect(status).to.equal(400);
    expect(body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('Deve retornar erro ao tentar logar com email inválido', async () => {
    const { status, body } = await chai.request(app).post('/login')
      .send(UserMock.invalidEmail);

    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('Deve retornar erro ao tentar logar com senha inválida', async () => {
    const { status, body } = await chai.request(app).post('/login')
      .send(UserMock.invalidPassword);

    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  // it('Deve retornar erro ao informar dados de usuário e senha inválidos', async () => {
  //   sinon.stub(SequelizeUser, 'findOne').resolves(UserMock.userFound as any);
  //   const { status, body } = await chai.request(app).post('/login')
  //     .send(UserMock.otherUser);

  //   expect(status).to.equal(401);
  // });

  it('Deve fazer login ao informar dados válidos', async () => {
    sinon.stub(SequelizeUser, 'findOne').resolves(UserMock.userFound as any);
    const { status, body } = await chai.request(app).post('/login')
      .send(UserMock.validLogin);

    expect(status).to.equal(200);
  });

  afterEach(sinon.restore);
});
