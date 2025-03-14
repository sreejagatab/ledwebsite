import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import LoginPage from '@/app/admin/login/page';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => {
      if (param === 'callbackUrl') return '/admin/dashboard';
      return null;
    }),
  })),
}));

describe('Login Form Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the login form', () => {
    render(<LoginPage />);
    
    // Check if the form elements are rendered
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    // Get the form and submit button
    const form = screen.getByRole('form') || document.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // Submit the form directly using form submission
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify that signIn was not called
    expect(signIn).not.toHaveBeenCalled();
  });

  it('should call signIn when submitting valid credentials', async () => {
    const user = userEvent.setup();
    
    // Mock successful sign in
    (signIn as jest.Mock).mockResolvedValueOnce({ 
      error: null,
      ok: true,
      status: 200,
    });
    
    render(<LoginPage />);
    
    // Fill in the form
    await user.type(screen.getByLabelText(/email address/i), 'admin@luminatechled.com');
    await user.type(screen.getByLabelText(/password/i), 'admin123');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify that signIn was called with the correct arguments
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'admin@luminatechled.com',
        password: 'admin123',
      });
    });
  });

  it('should display error message when login fails', async () => {
    const user = userEvent.setup();
    
    // Mock failed sign in
    (signIn as jest.Mock).mockResolvedValueOnce({ 
      error: 'Invalid email or password',
      ok: false,
      status: 401,
    });
    
    render(<LoginPage />);
    
    // Fill in the form
    await user.type(screen.getByLabelText(/email address/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('should show loading state while submitting', async () => {
    const user = userEvent.setup();
    
    // Mock delayed sign in
    (signIn as jest.Mock).mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ error: null, ok: true, status: 200 });
        }, 100);
      });
    });
    
    render(<LoginPage />);
    
    // Fill in the form
    await user.type(screen.getByLabelText(/email address/i), 'admin@luminatechled.com');
    await user.type(screen.getByLabelText(/password/i), 'admin123');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check if loading state is shown
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    
    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(screen.queryByText('Signing in...')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });
}); 