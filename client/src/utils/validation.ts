// Validation utility for reusable form validations

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Phone number validation (US format)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length !== 10) {
    return { isValid: false, message: 'Phone number must be 10 digits' };
  }
  
  return { isValid: true };
};

// Numeric validation
export const validateNumeric = (value: string, options?: {
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  required?: boolean;
}): ValidationResult => {
  const { min, max, allowDecimal = true, required = true } = options || {};
  
  if (!value && required) {
    return { isValid: false, message: 'This field is required' };
  }
  
  if (!value && !required) {
    return { isValid: true };
  }
  
  const numericRegex = allowDecimal ? /^-?\d+(\.\d+)?$/ : /^-?\d+$/;
  if (!numericRegex.test(value)) {
    return { 
      isValid: false, 
      message: `Please enter a valid ${allowDecimal ? 'number' : 'whole number'}` 
    };
  }
  
  const numValue = parseFloat(value);
  
  if (min !== undefined && numValue < min) {
    return { isValid: false, message: `Value must be at least ${min}` };
  }
  
  if (max !== undefined && numValue > max) {
    return { isValid: false, message: `Value must be no more than ${max}` };
  }
  
  return { isValid: true };
};

// Required field validation
export const validateRequired = (value: string, fieldName: string = 'This field'): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

// Generic form validation function
export const validateForm = (
  fields: Record<string, string>,
  rules: Record<string, (value: string) => ValidationResult>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  Object.keys(rules).forEach(fieldName => {
    const value = fields[fieldName] || '';
    const validation = rules[fieldName](value);
    
    if (!validation.isValid) {
      errors[fieldName] = validation.message || 'Invalid value';
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  }
  return phone;
};

export default {
  validateEmail,
  validatePhoneNumber,
  validateNumeric,
  validateRequired,
  validatePassword,
  validateConfirmPassword,
  validateForm,
  formatPhoneNumber
};