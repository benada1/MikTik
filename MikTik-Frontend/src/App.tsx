import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/ticket/:id" element={<TicketDetailsPage />} />
                <Route path="/buyer-dashboard" element={<BuyerDashboardPage />} />
                <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
                <Route path="/sell" element={<SellTicketPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/dispute-center" element={<DisputeCenterPage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
