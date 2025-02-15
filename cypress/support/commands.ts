// Custom command to login via UI
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command to login via API
Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/signin/credentials',
    body: {
      email,
      password,
      csrfToken: 'mock-csrf-token',
      json: true,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

// Custom command to select a match
Cypress.Commands.add('selectMatch', (homeTeam: string, awayTeam: string) => {
  cy.visit('/matches');
  cy.contains(homeTeam)
    .parents('[data-testid="match-card"]')
    .contains(awayTeam)
    .should('exist');
  cy.contains(homeTeam)
    .parents('[data-testid="match-card"]')
    .find('button')
    .contains(/predict|analyze/i)
    .click();
});

// Custom command to wait for prediction
Cypress.Commands.add('waitForPrediction', () => {
  cy.get('[data-testid="prediction-loading"]').should('exist');
  cy.get('[data-testid="prediction-loading"]', { timeout: 10000 }).should('not.exist');
  cy.get('[data-testid="prediction-card"]').should('exist');
});

// Prevent TypeScript errors for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginByApi(email: string, password: string): Chainable<void>;
      selectMatch(homeTeam: string, awayTeam: string): Chainable<void>;
      waitForPrediction(): Chainable<void>;
    }
  }
}
