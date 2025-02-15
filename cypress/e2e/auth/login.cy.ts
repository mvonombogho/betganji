describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should login successfully with valid credentials', () => {
    cy.get('[data-cy=email-input]').type('test@example.com')
    cy.get('[data-cy=password-input]').type('password123')
    cy.get('[data-cy=login-button]').click()

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard')
    cy.get('[data-cy=user-menu]').should('be.visible')
  })

  it('should show error with invalid credentials', () => {
    cy.get('[data-cy=email-input]').type('wrong@example.com')
    cy.get('[data-cy=password-input]').type('wrongpass')
    cy.get('[data-cy=login-button]').click()

    cy.get('[data-cy=error-message]').should('be.visible')
    cy.url().should('include', '/login')
  })

  it('should validate required fields', () => {
    cy.get('[data-cy=login-button]').click()

    cy.get('[data-cy=email-error]').should('be.visible')
    cy.get('[data-cy=password-error]').should('be.visible')
  })
})