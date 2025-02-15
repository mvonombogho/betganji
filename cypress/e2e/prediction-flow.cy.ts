describe('Prediction Flow', () => {
  beforeEach(() => {
    // Reset any previous state
    cy.task('db:seed');
    
    // Login before each test
    cy.loginByApi('test@example.com', 'password123');
  });

  it('generates a prediction for an upcoming match', () => {
    // Select a match
    cy.selectMatch('Manchester United', 'Chelsea');

    // Verify match details are displayed
    cy.get('[data-testid="match-details"]').within(() => {
      cy.contains('Manchester United').should('exist');
      cy.contains('Chelsea').should('exist');
      cy.contains('Premier League').should('exist');
    });

    // Click generate prediction button
    cy.get('button').contains(/generate prediction/i).click();

    // Wait for prediction to load
    cy.waitForPrediction();

    // Verify prediction card contents
    cy.get('[data-testid="prediction-card"]').within(() => {
      // Verify confidence indicator
      cy.get('[data-testid="confidence-indicator"]')
        .should('exist')
        .and('contain', '%');

      // Verify key factors section
      cy.get('[data-testid="key-factors"]')
        .should('exist')
        .within(() => {
          cy.get('li').should('have.length.at.least', 2);
        });

      // Verify risk analysis
      cy.get('[data-testid="risk-analysis"]')
        .should('exist')
        .and('not.be.empty');

      // Verify insights
      cy.get('[data-testid="additional-insights"]')
        .should('exist')
        .and('not.be.empty');
    });

    // Verify prediction is saved
    cy.visit('/predictions');
    cy.contains('Manchester United vs Chelsea').should('exist');
  });

  it('handles API errors gracefully', () => {
    // Intercept prediction API and force an error
    cy.intercept('POST', '/api/predictions/analyze', {
      statusCode: 500,
      body: { message: 'Internal server error' },
    }).as('generatePrediction');

    // Select a match
    cy.selectMatch('Manchester United', 'Chelsea');

    // Try to generate prediction
    cy.get('button').contains(/generate prediction/i).click();

    // Verify error message is displayed
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .and('contain', 'Error generating prediction');

    // Verify retry button is available
    cy.get('button').contains(/try again/i).should('exist');
  });

  it('shows loading states during prediction generation', () => {
    // Intercept prediction API with delay
    cy.intercept('POST', '/api/predictions/analyze', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000);
      });
    }).as('generatePrediction');

    // Select a match
    cy.selectMatch('Manchester United', 'Chelsea');

    // Click generate prediction
    cy.get('button').contains(/generate prediction/i).click();

    // Verify loading states
    cy.get('[data-testid="prediction-loading"]').should('exist');
    cy.get('[data-testid="loading-spinner"]').should('exist');
    cy.get('button').contains(/generating/i).should('be.disabled');

    // Wait for prediction to complete
    cy.waitForPrediction();
  });

  it('updates prediction history after generation', () => {
    // Get initial prediction count
    cy.visit('/predictions');
    cy.get('[data-testid="prediction-list"] > *').then(($items) => {
      const initialCount = $items.length;

      // Generate new prediction
      cy.selectMatch('Manchester United', 'Chelsea');
      cy.get('button').contains(/generate prediction/i).click();
      cy.waitForPrediction();

      // Check prediction history
      cy.visit('/predictions');
      cy.get('[data-testid="prediction-list"] > *').should('have.length', initialCount + 1);
    });
  });

  it('allows filtering and sorting predictions', () => {
    cy.visit('/predictions');

    // Filter by team
    cy.get('[data-testid="team-filter"]').type('Manchester United');
    cy.get('[data-testid="prediction-list"]').within(() => {
      cy.contains('Manchester United').should('exist');
      cy.contains('Arsenal vs Chelsea').should('not.exist');
    });

    // Sort by confidence
    cy.get('[data-testid="sort-select"]').select('confidence');
    cy.get('[data-testid="prediction-list"]').within(() => {
      cy.get('[data-testid="confidence-value"]').then(($values) => {
        const confidences = [...$values].map((el) => parseInt(el.textContent!));
        expect(confidences).to.equal(confidences.sort((a, b) => b - a));
      });
    });
  });
});
