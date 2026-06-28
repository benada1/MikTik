import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellTicketPage from './pages/SellTicketPage';
import DisputeCenterPage from './pages/DisputeCenterPage';
import AdminPanelPage from './pages/AdminPanelPage';
import BecomeSellerPage from './pages/BecomeSellerPage';
import SellerProfilePage from './pages/SellerProfilePage';
import StaticPageView from './pages/StaticPageView';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth pages — no layout chrome */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Main app with Navbar + Footer */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/marketplace" element={<PrivateRoute><MarketplacePage /></PrivateRoute>} />
                <Route path="/ticket/:id" element={<PrivateRoute><TicketDetailsPage /></PrivateRoute>} />
                <Route path="/buyer-dashboard" element={<PrivateRoute><BuyerDashboardPage /></PrivateRoute>} />
                <Route path="/seller-dashboard" element={<PrivateRoute><SellerDashboardPage /></PrivateRoute>} />
                <Route path="/sell" element={<PrivateRoute minLevel={2}><SellTicketPage /></PrivateRoute>} />
                <Route path="/become-seller" element={<PrivateRoute><BecomeSellerPage /></PrivateRoute>} />
                <Route path="/seller/:userId" element={<SellerProfilePage />} />
                <Route path="/dispute-center" element={<PrivateRoute><DisputeCenterPage /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute minLevel={3}><AdminPanelPage /></PrivateRoute>} />
                <Route path="/privacy-policy" element={<StaticPageView />} />
                <Route path="/terms-of-service" element={<StaticPageView />} />
                <Route path="/accessibility" element={<AccessibilityStatementPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
