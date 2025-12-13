export const API_BASE_URL = "http://localhost:4000";
// src/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// دالة مساعدة للاتصال بالباكند
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// دوال خاصة بالتبرعات
export const donationAPI = {
  // إنشاء تبرع جديد
  createDonation: (donationData) =>
    fetchAPI('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    }),

  // الحصول على إحصائيات التبرعات
  getStats: () => fetchAPI('/donations/stats'),
};

// دوال خاصة بالاتصال
export const contactAPI = {
  sendMessage: (contactData) =>
    fetchAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),
};

// دوال خاصة بالحملات
export const campaignAPI = {
  getCampaigns: () => fetchAPI('/campaigns'),
};

// دوال خاصة بالإحصائيات العامة
export const statsAPI = {
  getHomeStats: () => fetchAPI('/stats/home'),
};