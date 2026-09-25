import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Heart,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { resolveImageUrl } from '../../config/api';

export default function FoodManagementTab({
  foods,
  foodTypeOptions,
  errorMessage,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteFood,
  onToggleAvailability,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFoods = foods.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'All' || item.category === selectedType;

    const matchesAvailability =
      availabilityFilter === 'All' ||
      (availabilityFilter === 'available' && item.isAvailable) ||
      (availabilityFilter === 'unavailable' && !item.isAvailable);

    return matchesSearch && matchesType && matchesAvailability;
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
      {errorMessage && <p role="alert">{errorMessage}</p>}

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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Food Types</option>
              {foodTypeOptions.map((type) => (
                <option key={type.value} value={type.label}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="prodoco-select-wrap">
            <select
              className="prodoco-select"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="All">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
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
              setSelectedType('All');
              setAvailabilityFilter('All');
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
                    src={resolveImageUrl(item.image)}
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
                  <p className="prodoco-card-desc">{item.status || 'Status makanan belum tersedia'}</p>
                </div>

                {/* Metadata Row: Availability */}
                <div className="prodoco-stats-row">
                  <span className="prodoco-stat-label">Availability</span>
                  <span
                    className={`prodoco-stat-item ${item.isAvailable ? 'stock-normal' : 'stock-low'}`}
                  >
                    {item.isAvailable ? (
                      <CheckCircle2 size={13} color="var(--success)" />
                    ) : (
                      <XCircle size={13} color="var(--alert)" />
                    )}
                    <span>{item.isAvailable ? 'Available' : 'Unavailable'}</span>
                  </span>
                </div>

                {/* Card Action Controls */}
                <div className="prodoco-actions-row">
                  <button
                    type="button"
                    className={`btn-prodoco-action ${item.isAvailable ? 'delete' : 'success'}`}
                    onClick={() => onToggleAvailability(item.id)}
                    title={item.isAvailable ? 'Set menu unavailable' : 'Set menu available'}
                    aria-label={item.isAvailable ? 'Set menu unavailable' : 'Set menu available'}
                  >
                    {item.isAvailable ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                  </button>

                  <button
                    type="button"
                    className="btn-prodoco-action edit"
                    onClick={() => onOpenEditModal(item)}
                    title="Edit Item Details"
                    aria-label="Edit Item Details"
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
