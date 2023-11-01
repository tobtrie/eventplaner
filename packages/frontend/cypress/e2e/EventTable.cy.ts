describe('Event details', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:3000/events',
    }).as('getEvents');
    cy.visit('http://localhost:3001');
    cy.wait('@getEvents');
  });
  it('Open detail', () => {
    cy.get('[title=Teamevent]').click();
    cy.get('[data-testid=event-detail-title]').should('be.visible');
    cy.get('[data-testid=event-detail-title]').should('have.text', 'Teamevent');
  });
  it('Save new ticket', () => {
    const firstname = 'Max';
    cy.get('[title=Teamevent]').click();
    cy.get('[data-testid=event-detail-title]').should('be.visible');
    cy.get('[data-testid=event-detail-title]').should('have.text', 'Teamevent');
    cy.get('[data-testid=btn-ticket-editor]').click();

    cy.get('[data-testid=btn-ticket-save]').should('be.visible');
    cy.get('[data-testid=btn-ticket-save]').should('be.disabled');

    cy.get('[data-testid=inp-ticket-firstname]').type(firstname);
    cy.get('[data-testid=inp-ticket-lastname]').type('Mustermann');
    cy.get('[data-testid=btn-ticket-save]').click();

    cy.get(`[title=${firstname}]`).should('be.visible');
  });
});
describe('Event Editor', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:3000/events',
    }).as('getEvents');
    cy.visit('http://localhost:3001');
    cy.wait('@getEvents');
  });
  it('Save new event', () => {
    const eventTitle = 'Mett4All'
    cy.get('[data-testid=btn-event-editor]').click();

    cy.get('[data-testid=inp-event-title]').type(eventTitle);
    cy.get('[data-testid=inp-event-city]').type('Walbeck');
    cy.get('[data-testid=inp-event-date]').type('14/09/20241000am');
    cy.get('[data-testid=btn-event-save]').should('be.enabled');
    cy.get('[data-testid=btn-event-save]').click();
    cy.get('[data-testid=btn-event-save]').should('not.be.visible');

    cy.get(`[title=${eventTitle}]`).should('be.visible');
  });
});
