const fallbackApiBaseUrl = "https://api.plantcarehub.id.vn";

export const config = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/+$/, ""),
  appName: import.meta.env.VITE_ADMIN_APP_NAME || "PlantCare Hub Admin"
};
