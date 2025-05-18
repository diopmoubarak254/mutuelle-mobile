import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string, isEmail: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Mock implementation for web since SecureStore is not available there
const secureStorage = {
  async getItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  
  async setItemAsync(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return await SecureStore.setItemAsync(key, value);
  },
  
  async deleteItemAsync(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return await SecureStore.deleteItemAsync(key);
  }
};

// This is a mock function that would be replaced with an actual API call
const loginAPI = async (identifier: string, password: string, isEmail: boolean): Promise<{ user: User, token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful login
  return {
    user: {
      id: '123',
      fullName: 'Amadou Diop',
      email: isEmail ? identifier : 'amadou.diop@example.com',
      phone: isEmail ? '+221 77 123 45 67' : identifier
    },
    token: 'mock-jwt-token'
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  
  login: async (identifier, password, isEmail) => {
    try {
      const { user, token } = await loginAPI(identifier, password, isEmail);
      
      // Save to secure storage
      await secureStorage.setItemAsync('auth_token', token);
      await secureStorage.setItemAsync('user', JSON.stringify(user));
      
      set({ isAuthenticated: true, user, token });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials.');
    }
  },
  
  logout: async () => {
    try {
      await secureStorage.deleteItemAsync('auth_token');
      await secureStorage.deleteItemAsync('user');
      
      set({ isAuthenticated: false, user: null, token: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  updateUser: (userData) => {
    set((state) => {
      const updatedUser = { ...state.user, ...userData } as User;
      
      // Update secure storage
      secureStorage.setItemAsync('user', JSON.stringify(updatedUser)).catch(console.error);
      
      return { user: updatedUser };
    });
  }
}));

// Initialize auth state from storage
export const initializeAuth = async () => {
  try {
    const token = await secureStorage.getItemAsync('auth_token');
    const userJson = await secureStorage.getItemAsync('user');
    
    if (token && userJson) {
      const user = JSON.parse(userJson);
      useAuthStore.setState({ isAuthenticated: true, user, token });
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
  }
};

// Hook for components
export const useAuth = () => {
  const { isAuthenticated, user, token, login, logout, updateUser } = useAuthStore();
  return { isAuthenticated, user, token, login, logout, updateUser };
};