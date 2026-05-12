import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";

const Plans = () => {
    const userId = "66f11bdb87ccaa6ae0ed9d08"
    const [plans, setPlans] = useState([]);
    const [currentPlan, setCurrentPlan] = useState(null)
    const [createPlanModal, setCreatePlanModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        interval: "",
        features: [],
        currency: "",
    });
    useEffect(() => {
        try {
            fetch(`${process.env.REACT_APP_BASE_URL}/api/stripe/plans?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    setPlans(data?.planData)
                    setCurrentPlan(data?.activePlan)
                    console.log("data", data)
                });
        } catch (error) {
            console.error("Error fetching plans:", error);
            toast.error("Error fetching plans");
        }
    }, []);

    console.log("plans==", plans, currentPlan)

    const handleBuyNow = async (plan) => {
        console.log("plan==", plan)
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/stripe/create-subscription-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productName: plan.name,
                amount: plan.price,
                // image: plan.images && plan.images.length > 0 ? plan.images[0] : "",
                priceId: plan.stripePriceId,
                interval: plan.interval,
                planId: plan._id,
                userId,
            }),
        });
        const data = await res.json();
        console.log("data==", data)
        window.location.href = data.url;
    }

    const handleCancelSubscription = async (subscriptionId) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/stripe/cancel-plan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subscriptionId,
                userId,
            }),
        });
        const data = await res.json();
        console.log("data==", data)
        if (data?.success) {
            toast.success(data?.message);
        }
    }

    const handleCreatePlan = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/stripe/create-plan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...formData,
            }),
        });
        const data = await res.json();
        console.log("data==", data)
        if (data?.success) {
            toast.success(data?.message);
            setCreatePlanModal(false);
            setFormData({
                name: "",
                description: "",
                price: "",
                interval: "",
                features: [],
                currency: "",
            });
        }
    }
    return (
        <>
            <div className="plans-wrapper">
                <Button onClick={() => setCreatePlanModal(true)}>Create Plan</Button>
                {currentPlan ? (
                    <div className="active-subscription-section">
                        <div className="active-plan-card">
                            <div className="active-plan-header">
                                <div className="status-badge">Active Subscription</div>
                                <h2 className="active-plan-name">{currentPlan?.name}</h2>
                                <div className="active-plan-price">
                                    ${currentPlan?.price}<span>/{currentPlan?.interval}</span>
                                </div>
                            </div>

                            <div className="active-plan-details">
                                <div className="detail-item">
                                    <span className="detail-label">Status</span>
                                    <span className="detail-value status-active">{currentPlan?.status}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Next Billing</span>
                                    <span className="detail-value">
                                        {currentPlan?.currentPeriodEnd ? new Date(currentPlan.currentPeriodEnd).toDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="active-features-list">
                                <h3>Plan Features:</h3>
                                <ul>
                                    {currentPlan?.features?.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="active-plan-actions">
                                <Button
                                    variant="outline-danger"
                                    className="action-btn"
                                    onClick={() => handleCancelSubscription(currentPlan?._id)}
                                >
                                    Cancel Subscription
                                </Button>
                                <Button variant="primary" className="action-btn">
                                    Upgrade Plan
                                </Button>
                            </div>
                        </div>
                    </div>
                )

                    :
                    <>
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
                                        <div className="price">${plan.price}<span>/{plan.interval}</span></div>
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
                    </>
                }
            </div>
            <Modal show={createPlanModal} onHide={() => setCreatePlanModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Plan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicProductName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" placeholder="Enter amount" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicInterval">
                            <Form.Label>Interval</Form.Label>
                            <Form.Control type="text" placeholder="Enter interval" value={formData.interval} onChange={(e) => setFormData({ ...formData, interval: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFeatures">
                            <Form.Label>Currency</Form.Label>
                            <Form.Control type="text" placeholder="Enter currency" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFeatures">
                            <Form.Label>Features</Form.Label>
                            {formData.features?.map((feature, index) => (
                                <div key={index}>
                                    <Form.Control type="text" placeholder="Enter feature" value={feature} onChange={(e) => {
                                        const newFeatures = [...formData.features];
                                        newFeatures[index] = e.target.value;
                                        setFormData({ ...formData, features: newFeatures });
                                    }} />
                                </div>
                            ))}
                            <Button variant="primary" onClick={() => setFormData({ ...formData, features: [...formData.features, ""] })}>
                                Add Feature
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCreatePlanModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleCreatePlan()}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Plans