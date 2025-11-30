import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./Components/auth/common/Layout";
import Navbar from "./Components/auth/common/Navbar";

// Import Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import Cart from "./Components/auth/cart/Cart";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import ContactUs from './Components/auth/contact/ContactUs';
import BlogPage from './pages/BlogPage';

// Import Context Providers
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from "./context/LanguageContext";
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/become-seller" element={<BecomeSellerPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/blog" element={<BlogPage />} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
