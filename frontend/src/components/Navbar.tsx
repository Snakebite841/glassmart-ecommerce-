import { Search, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar glass-panel">
            <div className="container nav-content">
                <Link to="/" className="logo text-gradient">GlassMart</Link>

                <div className="search-bar">
                    <input type="text" placeholder="Search products, brands and categories..." />
                    <button className="search-btn"><Search size={18} /></button>
                </div>

                <div className="nav-actions">
                    <button className="action-btn">
                        <User size={22} />
                        <span>Account</span>
                    </button>

                    <button className="action-btn cart-btn">
                        <ShoppingCart size={22} />
                        <span className="cart-badge">3</span>
                        <span>Cart</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
