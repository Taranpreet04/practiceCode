import { useState } from "react";

export default function ProductCard({ product, onAddToCart, isProcessing }) {
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => {
        if (product.stock === 0) return;
        setQuantity(prev => (product.stock > 0 && prev >= product.stock ? prev : prev + 1));
    };

    const handleDecrement = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                {/* {product.stock === 0 && (
                    <div style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(255, 0, 0, 0.8)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        Out of Stock
                    </div>
                )} */}
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>

                <div className="quantity-selector">
                    <button
                        className="qty-btn"
                        onClick={handleDecrement}
                        disabled={quantity <= 1 || product.stock === 0}
                    >
                        −
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                        className="qty-btn"
                        onClick={handleIncrement}
                        disabled={product.stock > 0 && quantity >= product.stock}
                    >
                        +
                    </button>
                </div>

                <button
                    className="buy-btn"
                    onClick={() => onAddToCart(product, quantity)}
                    disabled={product.stock === 0 || isProcessing}
                >
                    'Add to cart'
                </button>
            </div>
        </div>
    );
}
