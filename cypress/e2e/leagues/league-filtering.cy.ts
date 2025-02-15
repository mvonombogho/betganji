describe('League Filtering', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/matches')
  })

  it('should filter matches by league', () => {
    // Open league filter
    cy.get('[data-cy=league-filter]').click()

    // Select Premier League
    cy.get('[data-cy=league-option]').contains('Premier League').click()

    // Verify only Premier League matches are shown
    cy.get('[data-cy=match-card]').each(($card) => {
      cy.wrap($card).should('contain', 'Premier League')
    })
  })

  it('should allow multiple league selection', () => {
    cy.get('[data-cy=league-filter]').click()

    // Select multiple leagues
    cy.get('[data-cy=league-option]').contains('Premier League').click()
    cy.get('[data-cy=league-option]').contains('La Liga').click()

    // Verify matches from both leagues are shown
    cy.get('[data-cy=match-card]').should('contain', 'Premier League')
    cy.get('[data-cy=match-card]').should('contain', 'La Liga')
  })

  it('should persist league filters', () => {
    // Select a league
    cy.get('[data-cy=league-filter]').click()
    cy.get('[data-cy=league-option]').contains('Premier League').click()

    // Refresh page
    cy.reload()

    // Verify filter is still applied
    cy.get('[data-cy=active-filters]').should('contain', 'Premier League')
    cy.get('[data-cy=match-card]').each(($card) => {
      cy.wrap($card).should('contain', 'Premier League')
    })
  })
})