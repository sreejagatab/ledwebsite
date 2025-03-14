import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/admin/login');
  });

  test('should display login page', async ({ page }) => {
    // Verify login page elements
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation error for empty form submission', async ({ page }) => {
    // Click the sign in button without entering credentials
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify error message appears
    await expect(page.getByText('Email and password are required')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.getByLabel(/email address/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify error message appears
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    // Fill in valid credentials (assuming these are set up in the test environment)
    await page.getByLabel(/email address/i).fill('admin@luminatechled.com');
    await page.getByLabel(/password/i).fill('admin123');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for navigation to complete
    await page.waitForURL('/admin/dashboard');
    
    // Verify we're on the dashboard page
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    
    // Verify user is logged in by checking for user menu or profile element
    await expect(page.getByText(/admin user/i)).toBeVisible();
  });

  test('should maintain login session across page navigation', async ({ page }) => {
    // Login first
    await page.getByLabel(/email address/i).fill('admin@luminatechled.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for navigation to complete
    await page.waitForURL('/admin/dashboard');
    
    // Navigate to another admin page
    await page.getByRole('link', { name: /projects/i }).click();
    
    // Verify we're on the projects page and still logged in
    await expect(page.url()).toContain('/admin/projects');
    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
    
    // Navigate to settings page
    await page.getByRole('link', { name: /settings/i }).click();
    
    // Verify we're on the settings page and still logged in
    await expect(page.url()).toContain('/admin/settings');
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
  });

  test('should redirect to login page when accessing protected route while logged out', async ({ page }) => {
    // Try to access dashboard directly without logging in
    await page.goto('/admin/dashboard');
    
    // Verify redirect to login page
    await expect(page.url()).toContain('/admin/login');
    
    // Verify login page is shown
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
  });

  test('should log out successfully', async ({ page }) => {
    // Login first
    await page.getByLabel(/email address/i).fill('admin@luminatechled.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for navigation to complete
    await page.waitForURL('/admin/dashboard');
    
    // Click on the user menu to reveal logout option
    await page.getByText(/admin user/i).click();
    
    // Click the logout button
    await page.getByRole('button', { name: /log out/i }).click();
    
    // Verify redirect to login page
    await expect(page.url()).toContain('/admin/login');
    
    // Try to access dashboard after logout
    await page.goto('/admin/dashboard');
    
    // Verify redirect back to login page
    await expect(page.url()).toContain('/admin/login');
  });
}); 