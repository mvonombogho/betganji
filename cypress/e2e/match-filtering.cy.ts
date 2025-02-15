import { testUsers } from '../support/test-data';

describe('Match Filtering and Sorting', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.loginByApi(testUsers.regular.email, testUsers.regular.password);
    cy.visit('/matches');
  });

  describe('Filtering', () => {
    it('filters matches by team name', () => {
      // Type team name in search
      cy.get('[data-testid="team-search"]').type('Manchester United');

      // Should only show matches with Manchester United
      cy.get('[data-testid="match-card"]').each(($card) => {
        cy.wrap($card).should('contain.text', 'Manchester United');
      });

      // Clear filter
      cy.get('[data-testid="team-search"] [data-testid="clear-button"]').click();

      // Should show all matches again
      cy.get('[data-testid="match-card"]').should('have.length.gt', 1);
    });

    it('filters matches by competition', () => {
      // Select competition from dropdown
      cy.get('[data-testid="competition-filter"]').click();
      cy.get('[data-role="listbox"]').contains('Premier League').click();

      // Should only show Premier League matches
      cy.get('[data-testid="match-card"]').each(($card) => {
        cy.wrap($card).should('contain.text', 'Premier League');
      });
    });

    it('filters matches by date range', () => {
      // Open date picker
      cy.get('[data-testid="date-range-picker"]').click();

      // Select next 7 days
      cy.get('[data-testid="date-range-7days"]').click();

      // Verify matches are within date range
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      cy.get('[data-testid="match-card"]').each(($card) => {
        const matchDate = new Date($card.attr('data-match-date'));
        expect(matchDate).to.be.within(today, nextWeek);
      });
    });
  });

  describe('Sorting', () => {
    it('sorts matches by date', () => {
      // Sort by date ascending
      cy.get('[data-testid="sort-select"]').select('date-asc');

      // Verify order
      cy.get('[data-testid="match-card"]').then(($cards) => {
        const dates = [...$cards].map(card => 
          new Date(card.getAttribute('data-match-date'))
        );
        expect(dates).to.deep.equal([...dates].sort((a, b) => a - b));
      });

      // Sort by date descending
      cy.get('[data-testid="sort-select"]').select('date-desc');

      // Verify order
      cy.get('[data-testid="match-card"]').then(($cards) => {
        const dates = [...$cards].map(card => 
          new Date(card.getAttribute('data-match-date'))
        );
        expect(dates).to.deep.equal([...dates].sort((a, b) => b - a));
      });
    });

    it('sorts matches by prediction confidence', () => {
      // Sort by confidence descending
      cy.get('[data-testid="sort-select"]').select('confidence-desc');

      // Verify order
      cy.get('[data-testid="match-card"] [data-testid="confidence-value"]')
        .then(($values) => {
          const confidences = [...$values].map(el => 
            parseInt(el.textContent.replace('%', ''))
          );
          expect(confidences).to.deep.equal([...confidences].sort((a, b) => b - a));
        });
    });
  });

  describe('Filter Combinations', () => {
    it('combines team and competition filters', () => {
      // Apply team filter
      cy.get('[data-testid="team-search"]').type('Manchester United');

      // Apply competition filter
      cy.get('[data-testid="competition-filter"]').click();
      cy.get('[data-role="listbox"]').contains('Premier League').click();

      // Verify results
      cy.get('[data-testid="match-card"]').each(($card) => {
        cy.wrap($card).should('contain.text', 'Manchester United');
        cy.wrap($card).should('contain.text', 'Premier League');
      });
    });

    it('maintains filters when changing pages', () => {
      // Apply filters
      cy.get('[data-testid="team-search"]').type('Manchester United');
      cy.get('[data-testid="competition-filter"]').click();
      cy.get('[data-role="listbox"]').contains('Premier League').click();

      // Change page
      cy.get('[data-testid="pagination-next"]').click();

      // Verify filters are still applied
      cy.get('[data-testid="match-card"]').each(($card) => {
        cy.wrap($card).should('contain.text', 'Manchester United');
        cy.wrap($card).should('contain.text', 'Premier League');
      });

      // Verify filter inputs maintain their values
      cy.get('[data-testid="team-search"]')
        .should('have.value', 'Manchester United');
      cy.get('[data-testid="competition-filter"]')
        .should('contain.text', 'Premier League');
    });
  });
});
