import React from 'react';

const productsData = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 25.50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  },
  {
    id: 3,
    name: 'Ergonomic Optical Mouse',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
  },
  {
    id: 4,
    name: 'Compact 10000mAh Power Bank',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d536819bc1b8?w=500&q=80',
  },
  {
    id: 5,
    name: 'Mechanical Gaming Keyboard',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80',
  },
  {
    id: 6,
    name: 'USB-C Fast Charging Hub',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80',
  },
];

export default function Products() {
  return (
    <div className="products-page">
      <h1 className="products-title">Electronic Gadgets</h1>
      <div className="products-grid">
        {productsData.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <button className="buy-btn">Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
