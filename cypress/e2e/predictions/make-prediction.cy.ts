describe('Make Prediction Flow', () => {
  beforeEach(() => {
    // Login and visit predictions page
    cy.login() // Custom command
    cy.visit('/predictions')
  })

  it('should make a prediction successfully', () => {
    // Select a match
    cy.get('[data-cy=match-card]').first().click()

    // Make prediction
    cy.get('[data-cy=home-win-button]').click()
    cy.get('[data-cy=confirm-prediction]').click()

    // Verify success
    cy.get('[data-cy=success-message]').should('be.visible')
    cy.get('[data-cy=prediction-history]')
      .should('contain', 'Home Win')
  })

  it('should show match details before prediction', () => {
    cy.get('[data-cy=match-card]').first().click()

    cy.get('[data-cy=match-details]').within(() => {
      cy.get('[data-cy=home-team]').should('be.visible')
      cy.get('[data-cy=away-team]').should('be.visible')
      cy.get('[data-cy=match-time]').should('be.visible')
      cy.get('[data-cy=odds-display]').should('be.visible')
    })
  })

  it('should require confirmation for prediction', () => {
    cy.get('[data-cy=match-card]').first().click()
    cy.get('[data-cy=home-win-button]').click()

    // Confirmation dialog should appear
    cy.get('[data-cy=confirm-dialog]').should('be.visible')
    cy.get('[data-cy=confirm-prediction]').should('be.visible')
    cy.get('[data-cy=cancel-prediction]').should('be.visible')
  })
})