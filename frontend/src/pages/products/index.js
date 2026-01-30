import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';
import Cart from './cart';
import ProductCard from './productCard';

const productsData = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 25.50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    stock: 0
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    stock: 10
  },
  {
    id: 3,
    name: 'Ergonomic Optical Mouse',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    stock: 10
  },
  {
    id: 4,
    name: 'Compact 10000mAh Power Bank',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d536819bc1b8?w=500&q=80',
    stock: 10
  },
  {
    id: 5,
    name: 'Mechanical Gaming Keyboard',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80',
    stock: 10
  },
  {
    id: 6,
    name: 'USB-C Fast Charging Hub',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80',
    stock: 10
  },
];




export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setToastMessage('🎉 Payment successful! Thank you for your purchase.');
      setShowToast(true);
      searchParams.delete('payment');
      setSearchParams(searchParams);
    } else if (paymentStatus === 'cancel') {
      setToastMessage('❌ Payment cancelled. Feel free to continue shopping.');
      setShowToast(true);
      searchParams.delete('payment');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleBuyNow = async (items) => {
    try {
      setIsProcessing(true);
      const isCart = Array.isArray(items);
      const payload = isCart
        ? { items } // Send full cart items array
        : {
          productName: items.name,
          amount: items.price,
          image: items.image,
        };

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://127.0.0.1:7000'}/api/stripe/create-checkout-session`, payload);

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setToastMessage('❌ Error initiating checkout. Please try again.');
      setShowToast(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCart = (product, qty = 1) => {
    if (cartItems.find(item => item.id === product.id)) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: qty }]);
    }
    setToastMessage(`✅ Added ${qty} ${product.name} to cart!`);
    setShowToast(true);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">Electronic Gadgets</h1>
        <div className="cart-btn-container">
          <button
            className='cart-btn'
            disabled={cartItems.length === 0}
            onClick={() => setShowCart(true)}
          >
            🛒 Cart ({cartItems.length})
          </button>
        </div>
      </div>

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="dark" className="text-white">
          <Toast.Header closeVariant="white">
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {showCart && (
        <Cart
          cartItems={cartItems}
          handleBuyNow={handleBuyNow}
          isProcessing={isProcessing}
          onClose={() => setShowCart(false)}
        />
      )}

      <div className="products-grid">
        {productsData.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleCart}
            // isProcessing={isProcessing}
          />
        ))}
      </div>
    </div>
  );
}
