/* eslint-disable no-undef */

describe('WikiMemods', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })

  it('home page can be opened', function() {
    cy.contains('Welcome to wikiMeMods')
    cy.contains('Building together the greatest latticework of Mental Models.')
  })

  it('articles page can be open', function() {
    cy.get('.articles-link').contains('Articles').click()
    cy.contains('Circle of Competence')
  })
})
