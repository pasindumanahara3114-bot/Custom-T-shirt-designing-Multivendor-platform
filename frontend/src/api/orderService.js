import API from "./apiClient";

const orderService = {
    /**
     * Submits a new custom design order.
     * @param {Object} orderData - Order details including design JSON and preview URL.
     * @returns {Promise<Object>} The created order (DTO).
     */
    placeOrder: async (orderData) => {
        try {
            const response = await API.post("/orders", orderData);
            return response.data;
        } catch (error) {
            console.error("Place order error:", error);
            throw error;
        }
    },

    /**
     * Retrieves all orders for the platform.
     * @returns {Promise<Array>} List of orders.
     */
    getAllOrders: async () => {
        try {
            const response = await API.get("/orders");
            return response.data;
        } catch (error) {
            console.error("Fetch all orders error:", error);
            throw error;
        }
    },

    /**
     * Updates an order's status in the production lifecycle.
     * @param {string} orderId - The unique ORD- identifier.
     * @param {string} status - The new status (e.g., PLACED, ACCEPTED, IN_PRODUCTION).
     * @returns {Promise<Object>} Updated order data.
     */
    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await API.patch(`/orders/${orderId}/status`, null, {
                params: { status },
            });
            return response.data;
        } catch (error) {
            console.error("Update order status error:", error);
            throw error;
        }
    },

    /**
     * Retrieves all orders assigned to a specific vendor.
     * @param {number} vendorId - The vendor's unique identifier.
     * @returns {Promise<Array>} List of orders.
     */
    getVendorOrders: async (vendorId) => {
        try {
            const response = await API.get(`/orders/vendor/${vendorId}`);
            return response.data;
        } catch (error) {
            console.error("Fetch vendor orders error:", error);
            throw error;
        }
    },

    /**
     * Retrieves all orders placed by a specific customer.
     * @param {number} customerId - The customer's unique identifier.
     * @returns {Promise<Array>} List of orders.
     */
    getCustomerOrders: async (customerId) => {
        try {
            const response = await API.get(`/orders/customer/${customerId}`);
            return response.data;
        } catch (error) {
            console.error("Fetch customer orders error:", error);
            throw error;
        }
    },

    /**
     * Downloads the design blueprint (JSON) for a specific order.
     * @param {string} orderId - The ORD- identifier.
     */
    downloadBlueprint: async (orderId) => {
        try {
            const response = await API.get(`/orders/${orderId}/blueprint`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${orderId}-blueprint.json`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download blueprint error:", error);
            throw error;
        }
    },

    /**
     * Downloads or opens the HD design preview for a specific order.
     * @param {string} orderId - The ORD- identifier.
     */
    downloadHDPreview: async (orderId) => {
        try {
            const url = `${API.defaults.baseURL}/orders/${orderId}/hd-preview`;
            window.open(url, '_blank');
        } catch (error) {
            console.error("Download HD preview error:", error);
            throw error;
        }
    },

    /**
     * Retrieves total earnings breakdown for a vendor.
     * @param {number} vendorId - The vendor profile ID.
     * @returns {Promise<Object>} { totalEarnings, pendingEarnings, completedOrders, totalOrders }
     */
    getVendorEarnings: async (vendorId) => {
        try {
            const response = await API.get(`/orders/vendor/${vendorId}/earnings`);
            return response.data;
        } catch (error) {
            console.error("Fetch vendor earnings error:", error);
            throw error;
        }
    },

    /**
     * Deletes an order from the system.
     * @param {string} orderId - The ORD- identifier.
     * @returns {Promise<void>}
     */
    deleteOrder: async (orderId) => {
        try {
            await API.delete(`/orders/${orderId}`);
        } catch (error) {
            console.error("Delete order error:", error);
            throw error;
        }
    },
};

export default orderService;
