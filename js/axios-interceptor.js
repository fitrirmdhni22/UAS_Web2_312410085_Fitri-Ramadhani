/**
 * axios-interceptor.js
 * --------------------
 * Membuat instance Axios global dengan:
 * 1. Request Interceptor: menyuntikkan token dari localStorage
 *    secara otomatis ke header Authorization setiap request.
 * 2. Response Interceptor: menangkap error 401 Unauthorized secara
 *    global, menampilkan alert "sesi habis", lalu redirect ke login.
 */

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ---------- REQUEST INTERCEPTOR ----------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- RESPONSE INTERCEPTOR ----------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Bersihkan sesi yang sudah tidak valid
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      Swal.fire({
        icon: 'warning',
        title: 'Sesi Habis',
        text: 'Sesi login Anda telah berakhir. Silakan login kembali.',
        confirmButtonColor: '#4f46e5',
      }).then(() => {
        // Hindari redirect loop kalau memang sudah di halaman login
        if (window.location.hash !== '#/login') {
          window.location.hash = '#/login';
        }
      });
    }
    return Promise.reject(error);
  }
);
