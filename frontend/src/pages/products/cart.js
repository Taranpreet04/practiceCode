export default function Cart({ cartItems, handleBuyNow, onClose, isProcessing }) {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-content" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>Your Cart ({cartItems.length})</h2>
                    <button className="close-cart" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-items-list">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-msg">
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <h4 className="cart-item-name">{item.name}</h4>
                                    <div className="cart-item-price-qty">
                                        ${item.price.toFixed(2)} x {item.quantity} = <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary">
                            <span className="cart-total-label">Total Amount</span>
                            <span className="cart-total-value">${total.toFixed(2)}</span>
                        </div>
                        <button
                            className="checkout-btn"
                            onClick={() => handleBuyNow(cartItems)}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Proceed to Buy Now'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}