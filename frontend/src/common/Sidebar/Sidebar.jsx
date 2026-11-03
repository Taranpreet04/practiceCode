import { NavLink } from 'react-router-dom';
import {
    Home,
    CreditCard,
    Upload,
    Cpu,
    Layers,
    ShoppingBag,
    Image as ImageIcon,
    MessageSquare
} from 'lucide-react';
import './Sidebar.css';

export const menuItems = [
    { path: '/practiceCode/', icon: Home, label: 'Home' },
    { path: '/practiceCode/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/practiceCode/stripe', icon: CreditCard, label: 'Stripe Payment' },
    { path: '/practiceCode/upload-image', icon: Upload, label: 'Upload Image' },
    { path: '/practiceCode/gemini', icon: Cpu, label: 'Gemini AI' },
    { path: '/practiceCode/plans', icon: Layers, label: 'Subscription Plans' },
    { path: '/practiceCode/products', icon: ShoppingBag, label: 'Products' },
    { path: '/practiceCode/pinterest', icon: ImageIcon, label: 'Pinterest' },
    { path: '/practiceCode/image-comment', icon: ImageIcon, label: 'Image Comment' },
    { path: '/practiceCode/import-excel', icon: ImageIcon, label: 'Import Excel' },
    { path: '/practiceCode/property', icon: ImageIcon, label: 'Property' },
    { path: '/practiceCode/scroll', icon: Cpu, label: 'Scroll Test' },
];
const Sidebar = () => {

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <MessageSquare className="sidebar-link-icon" style={{ color: '#00f2fe' }} />
                <span className="sidebar-logo">Componets</span>
            </div>

            <nav className="sidebar-menu">
                <ul className="sidebar-menu-list">
                    {menuItems.map((item) => (
                        <li key={item.path} className="sidebar-menu-item">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? 'sidebar-link active' : 'sidebar-link'
                                }
                            >
                                <item.icon className="sidebar-link-icon" />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="user-avatar">JD</div>
                    <div className="user-info">
                        <span className="user-name">John Doe</span>
                        <span className="user-status">Online</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
