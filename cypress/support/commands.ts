Cypress.Commands.add('login', () => {
  // Instead of UI login, we can set the auth cookie/token directly
  cy.window().then((window) => {
    window.localStorage.setItem('auth-token', 'test-token')
  })
})