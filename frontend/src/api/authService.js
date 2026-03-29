import API from "./apiClient";

const authService = {
    /**
     * Registers a new user with a specific role.
     * @param {Object} userData - User registration details.
     * @returns {Promise<Object>} The registered user data (DTO).
     */
    signup: async (userData) => {
        try {
            const response = await API.post("/auth/signup", userData);
            return response.data;
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    },

    /**
     * Authenticates a user with email and password.
     * @param {Object} credentials - User credentials (email, password).
     * @returns {Promise<Object>} The authenticated user data.
     */
    login: async (credentials) => {
        try {
            const response = await API.post("/auth/login", credentials);
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    /**
     * Retrieves user profile details by email.
     * @param {string} email - User email address.
     * @returns {Promise<Object>} User profile data (DTO).
     */
    getUserByEmail: async (email) => {
        try {
            const response = await API.get(`/auth/user/${email}`);
            return response.data;
        } catch (error) {
            console.error("Fetch user error:", error);
            throw error;
        }
    },
    /**
     * Completes customer profile setup.
     * @param {number} userId - User ID.
     * @param {Object} profileData - Profile details.
     * @returns {Promise<Object>} Updated user data.
     */
    completeCustomerProfile: async (userId, profileData) => {
        try {
            const response = await API.post(`/auth/profile/customer/${userId}`, profileData);
            return response.data;
        } catch (error) {
            console.error("Profile setup error:", error);
            throw error;
        }
    },

    /**
     * Completes vendor profile setup.
     * @param {number} userId - User ID.
     * @param {Object} profileData - Profile details.
     * @returns {Promise<Object>} Updated user data.
     */
    completeVendorProfile: async (userId, profileData) => {
        try {
            const response = await API.post(`/auth/profile/vendor/${userId}`, profileData);
            return response.data;
        } catch (error) {
            console.error("Profile setup error:", error);
            throw error;
        }
    },
};

export default authService;
