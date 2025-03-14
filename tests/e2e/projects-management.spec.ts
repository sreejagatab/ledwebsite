import { test, expect } from '@playwright/test';

test.describe('Projects Management Flow', () => {
  // Test data
  const testProject = {
    title: 'Test Project',
    description: 'This is a test project created by automated tests',
    client: 'Test Client',
    location: 'Test Location',
    completionDate: '2023-12-31',
    category: 'Commercial',
  };

  // Login before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/admin/login');
    
    // Login with admin credentials
    await page.getByLabel(/email address/i).fill('admin@luminatechled.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for navigation to dashboard
    await page.waitForURL('/admin/dashboard');
    
    // Navigate to projects page
    await page.getByRole('link', { name: /projects/i }).click();
    await page.waitForURL('/admin/projects');
  });

  test('should display projects list page', async ({ page }) => {
    // Verify page title
    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
    
    // Verify add project button exists
    await expect(page.getByRole('link', { name: /add project/i })).toBeVisible();
    
    // Verify projects table exists
    await expect(page.getByRole('table')).toBeVisible();
    
    // Verify table headers
    const headers = ['Title', 'Client', 'Category', 'Date', 'Featured', 'Actions'];
    for (const header of headers) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }
  });

  test('should create a new project', async ({ page }) => {
    // Click add project button
    await page.getByRole('link', { name: /add project/i }).click();
    
    // Wait for navigation to add project page
    await page.waitForURL('/admin/projects/new');
    
    // Verify form is displayed
    await expect(page.getByRole('heading', { name: /add new project/i })).toBeVisible();
    
    // Fill in project details
    await page.getByLabel(/title/i).fill(testProject.title);
    await page.getByLabel(/description/i).fill(testProject.description);
    await page.getByLabel(/client/i).fill(testProject.client);
    await page.getByLabel(/location/i).fill(testProject.location);
    await page.getByLabel(/completion date/i).fill(testProject.completionDate);
    await page.getByLabel(/category/i).selectOption(testProject.category);
    
    // Submit the form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Wait for navigation back to projects list
    await page.waitForURL('/admin/projects');
    
    // Verify success message
    await expect(page.getByText(/project created successfully/i)).toBeVisible();
    
    // Verify new project appears in the list
    await expect(page.getByRole('cell', { name: testProject.title })).toBeVisible();
    await expect(page.getByRole('cell', { name: testProject.client })).toBeVisible();
    await expect(page.getByRole('cell', { name: testProject.category })).toBeVisible();
  });

  test('should view project details', async ({ page }) => {
    // Find and click on the view button for the test project
    const projectRow = page.getByRole('row', { name: new RegExp(testProject.title) });
    await projectRow.getByRole('link', { name: /view/i }).click();
    
    // Wait for navigation to project details page
    await page.waitForURL(/\/admin\/projects\/\d+$/);
    
    // Verify project details are displayed
    await expect(page.getByRole('heading', { name: testProject.title })).toBeVisible();
    await expect(page.getByText(testProject.description)).toBeVisible();
    await expect(page.getByText(testProject.client)).toBeVisible();
    await expect(page.getByText(testProject.location)).toBeVisible();
    await expect(page.getByText(testProject.category)).toBeVisible();
    
    // Verify edit button exists
    await expect(page.getByRole('link', { name: /edit/i })).toBeVisible();
  });

  test('should edit an existing project', async ({ page }) => {
    // Find and click on the edit button for the test project
    const projectRow = page.getByRole('row', { name: new RegExp(testProject.title) });
    await projectRow.getByRole('link', { name: /edit/i }).click();
    
    // Wait for navigation to edit page
    await page.waitForURL(/\/admin\/projects\/\d+\/edit$/);
    
    // Verify form is pre-filled with project data
    await expect(page.getByLabel(/title/i)).toHaveValue(testProject.title);
    await expect(page.getByLabel(/description/i)).toHaveValue(testProject.description);
    
    // Update project details
    const updatedTitle = `${testProject.title} (Updated)`;
    await page.getByLabel(/title/i).fill(updatedTitle);
    
    // Submit the form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Wait for navigation back to projects list
    await page.waitForURL('/admin/projects');
    
    // Verify success message
    await expect(page.getByText(/project updated successfully/i)).toBeVisible();
    
    // Verify updated project appears in the list
    await expect(page.getByRole('cell', { name: updatedTitle })).toBeVisible();
  });

  test('should toggle featured status', async ({ page }) => {
    // Find the test project row
    const projectRow = page.getByRole('row', { name: new RegExp(testProject.title) });
    
    // Get initial featured status
    const initialFeaturedStatus = await projectRow.getByRole('cell', { name: /featured/i }).textContent();
    const initialIsFeatured = initialFeaturedStatus?.includes('Yes');
    
    // Click the featured toggle button
    await projectRow.getByRole('button', { name: /toggle featured/i }).click();
    
    // Wait for the update to complete
    await page.waitForTimeout(500);
    
    // Verify featured status has changed
    const newFeaturedStatus = await projectRow.getByRole('cell', { name: /featured/i }).textContent();
    const newIsFeatured = newFeaturedStatus?.includes('Yes');
    
    expect(newIsFeatured).not.toEqual(initialIsFeatured);
  });

  test('should delete a project', async ({ page }) => {
    // Find the test project row
    const projectRow = page.getByRole('row', { name: new RegExp(testProject.title) });
    
    // Click the delete button
    await projectRow.getByRole('button', { name: /delete/i }).click();
    
    // Confirm deletion in the dialog
    await page.getByRole('button', { name: /confirm/i }).click();
    
    // Wait for the deletion to complete
    await page.waitForTimeout(500);
    
    // Verify success message
    await expect(page.getByText(/project deleted successfully/i)).toBeVisible();
    
    // Verify project no longer appears in the list
    await expect(page.getByRole('cell', { name: new RegExp(testProject.title) })).not.toBeVisible();
  });
}); 