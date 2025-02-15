import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login using UI
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to login via API
       * @example cy.loginByApi('test@example.com', 'password123')
       */
      loginByApi(email: string, password: string): Chainable<void>;

      /**
       * Custom command to select a match for prediction
       * @example cy.selectMatch('Manchester United', 'Chelsea')
       */
      selectMatch(homeTeam: string, awayTeam: string): Chainable<void>;

      /**
       * Custom command to wait for prediction loading state
       * @example cy.waitForPrediction()
       */
      waitForPrediction(): Chainable<void>;
    }
  }
}

// Hide fetch/XHR requests from command log
const app = window.top;
if (app) {
  const log = app.console.log;
  app.console.log = (...args) => {
    if (args.length && typeof args[0] === 'string' && args[0].includes('xhr')) return;
    log(...args);
  };
}
