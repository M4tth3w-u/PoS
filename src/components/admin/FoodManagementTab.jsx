import React, { useState } from 'react';
import {
  Search,
  Plus,
  PackagePlus,
  Edit3,
  Trash2,
  Heart,
  Star,
  Boxes,
  AlertTriangle,
} from 'lucide-react';

export default function FoodManagementTab({
  foods,
  onOpenResupply,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteFood,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFoods = foods.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = item.stock <= 5;
    if (stockFilter === 'instock') matchesStock = item.stock > 5;
    if (stockFilter === 'outofstock') matchesStock = item.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const formatPrice = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="food-management-tab">
      {/* Top Controls Toolbar inspired by ProdoCo */}
      <div className="prodoco-toolbar">
        <div className="prodoco-search-wrap">
          <div className="prodoco-search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="prodoco-select-wrap">
            <select
              className="prodoco-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Food">Food / Mains</option>
              <option value="Snack">Snacks & Sides</option>
              <option value="Beverage">Beverages</option>
              <option value="Dessert">Desserts</option>
            </select>
          </div>

          <div className="prodoco-select-wrap">
            <select
              className="prodoco-select"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="All">All Stocks</option>
              <option value="low">Low Stock (≤ 5)</option>
              <option value="instock">In Stock (&gt; 5)</option>
              <option value="outofstock">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="prodoco-btn-add"
          onClick={onOpenAddModal}
        >
          <Plus size={16} />
          <span>Add New Menu</span>
        </button>
      </div>

      {/* Grid of Food Items Inspired by ProdoCo layout */}
      {filteredFoods.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No food items found matching your filters.</p>
          <button
            type="button"
            className="btn-resupply-pill"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setStockFilter('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="prodoco-grid">
          {filteredFoods.map((item) => {
            const isFav = Boolean(favorites[item.id]);
            const dots = item.dots || ['#34D399', '#F87171', '#38BDF8', '#FBBF24'];

            return (
              <div key={item.id} className="prodoco-card">
                {/* Favorite Heart Button */}
                <button
                  type="button"
                  className={`prodoco-heart-btn ${isFav ? 'is-favorited' : ''}`}
                  onClick={() => toggleFavorite(item.id)}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label="Favorite item"
                >
                  <Heart size={16} fill={isFav ? 'var(--alert)' : 'none'} color={isFav ? 'var(--alert)' : 'rgba(255,255,255,0.45)'} />
                </button>

                {/* Product Image Preview */}
                <div className="prodoco-img-container">
                  <img
                    src={item.image || '/images/hero-food.jpg'}
                    alt={item.name}
                    className="prodoco-product-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/hero-food.jpg';
                    }}
                  />
                </div>

                {/* Price & Variant Dots Row */}
                <div className="prodoco-price-dots-row">
                  <div className="prodoco-price-box">
                    <span className="prodoco-price-current">{formatPrice(item.price)}</span>
                  </div>

                  {/* 2x2 or 2x3 variant dot grid */}
                  <div className="prodoco-dots-cluster">
                    {dots.map((dotColor, idx) => (
                      <span
                        key={idx}
                        className="prodoco-dot"
                        style={{ backgroundColor: dotColor }}
                      />
                    ))}
                  </div>
                </div>

                {/* Dish Name & Description */}
                <div className="prodoco-details-box">
                  <div className="prodoco-title-row">
                    <h3 className="prodoco-card-title">{item.name}</h3>
                    <span className="prodoco-category-badge">{item.category}</span>
                  </div>
                  <p className="prodoco-card-desc">
                    {item.description || 'Delicious freshly prepared culinary item with premium local ingredients.'}
                  </p>
                </div>

                {/* Metadata Row: Rating, Stock, Sold */}
                <div className="prodoco-stats-row">
                  <span className="prodoco-stat-item">
                    <Star size={13} fill="#FBBF24" color="#FBBF24" />
                    <span>{item.rating || '4.8'}</span>
                  </span>

                  <span
                    className={`prodoco-stat-item ${
                      item.stock <= 5 ? 'stock-low' : 'stock-normal'
                    }`}
                  >
                    {item.stock <= 5 ? (
                      <AlertTriangle size={13} color="var(--alert)" />
                    ) : (
                      <Boxes size={13} color="var(--primary)" />
                    )}
                    <span>{item.stock} in Stock</span>
                  </span>

                  <span className="prodoco-stat-item sold-badge">
                    {item.soldCount || 100} Sold
                  </span>
                </div>

                {/* Card Action Controls */}
                <div className="prodoco-actions-row">
                  <button
                    type="button"
                    className="btn-prodoco-resupply"
                    onClick={() => onOpenResupply(item)}
                    title="Quick Resupply Stock"
                  >
                    <PackagePlus size={15} />
                    <span>+ Resupply</span>
                  </button>

                  <button
                    type="button"
                    className="btn-prodoco-action"
                    onClick={() => onOpenEditModal(item)}
                    title="Edit Item Details"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    type="button"
                    className="btn-prodoco-action delete"
                    onClick={() => onDeleteFood(item.id)}
                    title="Delete Menu Item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Floating Action Button (FAB) */}
      <button
        type="button"
        className="mobile-fab-btn"
        onClick={onOpenAddModal}
        aria-label="Add New Menu Item"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
