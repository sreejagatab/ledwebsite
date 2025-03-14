// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email = 'admin@example.com', password = 'password') => {
  cy.visit('/admin/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/admin/dashboard');
});

// Navigate to a specific admin section
Cypress.Commands.add('navigateTo', (section) => {
  cy.contains(section).click();
  cy.url().should('include', `/admin/${section.toLowerCase()}`);
});

// Fill form fields based on a data object
Cypress.Commands.add('fillForm', (formData) => {
  Object.entries(formData).forEach(([field, value]) => {
    const selector = `[name="${field}"]`;
    const element = cy.get(selector);
    
    // Handle different input types
    element.then($el => {
      const tagName = $el.prop('tagName').toLowerCase();
      const type = $el.attr('type');
      
      if (tagName === 'textarea') {
        element.clear().type(value as string);
      } else if (type === 'checkbox') {
        if (value) {
          element.check();
        } else {
          element.uncheck();
        }
      } else if (type === 'radio') {
        element.check(value as string);
      } else {
        element.clear().type(value as string);
      }
    });
  });
});

// Submit a form and verify success message
Cypress.Commands.add('submitFormAndVerifySuccess', (successMessage = 'saved successfully') => {
  cy.get('button[type="submit"]').click();
  cy.contains(successMessage, { timeout: 10000 }).should('be.visible');
});

// Delete an item and confirm
Cypress.Commands.add('deleteItemAndConfirm', (itemSelector, confirmButtonText = 'Confirm') => {
  cy.get(itemSelector).contains('Delete').click();
  cy.contains(confirmButtonText).click();
  cy.contains('deleted successfully', { timeout: 10000 }).should('be.visible');
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      navigateTo(section: string): Chainable<void>
      fillForm(formData: Record<string, any>): Chainable<void>
      submitFormAndVerifySuccess(successMessage?: string): Chainable<void>
      deleteItemAndConfirm(itemSelector: string, confirmButtonText?: string): Chainable<void>
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
} 