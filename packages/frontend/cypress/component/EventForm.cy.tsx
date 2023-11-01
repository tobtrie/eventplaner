import { EventForm } from '@/app/event-form';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

describe('EventForm.cy.tsx', () => {
  it('create a valid form', () => {
    cy.mount(
      <ThemeRegistry>
        <EventForm
          onAdd={() => Promise.resolve({ success: true, value: undefined })}
        />
      </ThemeRegistry>,
    );
    cy.get('[data-testid=inp-event-title]').type('Mett4All');
    cy.get('[data-testid=inp-event-city]').type('Walbeck');
    cy.get('[data-testid=inp-event-date]').type('14/09/20241000am');
    cy.get('[data-testid=btn-event-save]').should('be.enabled');
  });

  it('create a invalid form', () => {
    cy.mount(
      <ThemeRegistry>
        <EventForm
          onAdd={() => {
            return Promise.resolve({ success: true, value: undefined });
          }}
        />
      </ThemeRegistry>,
    );

    cy.get('[data-testid=inp-event-title]').type('Mett4All');
    cy.get('[data-testid=inp-event-city]').type('Walbeck');
    cy.get('[data-testid=inp-event-date]').type('14/09');
    cy.get('[data-testid=btn-event-save]').should('be.disabled');
    cy.get('[data-testid=inp-event-date]').should('have.attr', 'aria-invalid');
  });
});
