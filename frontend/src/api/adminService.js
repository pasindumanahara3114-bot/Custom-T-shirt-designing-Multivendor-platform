import API from "./apiClient";

const adminService = {
    /**
     * Retrieves platform-wide statistics (users, vendors, orders, revenue).
     * @returns {Promise<Object>} The stats object.
     */
    getPlatformStats: async () => {
        try {
            const response = await API.get("/admin/stats");
            return response.data;
        } catch (error) {
            console.error("Fetch platform stats error:", error);
            throw error;
        }
    },

    /**
     * Retrieves all registered users across the platform.
     * @returns {Promise<Array>} List of user objects.
     */
    getAllUsers: async () => {
        try {
            const response = await API.get("/admin/users");
            return response.data;
        } catch (error) {
            console.error("Fetch all users error:", error);
            throw error;
        }
    },

    /**
     * Deletes a user from the platform.
     * @param {number} userId - The unique ID of the user.
     * @returns {Promise<void>}
     */
    deleteUser: async (userId) => {
        try {
            await API.delete(`/admin/users/${userId}`);
        } catch (error) {
            console.error("Delete user error:", error);
            throw error;
        }
    },

    /**
     * Retrieves all system orders.
     * @returns {Promise<Array>} List of all orders.
     */
    getAllOrders: async () => {
        try {
            // Reusing the existing generic order endpoint or Admin's specific one
            const response = await API.get("/admin/orders");
            return response.data;
        } catch (error) {
            console.error("Fetch all orders admin error:", error);
            throw error;
        }
    },

    /**
     * Retrieves the platform global settings including vendor profit margin.
     * @returns {Promise<Object>} The AppConfig object.
     */
    getAppConfig: async () => {
        try {
            const response = await API.get("/admin/config");
            return response.data;
        } catch (error) {
            console.error("Fetch app config error:", error);
            throw error;
        }
    },

    /**
     * Updates the platform global settings.
     * @param {number} percentage - The new vendor profit percentage (e.g., 2.0).
     * @returns {Promise<Object>} The updated AppConfig object.
     */
    updateAppConfig: async (vendorProfitPercentage) => {
        try {
            const response = await API.put("/admin/config", { vendorProfitPercentage });
            return response.data;
        } catch (error) {
            console.error("Update app config error:", error);
            throw error;
        }
    }
};

export default adminService;
