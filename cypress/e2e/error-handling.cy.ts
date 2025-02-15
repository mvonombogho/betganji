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

  describe('Prediction Generation', () => {
    beforeEach(() => {
      // Start from a match detail page
      cy.visit('/matches');
      cy.get('[data-testid="match-card"]').first().click();
    });

    it('handles prediction API errors', () => {
      // Intercept prediction API with error
      cy.intercept('POST', '/api/predictions/analyze', {
        statusCode: 500,
        body: { message: 'Prediction generation failed' },
      }).as('generatePredictionError');

      // Click generate prediction
      cy.get('[data-testid="generate-prediction-button"]').click();

      // Verify error state
      cy.get('[data-testid="error-message"]')
        .should('exist')
        .and('contain', 'Error generating prediction');

      // Verify retry functionality
      cy.intercept('POST', '/api/predictions/analyze', {
        fixture: 'prediction.json'
      }).as('generatePredictionRetry');

      cy.get('[data-testid="retry-button"]').click();
      cy.wait('@generatePredictionRetry');

      // Verify prediction is displayed
      cy.get('[data-testid="prediction-card"]').should('exist');
    });

    it('shows loading state during prediction generation', () => {
      // Intercept with delay
      cy.intercept('POST', '/api/predictions/analyze', (req) => {
        req.reply((res) => {
          res.delay(2000);
        });
      }).as('generatePredictionDelayed');

      // Click generate prediction
      cy.get('[data-testid="generate-prediction-button"]').click();

      // Verify loading state
      cy.get('[data-testid="prediction-loading"]').should('exist');
      cy.get('[data-testid="loading-spinner"]').should('exist');
      cy.get('[data-testid="generate-prediction-button"]').should('be.disabled');

      // Wait for generation to complete
      cy.wait('@generatePredictionDelayed');
      cy.get('[data-testid="prediction-loading"]').should('not.exist');
      cy.get('[data-testid="prediction-card"]').should('exist');
    });

    it('handles timeout errors gracefully', () => {
      // Intercept with timeout
      cy.intercept('POST', '/api/predictions/analyze', {
        forceNetworkError: true,
      }).as('generatePredictionTimeout');

      // Click generate prediction
      cy.get('[data-testid="generate-prediction-button"]').click();

      // Verify timeout error
      cy.get('[data-testid="error-message"]')
        .should('exist')
        .and('contain', 'Request timed out');

      // Verify retry button is available
      cy.get('[data-testid="retry-button"]').should('exist');
    });
  });
});
