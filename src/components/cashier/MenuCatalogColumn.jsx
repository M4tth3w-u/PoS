import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { resolveImageUrl } from '../../config/api';

const DEFAULT_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Paket A (1 Jam)',
    category: 'PAKET',
    price: 50000,
    image: '/images/pexels-dovinda-rd-993674313-31336114.jpg',
    desc: 'Paket Main 1 Jam • Meja Standard',
    durationMinutes: 60,
  },
  {
    id: 'pkg-2',
    name: 'Paket B (2 Jam)',
    category: 'PAKET',
    price: 150000,
    image: '/images/pexels-ron-lach-8880727.jpg',
    desc: 'Paket Main 2 Jam • Bonus Minuman',
    durationMinutes: 120,
  },
  {
    id: 'pkg-3',
    name: 'Paket C (3 Jam)',
    category: 'PAKET',
    price: 150000,
    image: '/images/pexels-szymon-shields-1503561-36189469.jpg',
    desc: 'Paket Main 3 Jam (F&B Bundle)',
    durationMinutes: 180,
  },
];

const DEFAULT_DINER_ITEMS = [
  {
    id: 'dine-1',
    name: 'Nasi Goreng Gila',
    category: 'MAKANAN BERAT',
    price: 35000,
    image: '/images/pexels-masuma-rahaman-437541976-37255815.jpg',
    desc: 'Spesial telur + sosis + bakso',
  },
  {
    id: 'dine-2',
    name: 'Ayam Geprek',
    category: 'MAKANAN BERAT',
    price: 45000,
    image: '/images/pexels-angel-ayala-321556-28976230.jpg',
    desc: 'Ayam krispi sambal bawang pedas',
  },
  {
    id: 'dine-3',
    name: 'French Fries',
    category: 'SNACK',
    price: 30000,
    image: '/images/pexels-dhiraj-jain-207743066-12737797.jpg',
    desc: 'Kentang goreng renyah saus cocol',
  },
  {
    id: 'dine-4',
    name: 'French Tea',
    category: 'MINUMAN',
    price: 30000,
    image: '/images/pexels-humayraeva-38921772.jpg',
    desc: 'Teh aromatik khas Prancis',
  },
  {
    id: 'dine-5',
    name: 'Iced Lychee Tea',
    category: 'MINUMAN',
    price: 25000,
    image: '/images/pexels-valeriya-20350170.jpg',
    desc: 'Teh manis dingin dengan buah leci segar',
  },
];

export default function MenuCatalogColumn({
  foods = [],
  foodTypes = [],
  onAddToCart,
}) {
  const [activeCategory, setActiveCategory] = useState('PAKET');
  const [searchQuery, setSearchQuery] = useState('');

  // Map backend foods to menu catalog items
  const backendCatalogFoods = foods.map((f) => {
    let cat = 'MAKANAN BERAT';
    const typeLower = (f.category || '').toLowerCase();
    if (typeLower.includes('snack') || typeLower.includes('cemilan')) {
      cat = 'SNACK';
    } else if (typeLower.includes('drink') || typeLower.includes('minum')) {
      cat = 'MINUMAN';
    } else if (typeLower.includes('paket')) {
      cat = 'PAKET';
    }
    return {
      id: f.id,
      name: f.name,
      category: cat,
      rawCategory: f.category,
      price: f.price,
      image: f.image,
      desc: f.category || 'Menu Resto',
    };
  });

  // Combine items avoiding duplicate names
  const allItems = [
    ...DEFAULT_PACKAGES,
    ...backendCatalogFoods,
    ...DEFAULT_DINER_ITEMS.filter(
      (seed) => !backendCatalogFoods.some((bf) => bf.name.toLowerCase() === seed.name.toLowerCase())
    ),
  ];

  const categories = ['PAKET', 'MAKANAN BERAT', 'SNACK', 'MINUMAN'];

  const filteredItems = allItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const formatPrice = (val) => {
    return new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="cashier-col-menu">
      <div className="pos-col-header">
        <h2 className="pos-col-title">Menu &amp; Paket</h2>
      </div>

      {/* Category Pills Header */}
      <div className="menu-category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`btn-category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quick Search Bar */}
      <div className="menu-search-bar">
        <Search size={15} color="var(--pos-text-muted)" />
        <input
          type="text"
          className="menu-search-input"
          placeholder="Cari menu atau paket..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid of Menu Cards */}
      <div className="menu-items-scroll-area">
        <div className="menu-items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="pos-menu-card">
              <div className="pos-menu-card-img-wrap">
                <img
                  src={resolveImageUrl(item.image)}
                  alt={item.name}
                  className="pos-menu-card-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/hero-food.jpg';
                  }}
                />
              </div>

              <div className="pos-menu-card-body">
                <h3 className="pos-menu-card-title">{item.name}</h3>
                <span className="pos-menu-card-meta">{item.desc}</span>

                <div className="pos-menu-card-footer">
                  <span className="pos-menu-card-price">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    type="button"
                    className="btn-pos-add-item"
                    onClick={() => onAddToCart(item)}
                    title={`Add ${item.name} to order`}
                    aria-label={`Add ${item.name}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="menu-bottom-note">
        Perhitungan Waktu Main dari Server.
      </div>
    </section>
  );
}
