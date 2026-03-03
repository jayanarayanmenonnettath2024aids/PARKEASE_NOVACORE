import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CurrentLocationFlow from './pages/CurrentLocationFlow';
import BookingFlow from './pages/BookingFlow';
import AdminDashboard from './pages/AdminDashboard';
import NavigationScreen from './pages/NavigationScreen';
import PaymentScreen from './pages/PaymentScreen';
import ReceiptScreen from './pages/ReceiptScreen';
import LocationSelection from './pages/LocationSelection';
import TimeSelection from './pages/TimeSelection';
import ParkingHistory from './pages/ParkingHistory';
import InfoPage from './pages/InfoPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/landing" replace />;
  return children;
};

function AppContent() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {token && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/landing" element={!token ? <Landing /> : <Navigate to="/" />} />
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/nearby" element={<ProtectedRoute><CurrentLocationFlow /></ProtectedRoute>} />
          <Route path="/book-advance" element={<ProtectedRoute><LocationSelection /></ProtectedRoute>} />
          <Route path="/time-selection" element={<ProtectedRoute><TimeSelection /></ProtectedRoute>} />
          <Route path="/book/:lotId" element={<ProtectedRoute><BookingFlow /></ProtectedRoute>} />
          <Route path="/navigation" element={<ProtectedRoute><NavigationScreen /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentScreen /></ProtectedRoute>} />
          <Route path="/receipt" element={<ProtectedRoute><ReceiptScreen /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><ParkingHistory /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Info Pages */}
          <Route path="/membership" element={<InfoPage title="Membership" description="Join the ParkEase elite network." />} />
          <Route path="/rewards" element={<InfoPage title="Rewards" description="Earn while you park." />} />
          <Route path="/help" element={<InfoPage title="Help Center" description="We're here to assist you 24/7." />} />
          <Route path="/safety" element={<InfoPage title="Safety Information" description="Your security is our priority." />} />
          <Route path="/terms" element={<InfoPage title="Terms of Service" description="The legal framework of our network." />} />
          <Route path="/privacy" element={<InfoPage title="Privacy Policy" description="How we protect your neural data." />} />
          <Route path="/accessibility" element={<InfoPage title="Accessibility" description="Parking for everyone, everywhere." />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to={token ? "/" : "/landing"} replace />} />
        </Routes>
      </main>
      {token && <Footer />}
      {token && <ChatWidget />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
