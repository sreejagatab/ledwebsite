describe('Testimonials Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/admin/login');
    cy.get('input[name="email"]').type('admin@luminatechled.com');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Navigate to testimonials page
    cy.visit('/admin/testimonials');
    cy.url().should('include', '/admin/testimonials');
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
    cy.get('input[name="name"]').type('John Cypress');
    cy.get('input[name="company"]').type('Cypress Testing Inc.');
    cy.get('textarea[name="content"]').type('This is a test testimonial created by Cypress');
    cy.get('input[name="rating"]').clear().type('5');
    
    // Toggle featured status
    cy.get('input[type="checkbox"]').check();
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
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
    cy.get('input[name="name"]').clear().type('Updated Testimonial Name');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
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
    
    // Click on the first testimonial's delete button
    cy.get('table tbody tr').first().contains('Delete').click();
    
    // Confirm deletion in the modal
    cy.get('button').contains('Confirm').click();
    
    // Testimonial should no longer be in the list
    cy.contains(testimonialName).should('not.exist');
  });
}); 