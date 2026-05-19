import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AssistantProvider } from './contexts/AssistantContext';
import { CartProvider } from './contexts/CartContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/Product';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Game } from './pages/Game';
import { AssistantPopup } from './components/AssistantPopup';
import { CustomCursor } from './components/CustomCursor';
import { SmoothScroll } from './components/SmoothScroll';
import './index.css';

function App() {
  return (
    <Router>
      <AssistantProvider>
        <CartProvider>
          <SmoothScroll>
            <CustomCursor />
            <AssistantPopup />
            
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/game" element={<Game />} />
            </Routes>
          </SmoothScroll>
        </CartProvider>
      </AssistantProvider>
    </Router>
  );
}

export default App;
