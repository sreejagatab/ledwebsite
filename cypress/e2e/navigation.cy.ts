describe('Navigation and Menu', () => {
  beforeEach(() => {
    // Login before each test
    cy.login();
  });

  it('should have a working sidebar navigation', () => {
    // Check if sidebar is visible
    cy.get('nav').should('be.visible');
    
    // Check if all main navigation items are present
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Projects').should('be.visible');
    cy.contains('Testimonials').should('be.visible');
    cy.contains('Inquiries').should('be.visible');
    cy.contains('Settings').should('be.visible');
  });

  it('should navigate to different sections using the sidebar', () => {
    // Navigate to Projects
    cy.navigateTo('Projects');
    cy.contains('Projects').should('be.visible');
    
    // Navigate to Testimonials
    cy.navigateTo('Testimonials');
    cy.contains('Testimonials').should('be.visible');
    
    // Navigate to Inquiries
    cy.navigateTo('Inquiries');
    cy.contains('Inquiries').should('be.visible');
    
    // Navigate to Settings
    cy.navigateTo('Settings');
    cy.contains('Settings').should('be.visible');
    
    // Navigate back to Dashboard
    cy.navigateTo('Dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should have a working header with user menu', () => {
    // Check if header is visible
    cy.get('header').should('be.visible');
    
    // Check if user menu is present
    cy.get('header').contains('Admin').should('be.visible');
    
    // Open user menu
    cy.get('header').contains('Admin').click();
    
    // Check if dropdown menu items are visible
    cy.contains('Profile').should('be.visible');
    cy.contains('Logout').should('be.visible');
  });

  it('should allow logging out', () => {
    // Open user menu
    cy.get('header').contains('Admin').click();
    
    // Click logout
    cy.contains('Logout').click();
    
    // Should be redirected to login page
    cy.url().should('include', '/login');
    
    // Try to access a protected route
    cy.visit('/admin/dashboard');
    
    // Should be redirected back to login
    cy.url().should('include', '/login');
  });

  it('should collapse and expand the sidebar', () => {
    // Find and click the collapse button
    cy.get('button[aria-label="Toggle Sidebar"]').click();
    
    // Sidebar should be collapsed
    cy.get('nav').should('have.class', 'collapsed');
    
    // Click again to expand
    cy.get('button[aria-label="Toggle Sidebar"]').click();
    
    // Sidebar should be expanded
    cy.get('nav').should('not.have.class', 'collapsed');
  });

  it('should highlight the active navigation item', () => {
    // Dashboard should be active initially
    cy.contains('Dashboard').parent().should('have.class', 'active');
    
    // Navigate to Projects
    cy.navigateTo('Projects');
    
    // Projects should be active
    cy.contains('Projects').parent().should('have.class', 'active');
    cy.contains('Dashboard').parent().should('not.have.class', 'active');
  });
}); 