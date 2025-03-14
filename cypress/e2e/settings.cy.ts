describe('Settings Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login();
    
    // Navigate to settings page
    cy.navigateTo('Settings');
  });

  it('should display the settings page with tabs', () => {
    // Check if the settings page loads correctly
    cy.contains('Settings').should('be.visible');
    
    // Check if all tabs are present
    cy.contains('General').should('be.visible');
    cy.contains('Email').should('be.visible');
    cy.contains('Social Media').should('be.visible');
  });

  it('should allow updating general settings', () => {
    // Click on the General tab
    cy.contains('General').click();
    
    // Update settings
    cy.fillForm({
      companyName: 'LuminaTech LED Testing',
      address: '123 Cypress Test St, Testing City, TS 12345',
      phone: '(555) 123-4567'
    });
    
    // Submit the form and verify success
    cy.submitFormAndVerifySuccess();
    
    // Reload the page to verify persistence
    cy.reload();
    
    // Verify the updated values
    cy.get('input[name="companyName"]').should('have.value', 'LuminaTech LED Testing');
    cy.get('textarea[name="address"]').should('have.value', '123 Cypress Test St, Testing City, TS 12345');
    cy.get('input[name="phone"]').should('have.value', '(555) 123-4567');
  });

  it('should allow updating email settings', () => {
    // Click on the Email tab
    cy.contains('Email').click();
    
    // Update settings
    cy.fillForm({
      contactEmail: 'contact@luminatechled-test.com',
      supportEmail: 'support@luminatechled-test.com'
    });
    
    // Submit the form and verify success
    cy.submitFormAndVerifySuccess();
    
    // Reload the page to verify persistence
    cy.reload();
    cy.contains('Email').click();
    
    // Verify the updated values
    cy.get('input[name="contactEmail"]').should('have.value', 'contact@luminatechled-test.com');
    cy.get('input[name="supportEmail"]').should('have.value', 'support@luminatechled-test.com');
  });

  it('should allow updating social media settings', () => {
    // Click on the Social Media tab
    cy.contains('Social Media').click();
    
    // Update settings
    cy.fillForm({
      facebook: 'https://facebook.com/luminatech-test',
      instagram: 'https://instagram.com/luminatech-test',
      linkedin: 'https://linkedin.com/company/luminatech-test'
    });
    
    // Submit the form and verify success
    cy.submitFormAndVerifySuccess();
    
    // Reload the page to verify persistence
    cy.reload();
    cy.contains('Social Media').click();
    
    // Verify the updated values
    cy.get('input[name="facebook"]').should('have.value', 'https://facebook.com/luminatech-test');
    cy.get('input[name="instagram"]').should('have.value', 'https://instagram.com/luminatech-test');
    cy.get('input[name="linkedin"]').should('have.value', 'https://linkedin.com/company/luminatech-test');
  });
}); 