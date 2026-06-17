import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellTicketPage from './pages/SellTicketPage';
import WalletPage from './pages/WalletPage';
import DisputeCenterPage from './pages/DisputeCenterPage';
import AdminPanelPage from './pages/AdminPanelPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no layout chrome */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

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
                <Route path="/sell" element={<PrivateRoute><SellTicketPage /></PrivateRoute>} />
                <Route path="/wallet" element={<PrivateRoute><WalletPage /></PrivateRoute>} />
                <Route path="/dispute-center" element={<PrivateRoute><DisputeCenterPage /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute><AdminPanelPage /></PrivateRoute>} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
