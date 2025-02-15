import { testUsers } from '../support/test-data';

describe('Rate Limiting', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.loginByApi(testUsers.regular.email, testUsers.regular.password);
  });

  describe('API Rate Limits', () => {
    it('handles prediction rate limiting', () => {
      // Visit matches page
      cy.visit('/matches');
      cy.get('[data-testid="match-card"]').first().click();

      // Mock rate limit response
      cy.intercept('POST', '/api/predictions/analyze', {
        statusCode: 429,
        body: {
          message: 'Too many requests',
          retryAfter: 60
        }
      }).as('rateLimitedRequest');

      // Attempt to generate prediction
      cy.get('[data-testid="generate-prediction-button"]').click();

      // Verify rate limit message
      cy.get('[data-testid="rate-limit-message"]')
        .should('exist')
        .and('contain', 'Please wait before trying again');

      // Verify retry timer
      cy.get('[data-testid="retry-timer"]')
        .should('exist')
        .and('contain', '60');

      // Verify button is disabled
      cy.get('[data-testid="generate-prediction-button"]')
        .should('be.disabled');

      // Mock successful response after timeout
      cy.intercept('POST', '/api/predictions/analyze', {
        fixture: 'prediction.json'
      }).as('successfulRequest');

      // Fast-forward time
      cy.clock();
      cy.tick(61000);

      // Verify button is enabled
      cy.get('[data-testid="generate-prediction-button"]')
        .should('not.be.disabled');
    });

    it('handles concurrent request throttling', () => {
      cy.visit('/matches');

      // Mock throttled response
      let requestCount = 0;
      cy.intercept('GET', '/api/matches*', (req) => {
        requestCount++;
        if (requestCount > 3) {
          req.reply({
            statusCode: 429,
            body: {
              message: 'Too many concurrent requests',
              retryAfter: 5
            }
          });
        }
      }).as('throttledRequest');

      // Make multiple rapid requests
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="refresh-button"]').click();
      }

      // Verify throttling message
      cy.get('[data-testid="throttle-message"]')
        .should('exist')
        .and('contain', 'Too many requests');

      // Verify automatic retry after delay
      cy.clock();
      cy.tick(6000);

      cy.get('[data-testid="throttle-message"]').should('not.exist');
    });

    it('shows remaining rate limit quota', () => {
      cy.visit('/matches');

      // Mock response with rate limit headers
      cy.intercept('GET', '/api/matches*', {
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '95',
          'X-RateLimit-Reset': '3600'
        }
      }).as('quotaRequest');

      // Verify quota display
      cy.get('[data-testid="rate-limit-quota"]')
        .should('exist')
        .and('contain', '95/100');
    });

    it('handles different rate limits for premium users', () => {
      // Login as premium user
      cy.loginByApi(testUsers.premium.email, testUsers.premium.password);
      cy.visit('/matches');

      // Mock response with higher rate limit
      cy.intercept('GET', '/api/matches*', {
        headers: {
          'X-RateLimit-Limit': '1000',
          'X-RateLimit-Remaining': '950',
          'X-RateLimit-Reset': '3600'
        }
      }).as('premiumQuotaRequest');

      // Verify higher quota for premium user
      cy.get('[data-testid="rate-limit-quota"]')
        .should('exist')
        .and('contain', '950/1000');
    });
  });

  describe('Graceful Degradation', () => {
    it('shows cached data when rate limited', () => {
      cy.visit('/matches');

      // Load initial data
      cy.get('[data-testid="match-card"]').should('exist');

      // Mock rate limit on refresh
      cy.intercept('GET', '/api/matches*', {
        statusCode: 429,
        body: {
          message: 'Too many requests',
          retryAfter: 60
        }
      }).as('rateLimitedRefresh');

      // Attempt refresh
      cy.get('[data-testid="refresh-button"]').click();

      // Verify cached data is still shown
      cy.get('[data-testid="match-card"]').should('exist');
      cy.get('[data-testid="cached-data-notice"]')
        .should('exist')
        .and('contain', 'Showing cached data');
    });
  });
});
