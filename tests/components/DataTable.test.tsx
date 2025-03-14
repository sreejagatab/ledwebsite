import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable from '@/app/components/DataTable';

// Mock data for testing
const mockData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Active' },
];

// Mock columns configuration
const mockColumns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  {
    key: 'actions',
    header: 'Actions',
    cell: (row: any) => (
      <div>
        <button onClick={() => mockHandlers.onView(row.id)}>View</button>
        <button onClick={() => mockHandlers.onEdit(row.id)}>Edit</button>
        <button onClick={() => mockHandlers.onDelete(row.id)}>Delete</button>
      </div>
    ),
  },
];

// Mock event handlers
const mockHandlers = {
  onView: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('DataTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the table with correct headers', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    // Check if all column headers are rendered
    mockColumns.forEach((column) => {
      expect(screen.getByRole('columnheader', { name: column.header })).toBeInTheDocument();
    });
  });

  it('renders the correct number of rows', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    // Check if the correct number of rows are rendered (excluding header row)
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(mockData.length + 1); // +1 for header row
  });

  it('renders cell data correctly', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    // Check if cell data is rendered correctly
    mockData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.email)).toBeInTheDocument();
      expect(screen.getByText(item.role)).toBeInTheDocument();
      expect(screen.getByText(item.status)).toBeInTheDocument();
    });
  });

  it('calls the correct handler when action buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    // Find the first row
    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1]; // Skip header row
    
    // Find action buttons in the first row
    const viewButton = within(firstDataRow).getByRole('button', { name: 'View' });
    const editButton = within(firstDataRow).getByRole('button', { name: 'Edit' });
    const deleteButton = within(firstDataRow).getByRole('button', { name: 'Delete' });
    
    // Click each button and verify the correct handler is called with the right ID
    await user.click(viewButton);
    expect(mockHandlers.onView).toHaveBeenCalledWith('1');
    
    await user.click(editButton);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith('1');
    
    await user.click(deleteButton);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  it('renders empty state when no data is provided', () => {
    render(<DataTable data={[]} columns={mockColumns} emptyMessage="No data available" />);
    
    // Check if empty message is displayed
    expect(screen.getByText('No data available')).toBeInTheDocument();
    
    // Check that no data rows are rendered
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(1); // Only header row
  });

  it('applies custom row class when provided', () => {
    const getRowClass = (row: any) => {
      return row.status === 'Inactive' ? 'inactive-row' : '';
    };
    
    render(<DataTable data={mockData} columns={mockColumns} getRowClass={getRowClass} />);
    
    // Find all rows
    const rows = screen.getAllByRole('row');
    
    // Skip header row (index 0)
    // Row at index 2 (Jane Smith) should have the inactive-row class
    expect(rows[2]).toHaveClass('inactive-row');
    
    // Other rows should not have the inactive-row class
    expect(rows[1]).not.toHaveClass('inactive-row');
    expect(rows[3]).not.toHaveClass('inactive-row');
  });

  it('renders with search functionality when provided', async () => {
    const user = userEvent.setup();
    
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        searchable={true}
        searchPlaceholder="Search users..."
      />
    );
    
    // Check if search input is rendered
    const searchInput = screen.getByPlaceholderText('Search users...');
    expect(searchInput).toBeInTheDocument();
    
    // Search for a specific user
    await user.type(searchInput, 'Jane');
    
    // Only Jane Smith should be visible
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
    
    // Clear search
    await user.clear(searchInput);
    
    // All users should be visible again
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('renders with pagination when provided', () => {
    // Create more mock data to test pagination
    const manyItems = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'User' : 'Editor',
      status: i % 2 === 0 ? 'Active' : 'Inactive',
    }));
    
    render(
      <DataTable 
        data={manyItems} 
        columns={mockColumns} 
        pagination={true}
        itemsPerPage={10}
      />
    );
    
    // Check if pagination controls are rendered
    expect(screen.getByText('1')).toBeInTheDocument(); // Current page
    expect(screen.getByText('2')).toBeInTheDocument(); // Next page
    expect(screen.getByText('3')).toBeInTheDocument(); // Last page
    
    // Check that only the first 10 items are rendered
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 10')).toBeInTheDocument();
    expect(screen.queryByText('User 11')).not.toBeInTheDocument();
    
    // Click on page 2
    fireEvent.click(screen.getByText('2'));
    
    // Check that the second page items are rendered
    expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    expect(screen.getByText('User 11')).toBeInTheDocument();
    expect(screen.getByText('User 20')).toBeInTheDocument();
    expect(screen.queryByText('User 21')).not.toBeInTheDocument();
  });
}); 