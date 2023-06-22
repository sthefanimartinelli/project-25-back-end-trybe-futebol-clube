const loginWithoutEmail = {
  password: '123456',
};

const loginWithoutPassword = {
  email: 'sthefani@email.com',
};

const invalidEmail = {
  email: 'sthe',
  password: '123456',
};

const invalidPassword = {
  email: 'sthefani@email.com',
  password: 'xa',
};

const validLogin = {
  email: 'admin@admin.com',
  password: 'secret_admin',
};

const otherUser = {
  email: 'user@user.com',
  password: 'secret_admin',
};

const userFound = {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
};

export default {
  loginWithoutEmail,
  loginWithoutPassword, 
  invalidEmail,
  invalidPassword,
  validLogin,
  userFound,
  otherUser,
}