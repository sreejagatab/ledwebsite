describe('Projects Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/admin/login');
    cy.get('input[name="email"]').type('admin@luminatechled.com');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Navigate to projects page
    cy.visit('/admin/projects');
    cy.url().should('include', '/admin/projects');
  });

  it('should display the projects list', () => {
    // Check if the projects page loads correctly
    cy.contains('Projects').should('be.visible');
    cy.get('table').should('exist');
  });

  it('should allow searching for projects', () => {
    // Type in the search box
    cy.get('input[placeholder="Search..."]').type('Office');
    
    // Check if the results are filtered
    cy.get('table tbody tr').should('have.length.lessThan', 10);
  });

  it('should navigate to project details when clicking view', () => {
    // Click on the first project's view button
    cy.get('table tbody tr').first().contains('View').click();
    
    // Should navigate to project details page
    cy.url().should('include', '/admin/projects/');
    cy.contains('Project Details').should('be.visible');
  });

  it('should allow creating a new project', () => {
    // Click on the "Add New Project" button
    cy.contains('Add New Project').click();
    
    // Should navigate to the new project form
    cy.url().should('include', '/admin/projects/new');
    
    // Fill in the form
    cy.get('input[name="title"]').type('Test Project');
    cy.get('textarea[name="description"]').type('This is a test project created by Cypress');
    cy.get('input[name="client"]').type('Cypress Testing Inc.');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Should be redirected back to projects list
    cy.url().should('include', '/admin/projects');
    
    // New project should be in the list
    cy.contains('Test Project').should('be.visible');
  });

  it('should allow editing a project', () => {
    // Click on the first project's edit button
    cy.get('table tbody tr').first().contains('Edit').click();
    
    // Should navigate to edit page
    cy.url().should('include', '/admin/projects/').and('include', '/edit');
    
    // Update the title
    cy.get('input[name="title"]').clear().type('Updated Project Title');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Should be redirected back to projects list
    cy.url().should('include', '/admin/projects');
    
    // Updated project should be in the list
    cy.contains('Updated Project Title').should('be.visible');
  });

  it('should allow deleting a project', () => {
    // Get the name of the first project for later verification
    let projectName = '';
    cy.get('table tbody tr').first().find('td').eq(0).then(($el) => {
      projectName = $el.text();
    });
    
    // Click on the first project's delete button
    cy.get('table tbody tr').first().contains('Delete').click();
    
    // Confirm deletion in the modal
    cy.get('button').contains('Confirm').click();
    
    // Project should no longer be in the list
    cy.contains(projectName).should('not.exist');
  });
}); 