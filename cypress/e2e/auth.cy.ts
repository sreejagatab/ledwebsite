describe('Authentication Flow', () => {
  beforeEach(() => {
    // Reset any previous state
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should redirect to login page when accessing protected routes', () => {
    // Try to access a protected route
    cy.visit('/admin/dashboard');
    
    // Should be redirected to login
    cy.url().should('include', '/login');
  });

  it('should show error message with invalid credentials', () => {
    cy.visit('/admin/login');
    
    // Fill in the form with invalid credentials
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Check for error message
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.visit('/admin/login');
    
    // Fill in the form with valid credentials
    cy.get('input[name="email"]').type('admin@luminatechled.com');
    cy.get('input[name="password"]').type('admin123');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    cy.url().should('include', '/admin/dashboard');
    
    // Dashboard should contain expected elements
    cy.contains('Dashboard').should('be.visible');
  });
}); 