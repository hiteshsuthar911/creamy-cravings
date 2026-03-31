import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Favorites from './pages/Favorites';
import Order from './pages/Order';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Nutrition from './pages/Nutrition';
import Legal from './pages/Legal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminOrders from './pages/AdminOrders';
import AdminFavorites from './pages/AdminFavorites';
import TrackOrder from './pages/TrackOrder';
import Invoice from './pages/Invoice';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/order" element={<Order />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/invoice/:id" element={<Invoice />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/favorites" element={<AdminFavorites />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
