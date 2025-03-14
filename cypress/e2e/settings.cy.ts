describe('Settings Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/admin/login');
    cy.get('input[name="email"]').type('admin@luminatechled.com');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Navigate to settings page
    cy.visit('/admin/settings');
    cy.url().should('include', '/admin/settings');
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
    
    // Update company name
    cy.get('input[name="companyName"]').clear().type('LuminaTech LED Testing');
    
    // Update address
    cy.get('textarea[name="address"]').clear().type('123 Cypress Test St, Testing City, TS 12345');
    
    // Update phone
    cy.get('input[name="phone"]').clear().type('(555) 123-4567');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Should show success message
    cy.contains('Settings saved successfully').should('be.visible');
    
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
    
    // Update contact email
    cy.get('input[name="contactEmail"]').clear().type('contact@luminatechled-test.com');
    
    // Update support email
    cy.get('input[name="supportEmail"]').clear().type('support@luminatechled-test.com');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Should show success message
    cy.contains('Settings saved successfully').should('be.visible');
    
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
    
    // Update Facebook URL
    cy.get('input[name="facebook"]').clear().type('https://facebook.com/luminatech-test');
    
    // Update Instagram URL
    cy.get('input[name="instagram"]').clear().type('https://instagram.com/luminatech-test');
    
    // Update LinkedIn URL
    cy.get('input[name="linkedin"]').clear().type('https://linkedin.com/company/luminatech-test');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Should show success message
    cy.contains('Settings saved successfully').should('be.visible');
    
    // Reload the page to verify persistence
    cy.reload();
    cy.contains('Social Media').click();
    
    // Verify the updated values
    cy.get('input[name="facebook"]').should('have.value', 'https://facebook.com/luminatech-test');
    cy.get('input[name="instagram"]').should('have.value', 'https://instagram.com/luminatech-test');
    cy.get('input[name="linkedin"]').should('have.value', 'https://linkedin.com/company/luminatech-test');
  });
}); 