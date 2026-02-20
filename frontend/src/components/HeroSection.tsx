import { categories } from '../data/categories';
import { ArrowRight, ChevronRight, Zap } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
    return (
        <section className="hero-section">
            {/* Left Column: Vertical Category Menu */}
            <aside className="category-menu glass-panel animate-fade-in">
                <ul className="category-list">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <li key={cat.id} className="category-item">
                                <a href="#" className="category-link">
                                    <span className="category-title">
                                        <Icon size={20} className="category-icon" />
                                        {cat.name}
                                    </span>
                                    <ChevronRight size={16} className="category-chevron" />
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            {/* Middle Column: Hero Slider */}
            <div className="hero-slider glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="slider-content">
                    <span className="glass-pill text-gradient" style={{ display: 'inline-block', marginBottom: '16px' }}>New Arrival</span>
                    <h1 className="hero-title">
                        <span className="text-gradient">MacBook Pro M3</span><br />
                        Mind-Blowing Speed.
                    </h1>
                    <p className="hero-subtitle">
                        Get the ultimate performance machine at unbeatable prices. Trade-in options available.
                    </p>
                    <div className="hero-price">
                        <span className="current-price">GHC 14,999</span>
                        <span className="original-price">GHC 16,500</span>
                    </div>
                    <button className="btn btn-primary hero-btn">
                        Shop Now <ArrowRight size={20} />
                    </button>
                </div>
                <div className="slider-image-wrapper">
                    <img
                        src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3"
                        alt="MacBook Pro"
                        className="slider-image"
                    />
                </div>

                {/* Slider Controls */}
                <div className="slider-dots">
                    <div className="dot active"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>

            {/* Right Column: Quick Deals */}
            <aside className="quick-deals animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="deals-header">
                    <Zap size={20} className="text-gradient" />
                    <h3 className="text-gradient">Quick Deals</h3>
                </div>

                <div className="deal-card glass-panel">
                    <div className="deal-image">
                        <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400" alt="Smartwatch" />
                    </div>
                    <div className="deal-info">
                        <h4>Apple Watch Ultra</h4>
                        <div className="deal-price">
                            <span className="price">GHC 4,200</span>
                            <span className="discount">-15%</span>
                        </div>
                    </div>
                </div>

                <div className="deal-card glass-panel">
                    <div className="deal-image">
                        <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400" alt="Headphones" />
                    </div>
                    <div className="deal-info">
                        <h4>Sony WH-1000XM5</h4>
                        <div className="deal-price">
                            <span className="price">GHC 3,500</span>
                            <span className="discount">-20%</span>
                        </div>
                    </div>
                </div>

            </aside>
        </section>
    );
}
