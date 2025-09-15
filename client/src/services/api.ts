import config from '@/config/config';

// API Response interface for consistent typing
interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

// Simulate network delay for realistic API behavior
const simulateNetworkDelay = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, config.LOADING_DELAY);
  });
};

// Dummy data for different entities
const dummyData = {
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@mysage.com',
      firstName: 'John',
      lastName: 'Admin',
      role: 'admin',
      isActive: true,
      lastLogin: new Date().toISOString(),
      permissions: ['dashboard', 'queue-management', 'user-management', 'pa-tracker', 'ev-tracker', 'reports']
    },
    {
      id: '2',
      username: 'staff',
      email: 'staff@mysage.com',
      firstName: 'Jane',
      lastName: 'Staff',
      role: 'staff',
      isActive: true,
      lastLogin: new Date().toISOString(),
      permissions: ['dashboard', 'queue-management']
    }
  ],
  queueItems: [
    {
      id: '1',
      patientName: 'John Doe',
      provider: 'Dr. Smith Clinic',
      status: 'pending',
      queue: 'Authorization',
      disposition: 'Pending Response',
      insurance: 'Aetna',
      portfolio: 'ChiroHD',
      program: 'Authorization',
      requestedDate: new Date().toISOString()
    }
  ],
  permissions: {
    admin: ['dashboard', 'queue-management', 'user-management', 'pa-tracker', 'ev-tracker', 'reports'],
    staff: ['dashboard', 'queue-management'],
    system_admin: ['dashboard', 'queue-management', 'user-management', 'pa-tracker', 'ev-tracker', 'reports']
  }
};

// Common API service class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.API_BASE_URL;
  }

  // Generic GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    await simulateNetworkDelay();
    
    // Simulate different GET endpoints
    switch (endpoint) {
      case '/users':
        return { 
          data: dummyData.users as T, 
          success: true, 
          message: 'Users fetched successfully' 
        };
      
      case '/queue-items':
        return { 
          data: dummyData.queueItems as T, 
          success: true, 
          message: 'Queue items fetched successfully' 
        };
      
      case '/auth/me':
        return { 
          data: dummyData.users[0] as T, 
          success: true, 
          message: 'User profile fetched successfully' 
        };
      
      case '/permissions':
        return { 
          data: dummyData.permissions as T, 
          success: true, 
          message: 'Permissions fetched successfully' 
        };
      
      default:
        return { 
          data: {} as T, 
          success: true, 
          message: `Data fetched for ${endpoint}` 
        };
    }
  }

  // Generic POST request
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    await simulateNetworkDelay();
    
    // Simulate different POST endpoints
    switch (endpoint) {
      case '/auth/login':
        if (data.username === 'admin' && data.password === 'admin') {
          return { 
            data: { user: dummyData.users[0], token: 'dummy-token' } as T, 
            success: true, 
            message: 'Login successful' 
          };
        }
        return { 
          data: null as T, 
          success: false, 
          message: 'Invalid credentials' 
        };
      
      case '/users':
        const newUser = { 
          id: Date.now().toString(), 
          ...data, 
          isActive: true, 
          createdAt: new Date().toISOString() 
        };
        return { 
          data: newUser as T, 
          success: true, 
          message: 'User created successfully' 
        };
      
      default:
        return { 
          data: { id: Date.now().toString(), ...data } as T, 
          success: true, 
          message: `Data created for ${endpoint}` 
        };
    }
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    await simulateNetworkDelay();
    
    return { 
      data: { ...data, updatedAt: new Date().toISOString() } as T, 
      success: true, 
      message: `Data updated for ${endpoint}` 
    };
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    await simulateNetworkDelay();
    
    return { 
      data: { deleted: true } as T, 
      success: true, 
      message: `Data deleted for ${endpoint}` 
    };
  }

  // Specific method for login
  async login(credentials: { username: string; password: string }) {
    return this.post('/auth/login', credentials);
  }

  // Specific method for getting current user
  async getCurrentUser() {
    return this.get('/auth/me');
  }

  // Specific method for getting user permissions
  async getUserPermissions(userId: string) {
    return this.get('/permissions', { userId });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;