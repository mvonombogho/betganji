import { testUsers } from '../support/test-data';

describe('Form Validation', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.loginByApi(testUsers.regular.email, testUsers.regular.password);
  });

  describe('Login Form Validation', () => {
    beforeEach(() => {
      cy.visit('/auth/login');
    });

    it('validates required fields', () => {
      // Try to submit empty form
      cy.get('button[type="submit"]').click();

      // Check for error messages
      cy.get('[data-testid="email-error"]')
        .should('exist')
        .and('contain', 'Email is required');
      cy.get('[data-testid="password-error"]')
        .should('exist')
        .and('contain', 'Password is required');
    });

    it('validates email format', () => {
      // Enter invalid email
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Check for error message
      cy.get('[data-testid="email-error"]')
        .should('exist')
        .and('contain', 'Invalid email format');
    });

    it('validates minimum password length', () => {
      // Enter short password
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('short');
      cy.get('button[type="submit"]').click();

      // Check for error message
      cy.get('[data-testid="password-error"]')
        .should('exist')
        .and('contain', 'Password must be at least 8 characters');
    });
  });

  describe('Prediction Form Validation', () => {
    beforeEach(() => {
      cy.visit('/matches');
      cy.get('[data-testid="match-card"]').first().click();
    });

    it('validates required filter selections', () => {
      // Try to generate prediction without required filters
      cy.get('[data-testid="clear-filters"]').click(); // Clear any default filters
      cy.get('[data-testid="generate-prediction-button"]').click();

      // Check for error messages
      cy.get('[data-testid="filter-error"]')
        .should('exist')
        .and('contain', 'Please select at least one filter');
    });

    it('validates date range selection', () => {
      // Select invalid date range
      cy.get('[data-testid="date-range-start"]').type('2025-03-01');
      cy.get('[data-testid="date-range-end"]').type('2025-02-01');

      // Check for error message
      cy.get('[data-testid="date-error"]')
        .should('exist')
        .and('contain', 'End date must be after start date');
    });

    it('validates confidence threshold', () => {
      // Enter invalid confidence threshold
      cy.get('[data-testid="confidence-threshold"]').type('150');

      // Check for error message
      cy.get('[data-testid="confidence-error"]')
        .should('exist')
        .and('contain', 'Confidence must be between 0 and 100');
    });
  });

  describe('Form State Management', () => {
    it('preserves form state after validation errors', () => {
      cy.visit('/auth/login');

      // Fill form with invalid data
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('short');
      cy.get('button[type="submit"]').click();

      // Check that form values are preserved
      cy.get('input[name="email"]').should('have.value', 'invalid-email');
      cy.get('input[name="password"]').should('have.value', 'short');
    });

    it('clears validation errors on input change', () => {
      cy.visit('/auth/login');

      // Trigger validation errors
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="email-error"]').should('exist');

      // Type in field and check that error clears
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('[data-testid="email-error"]').should('not.exist');
    });

    it('handles multiple validation errors', () => {
      cy.visit('/matches');
      cy.get('[data-testid="match-card"]').first().click();

      // Trigger multiple validation errors
      cy.get('[data-testid="confidence-threshold"]').type('150');
      cy.get('[data-testid="date-range-start"]').type('2025-03-01');
      cy.get('[data-testid="date-range-end"]').type('2025-02-01');
      cy.get('[data-testid="generate-prediction-button"]').click();

      // Check that all error messages are displayed
      cy.get('[data-testid="validation-error"]').should('have.length.at.least', 2);
    });
  });
});
