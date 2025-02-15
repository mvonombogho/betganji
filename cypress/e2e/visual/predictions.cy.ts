describe('Predictions Page Visual Regression', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/predictions')
    // Wait for predictions to load
    cy.get('[data-cy=predictions-list]').should('be.visible')
  })

  it('should match predictions list layout', () => {
    cy.percySnapshot('Predictions - List View')
  })

  it('should match filters layout', () => {
    cy.get('[data-cy=filters-section]').should('be.visible')
    cy.percySnapshot('Predictions - Filters')
  })

  it('should match prediction details modal', () => {
    cy.get('[data-cy=prediction-card]').first().click()
    cy.get('[data-cy=prediction-details]').should('be.visible')
    cy.percySnapshot('Predictions - Details Modal')
  })

  it('should match empty state', () => {
    // Clear predictions
    cy.get('[data-cy=clear-predictions]').click()
    cy.get('[data-cy=empty-state]').should('be.visible')
    cy.percySnapshot('Predictions - Empty State')
  })

  it('should match error state', () => {
    // Simulate error
    cy.intercept('/api/predictions', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    })
    cy.reload()
    cy.get('[data-cy=error-state]').should('be.visible')
    cy.percySnapshot('Predictions - Error State')
  })
})