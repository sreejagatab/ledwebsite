describe('Projects Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login();
    
    // Navigate to projects page
    cy.navigateTo('Projects');
  });

  it('should display the projects list', () => {
    // Check if the projects page loads correctly
    cy.contains('Projects').should('be.visible');
    cy.get('table').should('exist');
  });

  it('should allow searching for projects', () => {
    // Type in the search box
    cy.get('input[placeholder="Search..."]').should('exist').type('Office');
    
    // Check if the results are filtered
    cy.get('table tbody tr').should('have.length.lessThan', 10);
  });

  it('should navigate to project details when clicking view', () => {
    // Click on the first project's view button
    cy.get('table tbody tr').first().find('a').contains('Edit').click({ force: true });
    
    // Should navigate to project edit page
    cy.url().should('include', '/admin/projects/');
    cy.url().should('include', '/edit');
  });

  it('should allow creating a new project', () => {
    // Click on the "Add New Project" button
    cy.contains('Add New Project').click();
    
    // Fill out the form
    cy.get('input[name="title"]').type('Test Project');
    cy.get('select[name="category"]').select('Commercial');
    cy.get('textarea[name="description"]').type('This is a test project description');
    
    // Submit the form
    cy.contains('button', 'Create Project').click({ force: true });
    
    // Should redirect back to projects list
    cy.url().should('include', '/admin/projects');
  });

  it('should allow editing a project', () => {
    // Click on the first project's edit button
    cy.get('table tbody tr').first().find('a').contains('Edit').click({ force: true });
    
    // Edit the project title
    cy.get('input[name="title"]').clear().type('Updated Project Title');
    
    // Submit the form
    cy.contains('button', 'Update Project').click({ force: true });
    
    // Should redirect back to projects list
    cy.url().should('include', '/admin/projects');
  });

  it('should allow deleting a project', () => {
    // Get the number of projects before deletion
    cy.get('table tbody tr').then($rows => {
      const initialCount = $rows.length;
      
      // Click on the first project's delete button
      cy.get('table tbody tr').first().find('button').contains('Delete').click({ force: true });
      
      // Confirm deletion in the alert
      cy.on('window:confirm', () => true);
      
      // Check that the number of projects has decreased
      cy.get('table tbody tr').should('have.length', initialCount - 1);
    });
  });
}); 