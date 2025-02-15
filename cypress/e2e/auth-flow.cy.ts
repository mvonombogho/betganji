import { testUsers } from '../support/test-data';

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.task('db:seed');
  });

  describe('Login', () => {
    it('allows users to login with valid credentials', () => {
      const user = testUsers.regular;
      
      cy.visit('/auth/login');
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-menu"]').should('contain', user.name);
    });

    it('shows error message with invalid credentials', () => {
      cy.visit('/auth/login');
      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.get('[data-testid="error-message"]')
        .should('exist')
        .and('contain', 'Invalid email or password');
      
      // Should not redirect
      cy.url().should('include', '/auth/login');
    });

    it('maintains login state after page refresh', () => {
      const user = testUsers.regular;
      
      cy.loginByApi(user.email, user.password);
      cy.visit('/dashboard');
      
      // Verify logged in state
      cy.get('[data-testid="user-menu"]').should('contain', user.name);
      
      // Refresh page
      cy.reload();
      
      // Should still be logged in
      cy.get('[data-testid="user-menu"]').should('contain', user.name);
    });
  });

  describe('Registration', () => {
    it('allows new users to register', () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };

      cy.visit('/auth/register');
      cy.get('input[name="name"]').type(newUser.name);
      cy.get('input[name="email"]').type(newUser.email);
      cy.get('input[name="password"]').type(newUser.password);
      cy.get('input[name="confirmPassword"]').type(newUser.password);
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-menu"]').should('contain', newUser.name);
    });

    it('validates password confirmation', () => {
      cy.visit('/auth/register');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('different');
      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.get('[data-testid="error-message"]')
        .should('exist')
        .and('contain', 'Passwords do not match');
    });

    it('prevents registration with existing email', () => {
      const existingUser = testUsers.regular;

      cy.visit('/auth/register');
      cy.get('input[name="name"]').type('Another Name');
      cy.get('input[name="email"]').type(existingUser.email);
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.get('[data-testid="error-message"]')
        .should('exist')
        .and('contain', 'User already exists');
    });
  });

  describe('Logout', () => {
    it('allows users to logout', () => {
      const user = testUsers.regular;
      
      cy.loginByApi(user.email, user.password);
      cy.visit('/dashboard');
      
      // Click logout button in user menu
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();

      // Should redirect to login page
      cy.url().should('include', '/auth/login');
      
      // Should not be able to access protected routes
      cy.visit('/dashboard');
      cy.url().should('include', '/auth/login');
    });
  });
});
