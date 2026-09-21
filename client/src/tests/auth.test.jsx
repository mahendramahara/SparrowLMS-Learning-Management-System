import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleSwitcher from '../components/auth/RoleSwitcher';
import AuthInput from '../components/auth/AuthInput';
import OtpInput from '../components/auth/OtpInput';

describe('Auth Components', () => {
  it('renders RoleSwitcher with 3 roles and handles changes', () => {
    const handleChange = vi.fn();
    render(<RoleSwitcher activeRole="student" onChange={handleChange} />);

    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Instructor')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Instructor'));
    expect(handleChange).toHaveBeenCalledWith('instructor');

    fireEvent.click(screen.getByText('Admin'));
    expect(handleChange).toHaveBeenCalledWith('admin');
  });

  it('renders AuthInput and toggles password visibility', () => {
    render(
      <AuthInput label="Password" id="password" type="password" placeholder="Enter password" />
    );

    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders OtpInput with 6 digit inputs', () => {
    const handleChange = vi.fn();
    render(<OtpInput value="123" onChange={handleChange} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
    expect(inputs[0]).toHaveValue('1');
    expect(inputs[1]).toHaveValue('2');
    expect(inputs[2]).toHaveValue('3');
  });
});
