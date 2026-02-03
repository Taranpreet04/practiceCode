import { useEffect, useState } from "react";

const Plans = () => {
    const [plans, setPlans] = useState([]);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/stripe/plans`)
            .then(res => res.json())
            .then(data => setPlans(data));
    }, []);

    console.log("plans==", plans)

    const handleBuyNow = async (plan) => {
        console.log("plan==", plan)
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/stripe/create-subscription-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productName: plan.name,
                amount: plan.unit_amount / 100,
                image: plan.images && plan.images.length > 0 ? plan.images[0] : "",
                priceId: plan.priceId || plan.id,
                interval: plan.interval,
            }),
        });
        const data = await res.json();
        window.location.href = data.url;
    }
    return (
        <div className="plans-wrapper">
            <h1 className="plans-title">Choose Your Plan</h1>
            <div className="plans-container">
                {/* Free Plan */}
                <div className="plan-card free">
                    <div className="plan-header">
                        <h2>Free</h2>
                        <div className="price">$0<span>/mo</span></div>
                    </div>
                    <ul className="plan-features">
                        <li>Basic Chat Access</li>
                        <li>1 User Profile</li>
                        <li>Community Support</li>
                        <li className="disabled">No AI Features</li>
                        <li className="disabled">Limited Storage</li>
                    </ul>
                    <button className="plan-btn">Get Started</button>
                </div>

                {plans?.map((plan, index) => (
                    <div className="plan-card advance">
                        <div className="plan-header">
                            <h2>{plan.name}</h2>
                            <div className="price">${plan.unit_amount / 100}<span>/{plan.interval}</span></div>
                        </div>
                        <ul className="plan-features">
                            <li>All Free Features</li>
                            <li>5 User Profiles</li>
                            <li>Email Support</li>
                            <li>Basic AI Access</li>
                            <li>10GB Storage</li>
                        </ul>
                        <button className="plan-btn" onClick={() => handleBuyNow(plan)}>Buy Now</button>
                    </div>
                ))}
                {/* Basic Plan */}
                {/* <div className="plan-card basic">
                    <div className="popular-badge">Most Popular</div>
                    <div className="plan-header">
                        <h2>Basic</h2>
                        <div className="price">$9.99<span>/mo</span></div>
                    </div>
                    <ul className="plan-features">
                        <li>All Free Features</li>
                        <li>5 User Profiles</li>
                        <li>Email Support</li>
                        <li>Basic AI Access</li>
                        <li>10GB Storage</li>
                    </ul>
                    <button className="plan-btn">Choose Basic</button>
                </div> */}

                {/* Advance Plan */}
                {/* <div className="plan-card advance">
                    <div className="plan-header">
                        <h2>Advance</h2>
                        <div className="price">$29.99<span>/mo</span></div>
                    </div>
                    <ul className="plan-features">
                        <li>All Basic Features</li>
                        <li>Unlimited Profiles</li>
                        <li>24/7 Priority Support</li>
                        <li>Advanced AI Models</li>
                        <li>Unlimited Storage</li>
                    </ul>
                    <button className="plan-btn">Go Pro</button>
                </div> */}
            </div>
        </div>
    )
}

export default Plans