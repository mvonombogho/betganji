describe('Prediction History', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/predictions/history')
  })

  it('should display historical predictions', () => {
    cy.get('[data-cy=prediction-card]').should('have.length.at.least', 1)
    
    cy.get('[data-cy=prediction-card]').first().within(() => {
      cy.get('[data-cy=match-teams]').should('be.visible')
      cy.get('[data-cy=prediction-result]').should('be.visible')
      cy.get('[data-cy=prediction-confidence]').should('be.visible')
      cy.get('[data-cy=prediction-date]').should('be.visible')
    })
  })

  it('should filter predictions by date range', () => {
    // Open date filter
    cy.get('[data-cy=date-filter]').click()

    // Select last 7 days
    cy.get('[data-cy=date-option]').contains('Last 7 days').click()

    // Verify filtered predictions
    cy.get('[data-cy=prediction-card]').each(($card) => {
      cy.wrap($card).find('[data-cy=prediction-date]')
        .invoke('attr', 'data-date')
        .then((dateStr) => {
          const date = new Date(dateStr)
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          expect(date.getTime()).to.be.at.least(sevenDaysAgo.getTime())
        })
    })
  })

  it('should show prediction accuracy statistics', () => {
    cy.get('[data-cy=accuracy-stats]').within(() => {
      cy.get('[data-cy=total-predictions]').should('be.visible')
      cy.get('[data-cy=correct-predictions]').should('be.visible')
      cy.get('[data-cy=accuracy-percentage]').should('be.visible')
    })
  })

  it('should allow downloading prediction history', () => {
    cy.get('[data-cy=export-button]').click()
    cy.get('[data-cy=export-options]').within(() => {
      cy.get('[data-cy=export-pdf]').should('be.visible')
      cy.get('[data-cy=export-csv]').should('be.visible')
    })

    // Test CSV download
    cy.get('[data-cy=export-csv]').click()
    cy.readFile('cypress/downloads/prediction-history.csv').should('exist')
  })
})