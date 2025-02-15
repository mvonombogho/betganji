describe('Dashboard Visual Regression', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/dashboard')
    // Wait for data to load
    cy.get('[data-cy=dashboard-stats]').should('be.visible')
  })

  it('should match dashboard layout snapshot', () => {
    cy.percySnapshot('Dashboard - Default View')
  })

  it('should match stats cards layout', () => {
    cy.get('[data-cy=stats-section]').should('be.visible')
    cy.percySnapshot('Dashboard - Stats Cards')
  })

  it('should match prediction form layout', () => {
    cy.get('[data-cy=match-card]').first().click()
    cy.get('[data-cy=prediction-form]').should('be.visible')
    cy.percySnapshot('Dashboard - Prediction Form')
  })

  it('should match mobile menu layout', () => {
    cy.viewport('iphone-x')
    cy.get('[data-cy=mobile-menu-button]').click()
    cy.get('[data-cy=mobile-menu]').should('be.visible')
    cy.percySnapshot('Dashboard - Mobile Menu')
  })
})