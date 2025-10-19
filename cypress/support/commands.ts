Cypress.Commands.add('loginAsClient', () => {
  // Apenas mocka o login
  window.localStorage.setItem('auth_token', 'FAKE_JWT_TOKEN');
});
