import type { AuthUser } from "../../types/auth";

export const userAPI = {
  getProfile: async (username: string): Promise<AuthUser> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // For now, return minimal user data based on username
    // In a real app, this would fetch from a backend
    const firstName = username.charAt(0).toUpperCase() + username.slice(1);
    const lastName = "Johnson";
    return {
      username,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: "+1 (555) 123-4567",
    };
  },

  updateProfile: async (user: AuthUser): Promise<AuthUser> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // In a real app, this would send data to a backend
    // For now, just return the updated user
    return user;
  },
};
