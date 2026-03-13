import axios from "axios";

// Create a reusable axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URI, // Base URL for all requests
    withCredentials: true, // Include cookies in every request
});

// Variables to handle token refresh
let isRefreshing = false; // Tracks if a token refresh is already happening
let refreshSubscribers: (() => void)[] = []; // Queue of requests waiting for new access token

// Function to handle logout
const handleLogout = () => {
    // Redirect user to login page if not already there
    if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
    }
};

// Queue requests while a token refresh is happening
const subscribeTokenRefresh = (callback: () => void) => {
    refreshSubscribers.push(callback); // Add request to the queue
};

// Execute all queued requests after getting new access token
const onRefreshSuccess = () => {
    refreshSubscribers.forEach((callback) => callback()); // Retry all queued requests
    refreshSubscribers = []; // Clear the queue
};

// Request interceptor (runs before every request)
axiosInstance.interceptors.request.use(
    (config) => config, // Just return config without changes
    (error) => Promise.reject(error) // Handle request errors
);

// Response interceptor (runs after every response)
// Handles expired access token automatically
axiosInstance.interceptors.response.use(
    (response) => response, // Return response if successful
    async (error) => {
        const originalRequest = error.config; // Get the request that failed

        // Check if access token has expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If a token refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
                });
            }

            // Mark the request as retry to prevent infinite loop
            originalRequest._retry = true;
            isRefreshing = true; // Start token refresh process

            try {
                // Call backend refresh token endpoint
                await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_URI}/api/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                isRefreshing = false; // Token refresh complete
                onRefreshSuccess(); // Retry all queued requests

                return axiosInstance(originalRequest); // Retry the original request
            } catch (err) {
                // Token refresh failed -> log out user
                isRefreshing = false;
                refreshSubscribers = [];
                handleLogout();
                return Promise.reject(err);
            }
        }

        // Any other errors -> just reject
        return Promise.reject(error);
    }
);

export default axiosInstance;
