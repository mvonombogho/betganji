import './commands'

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
    }
  }
}

// Hide fetch/XHR requests from command log
const app = window.top;
if (app) {
  app.document.addEventListener('DOMContentLoaded', () => {
    const style = app.document.createElement('style');
    style.innerHTML =
      '.command-name-request, .command-name-xhr { display: none }';
    app.document.head.appendChild(style);
  });
}