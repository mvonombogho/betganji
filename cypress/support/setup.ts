import { testUsers } from './test-data';

// Initialize test database with required data
export const initializeTestData = () => {
  beforeEach(() => {
    cy.task('db:seed');
  });

  afterEach(() => {
    cy.task('db:clear');
  });
};

// Configure common interceptions
export const setupApiInterceptions = () => {
  beforeEach(() => {
    // Match data interception
    cy.fixture('matches.json').then((matchesData) => {
      cy.intercept('GET', '/api/matches*', {
        body: matchesData,
      }).as('getMatches');
    });

    // Prediction data interception
    cy.fixture('prediction.json').then((predictionData) => {
      cy.intercept('POST', '/api/predictions/analyze', {
        body: predictionData,
      }).as('generatePrediction');
    });

    // Auth endpoints interception
    cy.intercept('POST', '/api/auth/signin', (req) => {
      const { email, password } = req.body;
      const user = Object.values(testUsers).find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        req.reply({
          statusCode: 200,
          body: {
            user: {
              id: 'user_123',
              email: user.email,
              name: user.name,
            },
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
        });
      } else {
        req.reply({
          statusCode: 401,
          body: {
            message: 'Invalid credentials',
          },
        });
      }
    }).as('signIn');

    // Registration endpoint interception
    cy.intercept('POST', '/api/auth/register', (req) => {
      const { email } = req.body;
      const userExists = Object.values(testUsers).some(
        (u) => u.email === email
      );

      if (userExists) {
        req.reply({
          statusCode: 400,
          body: {
            message: 'User already exists',
          },
        });
      } else {
        req.reply({
          statusCode: 201,
          body: {
            user: {
              id: 'new_user_123',
              ...req.body,
            },
          },
        });
      }
    }).as('register');
  });
};

// Set up default viewport and test environment
export const setupTestEnvironment = () => {
  beforeEach(() => {
    // Reset viewport to default size
    cy.viewport(1280, 720);

    // Clear local storage and cookies
    cy.clearLocalStorage();
    cy.clearCookies();

    // Disable smooth scrolling for tests
    cy.document().then((doc) => {
      const style = doc.createElement('style');
      style.textContent = `
        * {
          scroll-behavior: auto !important;
          transition: none !important;
          animation: none !important;
        }
      `;
      doc.head.appendChild(style);
    });
  });
};

// Configure error handling and logging
export const setupErrorHandling = () => {
  Cypress.on('fail', (error, runnable) => {
    // Log additional context for failed tests
    console.error('Test failed:', {
      test: runnable.title,
      suite: runnable.parent.title,
      error: error.message,
      stack: error.stack,
    });

    // Take screenshot on failure
    cy.screenshot(`failure-${runnable.parent.title}-${runnable.title}`);

    throw error;
  });
};

// Configure custom assertions
export const setupCustomAssertions = () => {
  Cypress.Commands.add(
    'shouldHaveValidationError',
    { prevSubject: 'element' },
    (subject, message) => {
      cy.wrap(subject)
        .parents('form')
        .find('[data-testid="validation-error"]')
        .should('contain', message);
    }
  );

  Cypress.Commands.add(
    'shouldBeLoadingState',
    { prevSubject: 'element' },
    (subject) => {
      cy.wrap(subject)
        .should('have.attr', 'aria-busy', 'true')
        .and('have.class', 'loading');
    }
  );
};

// Export combined setup
export const setupTests = () => {
  initializeTestData();
  setupApiInterceptions();
  setupTestEnvironment();
  setupErrorHandling();
  setupCustomAssertions();
};
