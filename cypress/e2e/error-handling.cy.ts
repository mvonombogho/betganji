import { testUsers } from '../support/test-data';

describe('Error Handling', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.loginByApi(testUsers.regular.email, testUsers.regular.password);
  });

  describe('Match Data Loading', () => {
    it('handles match data loading errors', () => {
      // Intercept matches API with error
      cy.intercept('GET', '/api/matches*', {
        statusCode: 500,
        body: { message: 'Internal server error' },
      }).as('getMatchesError');

      cy.visit('/matches');

      // Verify error state
      cy.get('[data-testid="error-message"]')
        .should('exist')
        .and('contain', 'Error loading matches');

      // Verify retry button
      cy.get('[data-testid="retry-button"]').should('exist');

      // Test retry functionality
      cy.intercept('GET', '/api/matches*', {
        fixture: 'matches.json'
      }).as('getMatchesRetry');

      cy.get('[data-testid="retry-button"]').click();
      cy.wait('@getMatchesRetry');

      // Verify matches are loaded after retry
      cy.get('[data-testid="match-card"]').should('exist');
      cy.get('[data-testid="error-message"]').should('not.exist');
    });

    it('shows loading state while fetching matches', () => {
      // Intercept with delay
      cy.intercept('GET', '/api/matches*', (req) => {
        req.reply((res) => {
          res.delay(1000);
        });
      }).as('getMatchesDelayed');

      cy.visit('/matches');

      // Verify loading state
      cy.get('[data-testid="loading-skeleton"]').should('exist');
      cy.get('[data-testid="match-card"]').should('not.exist');

      // Wait for load to complete
      cy.wait('@getMatchesDelayed');
      cy.get('[data-testid="loading-skeleton"]').should('not.exist');
      cy.get('[data-testid="match-card"]').should('exist');
    });
  });
});
