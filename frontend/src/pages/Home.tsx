import HeroSection from '../components/HeroSection';
import { categories } from '../data/categories';
import { ShoppingCart, Star } from 'lucide-react';
import './Home.css';

// Mock products data
const products = {
    Smartphones: [
        { id: 1, name: 'iPhone 15 Pro Max', price: 'GHC 14,500', rating: 4.9, image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400' },
        { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 'GHC 13,800', rating: 4.8, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400' },
        { id: 3, name: 'Google Pixel 8 Pro', price: 'GHC 10,200', rating: 4.7, image: 'https://images.unsplash.com/photo-1598327105654-3232c9431835?auto=format&fit=crop&q=80&w=400' },
        { id: 4, name: 'OnePlus 12', price: 'GHC 8,500', rating: 4.6, image: 'https://images.unsplash.com/photo-1598501254881-229202ae2d32?auto=format&fit=crop&q=80&w=400' },
    ],
    Laptops: [
        { id: 5, name: 'MacBook Pro M3 Max', price: 'GHC 32,000', rating: 5.0, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400' },
        { id: 6, name: 'Dell XPS 15', price: 'GHC 21,000', rating: 4.8, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400' },
        { id: 7, name: 'ASUS ROG Zephyrus G14', price: 'GHC 18,500', rating: 4.9, image: 'https://images.unsplash.com/photo-1620021666014-a95724bc2bb4?auto=format&fit=crop&q=80&w=400' },
        { id: 8, name: 'Lenovo ThinkPad X1', price: 'GHC 19,200', rating: 4.7, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400' },
    ]
};

export default function Home() {
    const handleBuyNow = async (productId: number, productName: string, priceString: string) => {
        // Quick parse for amount, e.g. 'GHC 14,500' -> 14500
        const numericPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));

        try {
            const res = await fetch(`http://localhost:5000/api/products/${productId}/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: numericPrice, productName })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Success! ${data.message}`);
            } else {
                alert('Error processing purchase.');
            }
        } catch (error) {
            alert('Failed to connect to the backend.');
        }
    };

    return (
        <div className="home-container">
            <div className="container">
                <HeroSection />

                {/* Render Product Sections implicitly by Category */}
                <div className="product-sections">
                    {Object.entries(products).map(([categoryName, categoryProducts], index) => {
                        const catInfo = categories.find(c => c.name === categoryName);
                        const Icon = catInfo?.icon;

                        return (
                            <section key={categoryName} className="category-section animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                                <div className="section-header">
                                    <h2 className="section-title text-gradient">
                                        {Icon && <Icon size={32} className="title-icon" />}
                                        {categoryName}
                                    </h2>
                                    <a href="#" className="view-all">View All</a>
                                </div>

                                <div className="product-grid">
                                    {categoryProducts.map(product => (
                                        <div key={product.id} className="product-card glass-panel">
                                            <div className="product-image-container">
                                                <img src={product.image} alt={product.name} className="product-image" />
                                                <span className="stock-badge">In Stock</span>
                                                <div className="card-actions">
                                                    <button className="btn btn-primary buy-now-btn" onClick={() => handleBuyNow(product.id, product.name, product.price)}>
                                                        Buy Now
                                                    </button>
                                                    <button className="btn btn-primary add-to-cart-btn">
                                                        <ShoppingCart size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="product-details">
                                                <div className="rating">
                                                    <Star size={14} className="star-icon filled" />
                                                    <span className="rating-text">{product.rating}</span>
                                                </div>
                                                <h3 className="product-title">{product.name}</h3>
                                                <p className="product-price">{product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
