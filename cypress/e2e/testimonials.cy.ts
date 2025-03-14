describe('Testimonials Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login();
    
    // Navigate to testimonials page
    cy.navigateTo('Testimonials');
  });

  it('should display the testimonials list', () => {
    // Check if the testimonials page loads correctly
    cy.contains('Testimonials').should('be.visible');
    cy.get('table').should('exist');
  });

  it('should allow searching for testimonials', () => {
    // Type in the search box
    cy.get('input[placeholder="Search..."]').type('John');
    
    // Check if the results are filtered
    cy.get('table tbody tr').should('have.length.lessThan', 10);
  });

  it('should navigate to testimonial details when clicking view', () => {
    // Click on the first testimonial's view button
    cy.get('table tbody tr').first().contains('View').click();
    
    // Should navigate to testimonial details page
    cy.url().should('include', '/admin/testimonials/');
    cy.contains('Testimonial Details').should('be.visible');
  });

  it('should allow creating a new testimonial', () => {
    // Click on the "Add New Testimonial" button
    cy.contains('Add New Testimonial').click();
    
    // Should navigate to the new testimonial form
    cy.url().should('include', '/admin/testimonials/new');
    
    // Fill in the form
    cy.fillForm({
      name: 'John Cypress',
      company: 'Cypress Testing Inc.',
      content: 'This is a test testimonial created by Cypress',
      rating: '5',
      isFeatured: true
    });
    
    // Submit the form and verify success
    cy.submitFormAndVerifySuccess();
    
    // Should be redirected back to testimonials list
    cy.url().should('include', '/admin/testimonials');
    
    // New testimonial should be in the list
    cy.contains('John Cypress').should('be.visible');
  });

  it('should allow editing a testimonial', () => {
    // Click on the first testimonial's edit button
    cy.get('table tbody tr').first().contains('Edit').click();
    
    // Should navigate to edit page
    cy.url().should('include', '/admin/testimonials/').and('include', '/edit');
    
    // Update the name
    cy.fillForm({
      name: 'Updated Testimonial Name'
    });
    
    // Submit the form and verify success
    cy.submitFormAndVerifySuccess();
    
    // Should be redirected back to testimonials list
    cy.url().should('include', '/admin/testimonials');
    
    // Updated testimonial should be in the list
    cy.contains('Updated Testimonial Name').should('be.visible');
  });

  it('should allow toggling featured status', () => {
    // Click on the first testimonial's featured toggle
    cy.get('table tbody tr').first().contains('Featured').click();
    
    // Should show a success message
    cy.contains('Status updated successfully').should('be.visible');
  });

  it('should allow deleting a testimonial', () => {
    // Get the name of the first testimonial for later verification
    let testimonialName = '';
    cy.get('table tbody tr').first().find('td').eq(0).then(($el) => {
      testimonialName = $el.text();
    });
    
    // Delete the first testimonial and confirm
    cy.deleteItemAndConfirm('table tbody tr:first-child');
    
    // Testimonial should no longer be in the list
    cy.contains(testimonialName).should('not.exist');
  });
}); 