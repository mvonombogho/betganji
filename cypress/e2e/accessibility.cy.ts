import { testUsers } from '../support/test-data';

describe('Accessibility', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.injectAxe(); // Inject axe-core for accessibility testing
  });

  describe('Public Pages', () => {
    it('has no detectable accessibility violations on home page', () => {
      cy.visit('/');
      cy.checkA11y();
    });

    it('has no detectable accessibility violations on login page', () => {
      cy.visit('/auth/login');
      cy.checkA11y();
    });

    it('has no detectable accessibility violations on registration page', () => {
      cy.visit('/auth/register');
      cy.checkA11y();
    });
  });

  describe('Authenticated Pages', () => {
    beforeEach(() => {
      cy.loginByApi(testUsers.regular.email, testUsers.regular.password);
    });

    it('has no detectable accessibility violations on dashboard', () => {
      cy.visit('/dashboard');
      cy.checkA11y();
    });

    it('has no detectable accessibility violations on matches page', () => {
      cy.visit('/matches');
      cy.checkA11y();
    });

    it('has no detectable accessibility violations on predictions page', () => {
      cy.visit('/predictions');
      cy.checkA11y();
    });
  });

  describe('Interactive Components', () => {
    beforeEach(() => {
      cy.loginByApi(testUsers.regular.email, testUsers.regular.password);
    });

    it('maintains accessibility during match filtering', () => {
      cy.visit('/matches');
      
      // Open filters
      cy.get('[data-testid="filter-button"]').click();
      cy.checkA11y();

      // Select competition
      cy.get('[data-testid="competition-filter"]').click();
      cy.checkA11y();

      // Open date picker
      cy.get('[data-testid="date-range-picker"]').click();
      cy.checkA11y();
    });

    it('maintains accessibility during prediction generation', () => {
      cy.visit('/matches');
      cy.get('[data-testid="match-card"]').first().click();

      // Check initial state
      cy.checkA11y();

      // Generate prediction
      cy.get('[data-testid="generate-prediction-button"]').click();

      // Check loading state
      cy.get('[data-testid="prediction-loading"]').should('exist');
      cy.checkA11y();

      // Check final state with prediction
      cy.get('[data-testid="prediction-card"]').should('exist');
      cy.checkA11y();
    });
  });

  describe('Error States', () => {
    it('maintains accessibility when showing validation errors', () => {
      cy.visit('/auth/login');
      
      // Submit empty form
      cy.get('button[type="submit"]').click();
      cy.checkA11y();
    });

    it('maintains accessibility when showing API errors', () => {
      cy.loginByApi(testUsers.regular.email, testUsers.regular.password);
      cy.visit('/matches');

      // Force API error
      cy.intercept('GET', '/api/matches*', {
        statusCode: 500,
        body: { message: 'Internal server error' },
      });

      cy.reload();
      cy.get('[data-testid="error-message"]').should('exist');
      cy.checkA11y();
    });
  });

  describe('Dynamic Content', () => {
    beforeEach(() => {
      cy.loginByApi(testUsers.regular.email, testUsers.regular.password);
    });

    it('maintains accessibility when sorting and filtering', () => {
      cy.visit('/matches');

      // Check initial state
      cy.checkA11y();

      // Apply filters
      cy.get('[data-testid="team-search"]').type('Manchester United');
      cy.checkA11y();

      // Change sort order
      cy.get('[data-testid="sort-select"]').select('date-desc');
      cy.checkA11y();
    });

    it('maintains accessibility during modal interactions', () => {
      cy.visit('/matches');

      // Open match details modal
      cy.get('[data-testid="match-card"]').first().click();
      cy.checkA11y();

      // Open filters modal
      cy.get('[data-testid="filter-button"]').click();
      cy.checkA11y();

      // Close modal using escape key
      cy.get('body').type('{esc}');
      cy.checkA11y();
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      cy.loginByApi(testUsers.regular.email, testUsers.regular.password);
    });

    const viewports = [
      { width: 375, height: 667, device: 'mobile' },
      { width: 768, height: 1024, device: 'tablet' },
      { width: 1280, height: 800, device: 'desktop' },
    ];

    viewports.forEach(({ width, height, device }) => {
      it(`maintains accessibility on ${device} viewport`, () => {
        cy.viewport(width, height);
        
        // Check critical pages
        cy.visit('/dashboard');
        cy.checkA11y();

        cy.visit('/matches');
        cy.checkA11y();

        cy.visit('/predictions');
        cy.checkA11y();
      });
    });
  });
});
