import { useMemo, useState } from 'react';
import FoodData from '../FoodData.js';

const categories = ['All', ...new Set(FoodData.map((food) => food.category))];

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);

  const filteredFoods = useMemo(() => FoodData.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || food.category === category;
    return matchesSearch && matchesCategory;
  }), [search, category]);

  const addToCart = (food) => setCart((items) => {
    const existing = items.find((item) => item.id === food.id);
    return existing
      ? items.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { ...food, quantity: 1 }];
  });

  const changeQty = (id, delta) => setCart((items) =>
    items.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0)
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">F</span> Flavoro</a>
        <nav><a href="#menu">Explore menu</a><a href="#cart">Your cart <span className="cart-count">{cart.reduce((n, i) => n + i.quantity, 0)}</span></a></nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">GOOD FOOD, GOOD MOOD</span>
            <h1>Discover taste.<br /><span>Order delight.</span></h1>
            <p>Fresh favorites, delicious choices, and a little something for every craving.</p>
            <a className="primary-btn" href="#menu">Explore the menu <span>→</span></a>
          </div>
          <div className="hero-art">
            <img src="https://images.unsplash.com/photo- pizza" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85'; }} alt="Fresh pizza" />
            <div className="floating-note"><span>★ 4.8</span><small>Customer favorite</small></div>
          </div>
        </section>

        <section id="menu" className="menu-section">
          <div className="section-heading"><div><span className="eyebrow">MADE FOR YOUR CRAVINGS</span><h2>Explore our menu</h2></div><span className="menu-count">{filteredFoods.length} delicious choices</span></div>
          <div className="toolbar">
            <input aria-label="Search food" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pizza, snacks, desserts..." />
            <div className="category-list">{categories.map((item) => <button key={item} className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)}>{item}</button>)}</div>
          </div>
          <div className="food-grid">
            {filteredFoods.map((food) => <article className="food-card" key={food.id}>
              <div className="food-image"><img src={food.img} alt={food.name} loading="lazy" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=700&q=80'; }} /><span className="rating">★ {food.rating}</span></div>
              <div className="food-info"><div className="food-meta">{food.category}</div><h3>{food.name}</h3><p>{food.desc}</p><div className="food-bottom"><strong>₹{food.price}</strong><button className="add-btn" onClick={() => addToCart(food)}>+ Add</button></div></div>
            </article>)}
          </div>
          {filteredFoods.length === 0 && <p className="empty-state">No dishes found. Try another search.</p>}
        </section>

        <section id="cart" className="cart-section">
          <div className="section-heading"><div><span className="eyebrow">YOUR SELECTION</span><h2>Your cart</h2></div></div>
          {cart.length === 0 ? <p className="empty-state">Your cart is empty. Add something tasty from the menu!</p> : <div className="cart-panel">
            {cart.map((item) => <div className="cart-row" key={item.id}><img src={item.img} alt="" /><div className="cart-item-name"><strong>{item.name}</strong><small>₹{item.price} each</small></div><div className="qty-controls"><button onClick={() => changeQty(item.id, -1)} aria-label={'Remove one ' + item.name}>−</button><span>{item.quantity}</span><button onClick={() => changeQty(item.id, 1)} aria-label={'Add one ' + item.name}>+</button></div><strong>₹{item.price * item.quantity}</strong></div>)}
            <div className="cart-total"><span>Total</span><strong>₹{total}</strong></div><p className="checkout-note">Demo checkout only — online payments are not connected.</p>
          </div>}
        </section>
      </main>
      <footer>Made with care for food lovers · Flavoro</footer>
    </div>
  );
}
