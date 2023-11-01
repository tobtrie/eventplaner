import { TicketForm } from '@/app/ticket-form';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

describe('TicketForm.cy.tsx', () => {
  it('create a valid form', () => {
    cy.mount(
      <ThemeRegistry>
        <TicketForm
          onAdd={() => Promise.resolve({ success: true, value: undefined })}
        />
      </ThemeRegistry>,
    );
    cy.get('[data-testid=inp-ticket-firstname]').type('Max');
    cy.get('[data-testid=inp-ticket-lastname]').type('Mustermann');
    cy.get('[data-testid=btn-ticket-save]').should('be.enabled');
  });

  it('create a invalid form', () => {
    cy.mount(
      <ThemeRegistry>
        <TicketForm
          onAdd={() => Promise.resolve({ success: true, value: undefined })}
        />
      </ThemeRegistry>,
    );

    cy.get('[data-testid=inp-ticket-firstname]').type(' ');
    cy.get('[data-testid=inp-ticket-lastname]').type('Mustermann');
    cy.get('[data-testid=btn-ticket-save]').should('be.disabled');
  });
});
