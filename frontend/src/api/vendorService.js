import API from "./apiClient";

const vendorService = {
    /**
     * Retrieves all active printing providers.
     * @returns {Promise<Array>} List of vendor profiles.
     */
    getAllVendors: async () => {
        try {
            const response = await API.get("/vendors");
            return response.data;
        } catch (error) {
            console.error("Fetch all vendors error:", error);
            throw error;
        }
    },

    /**
     * Retrieves details for a specific vendor.
     * @param {number|string} id - Vendor ID.
     * @returns {Promise<Object>} Vendor profile data.
     */
    getVendorById: async (id) => {
        try {
            const response = await API.get(`/vendors/${id}`);
            return response.data;
        } catch (error) {
            console.error("Fetch vendor error:", error);
            throw error;
        }
    },

    /**
     * Retrieves the vendor profile associated with a specific user account.
     * @param {number|string} userId - User ID from AuthContext.
     * @returns {Promise<Object>} Vendor profile data.
     */
    getVendorByUserId: async (userId) => {
        try {
            const response = await API.get(`/vendors/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Fetch vendor by userId error:", error);
            throw error;
        }
    },

    /**
     * Retrieves providers eligible for a specific material and quantity.
     * @param {string} material - Material name.
     * @param {number} quantity - Required quantity.
     * @returns {Promise<Array>} List of eligible vendor profiles.
     */
    getEligibleVendors: async (material, quantity) => {
        try {
            const response = await API.get("/vendors/eligible", {
                params: { material, quantity }
            });
            return response.data;
        } catch (error) {
            console.error("Fetch eligible vendors error:", error);
            throw error;
        }
    },

    /**
     * Updates a vendor's business profile (Pricing, Materials, etc.).
     * @param {Object} profileData - Updated vendor profile details.
     * @returns {Promise<Object>} Updated profile data.
     */
    updateVendorProfile: async (profileData) => {
        try {
            const response = await API.put("/vendors/profile", profileData);
            return response.data;
        } catch (error) {
            console.error("Update vendor profile error:", error);
            throw error;
        }
    },
};

export default vendorService;
