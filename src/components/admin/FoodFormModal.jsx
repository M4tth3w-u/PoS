import React, { useState, useRef } from 'react';
import {
  X,
  UtensilsCrossed,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function FoodFormModal({ initialData, onClose, onSave }) {
  const isEditing = Boolean(initialData?.id);
  const fileInputRef = useRef(null);

  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Food');
  const [price, setPrice] = useState(initialData?.price || '');
  const [stock, setStock] = useState(initialData?.stock ?? 10);
  const [description, setDescription] = useState(initialData?.description || '');

  // Image states: 'upload' (from device library) vs 'preset' (project files)
  const isCustomUpload = initialData?.image?.startsWith('data:');
  const [imageMode, setImageMode] = useState(isCustomUpload ? 'upload' : 'upload');
  const [image, setImage] = useState(initialData?.image || '');
  const [rawFile, setRawFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const availableImages = [
    { label: 'Cheeseburger', path: '/images/pexels-angel-ayala-321556-28976230.jpg' },
    { label: 'Crispy Wings', path: '/images/pexels-ron-lach-8880727.jpg' },
    { label: 'Loaded Nachos', path: '/images/pexels-ceylonframes-38572179.jpg' },
    { label: 'Supreme Pizza', path: '/images/pexels-530123908-29150162.jpg' },
    { label: 'Artisan Hot Dog', path: '/images/pexels-dhiraj-jain-207743066-12737797.jpg' },
    { label: 'Iced Coffee', path: '/images/pexels-nadin-sh-78971847-19674142.jpg' },
    { label: 'Fresh Lemon Drink', path: '/images/pexels-soc-nang-d-ng-2150345854-38575652.jpg' },
    { label: 'Berry Sundae', path: '/images/pexels-valeriya-20350170.jpg' },
    { label: 'Pub Feast Spread', path: '/images/spread.jpg' },
    { label: 'Hero Gourmet Dish', path: '/images/hero-food.jpg' },
  ];

  const handleFile = (file) => {
    setUploadError('');
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image format (JPG, PNG, WEBP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setRawFile(file);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialData?.id || Date.now().toString(),
      name: name.trim(),
      category,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      description:
        description.trim() ||
        'Delicious freshly prepared dish with premium ingredients.',
      image: image || '/images/hero-food.jpg',
      imageFile: rawFile, // Hand-off for backend multipart upload
      rating: initialData?.rating || 4.8,
      soldCount: initialData?.soldCount || 100,
      dots: initialData?.dots || ['#34D399', '#F87171', '#38BDF8', '#FBBF24'],
    });
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UtensilsCrossed size={22} color="var(--primary)" />
            <h2 className="modal-title">
              {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
          </div>
          <button type="button" className="btn-modal-close-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Dish Image Selector with Device Library Upload */}
          <div className="modal-form-group">
            <div className="image-mode-header">
              <label className="modal-label" style={{ marginBottom: 0 }}>
                Dish Photo
              </label>

              {/* Mode Switcher Tabs */}
              <div className="image-mode-tabs">
                <button
                  type="button"
                  className={`btn-image-tab ${imageMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setImageMode('upload')}
                >
                  <UploadCloud size={13} />
                  <span>Device Library</span>
                </button>
                <button
                  type="button"
                  className={`btn-image-tab ${imageMode === 'preset' ? 'active' : ''}`}
                  onClick={() => {
                    setImageMode('preset');
                    if (!image || image.startsWith('data:')) {
                      setImage(availableImages[0].path);
                    }
                  }}
                >
                  <ImageIcon size={13} />
                  <span>Project Presets</span>
                </button>
              </div>
            </div>

            {imageMode === 'upload' ? (
              <div className="upload-container">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />

                {image ? (
                  <div className="upload-preview-card">
                    <img
                      src={image}
                      alt="Preview"
                      className="upload-preview-thumb"
                      onError={(e) => {
                        e.target.src = '/images/hero-food.jpg';
                      }}
                    />
                    <div className="upload-preview-info">
                      <span className="upload-preview-name">
                        {fileName || (image.startsWith('data:') ? 'Custom Uploaded Photo' : image.split('/').pop())}
                      </span>
                      <span className="upload-preview-status">
                        <CheckCircle2 size={12} color="var(--success)" />
                        Ready to use
                      </span>
                    </div>
                    <div className="upload-preview-actions">
                      <button
                        type="button"
                        className="btn-preview-action"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="btn-preview-action delete"
                        onClick={() => {
                          setImage('');
                          setRawFile(null);
                          setFileName('');
                        }}
                        title="Remove photo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`image-upload-dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="dropzone-icon">
                      <UploadCloud size={24} />
                    </div>
                    <div className="dropzone-text">
                      <strong className="dropzone-title">
                        Click to browse device library
                      </strong>
                      <span className="dropzone-hint">
                        or drag and drop photo here &bull; PNG, JPG, WEBP (Max 5MB)
                      </span>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="upload-error-pill">
                    <AlertCircle size={13} />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div className="preset-thumb-box">
                  <img
                    src={image || '/images/hero-food.jpg'}
                    alt="Preview"
                    onError={(e) => {
                      e.target.src = '/images/hero-food.jpg';
                    }}
                  />
                </div>

                <select
                  className="modal-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                >
                  {availableImages.map((img) => (
                    <option key={img.path} value={img.path}>
                      {img.label} ({img.path.split('/').pop()})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Item Name */}
          <div className="modal-form-group">
            <label className="modal-label">Item Name</label>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. Classic Cheeseburger"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="modal-form-group">
            <label className="modal-label">Ingredients / Description</label>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. Artisan grilled beef patty, melted cheddar, house sauce..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category & Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="modal-form-group">
              <label className="modal-label">Category</label>
              <select
                className="modal-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">Food / Mains</option>
                <option value="Snack">Snacks & Sides</option>
                <option value="Beverage">Beverages</option>
                <option value="Dessert">Desserts</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Initial Stock</label>
              <input
                type="number"
                min="0"
                className="modal-input"
                placeholder="Stock Units"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Selling Price */}
          <div className="modal-form-group">
            <label className="modal-label">Selling Price (IDR)</label>
            <input
              type="number"
              min="0"
              step="500"
              className="modal-input"
              placeholder="e.g. 45000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer-btns">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit">
              {isEditing ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
