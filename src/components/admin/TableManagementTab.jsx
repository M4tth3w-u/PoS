import React, { useState } from 'react';
import {
  CircleDot,
  Plus,
  Search,
  Edit3,
  Trash2,
  MapPin,
  Layers,
  Wrench,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Gem,
  Star,
} from 'lucide-react';

export default function TableManagementTab({
  tables,
  isLoading,
  errorMessage,
  tableCategories,
  tableStatuses,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteTable,
  onQuickToggleStatus,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (table.location && table.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (table.specifications &&
        table.specifications.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = tierFilter === 'All' || table.type === tierFilter;
    let matchesStatus = true;
    if (statusFilter !== 'All') matchesStatus = table.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalCount = tables.length;
  const readyCount = tables.filter(
    (t) => t.status === 'Ready' || t.status === 'Available'
  ).length;
  const maintenanceCount = tables.filter((t) => t.status === 'Maintenance').length;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getTierIcon = (tier = '') => {
    if (tier.includes('VVIP')) {
      return <Gem size={18} />;
    }
    if (tier.includes('VIP')) {
      return <Star size={18} />;
    }
    return <CircleDot size={18} />;
  };

  const getTierClass = (tier = '') => {
    if (tier.includes('VVIP')) return 'vvip';
    if (tier.includes('VIP')) return 'vip';
    return 'standard';
  };

  return (
    <div className="table-management-tab">
      {isLoading && <p>Loading tables...</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}

      {/* 3 Executive Billiard KPI Cards (Refined & Engaging Layout) */}
      <div className="table-kpi-grid">
        {/* Total Tables */}
        <div className="table-kpi-card">
          <div className="table-kpi-top">
            <div className="table-kpi-icon cyan">
              <CircleDot size={22} />
            </div>
            <span className="table-kpi-pill cyan">
              <TrendingUp size={11} />
              <span>Fleet Active</span>
            </span>
          </div>
          <div className="table-kpi-body">
            <span className="table-kpi-label">Total Tables</span>
            <div className="table-kpi-val-row">
              <span className="table-kpi-val">{totalCount}</span>
              <span className="table-kpi-unit">Billiard Units</span>
            </div>
            <div className="table-kpi-progress">
              <div
                className="table-kpi-bar"
                style={{ width: '100%', background: 'var(--primary)' }}
              />
            </div>
            <span className="table-kpi-subtext">Registered across venue zones</span>
          </div>
        </div>

        {/* Ready / Available */}
        <div className="table-kpi-card">
          <div className="table-kpi-top">
            <div className="table-kpi-icon green">
              <CheckCircle2 size={22} />
            </div>
            <span className="table-kpi-pill green">
              <CheckCircle2 size={11} />
              <span>Ready for Shift</span>
            </span>
          </div>
          <div className="table-kpi-body">
            <span className="table-kpi-label">Ready / Available</span>
            <div className="table-kpi-val-row">
              <span className="table-kpi-val" style={{ color: 'var(--success)' }}>
                {readyCount}
              </span>
              <span className="table-kpi-unit">Operational</span>
            </div>
            <div className="table-kpi-progress">
              <div
                className="table-kpi-bar"
                style={{
                  width: `${totalCount > 0 ? (readyCount / totalCount) * 100 : 0}%`,
                  background: 'var(--success)',
                }}
              />
            </div>
            <span className="table-kpi-subtext">Verified clean cloth & balls set</span>
          </div>
        </div>

        {/* Under Maintenance */}
        <div className="table-kpi-card">
          <div className="table-kpi-top">
            <div className="table-kpi-icon amber">
              <Wrench size={22} />
            </div>
            <span className={`table-kpi-pill ${maintenanceCount > 0 ? 'amber' : 'neutral'}`}>
              <AlertTriangle size={11} />
              <span>{maintenanceCount > 0 ? 'Service Needed' : 'All Clear'}</span>
            </span>
          </div>
          <div className="table-kpi-body">
            <span className="table-kpi-label">Under Maintenance</span>
            <div className="table-kpi-val-row">
              <span
                className="table-kpi-val"
                style={{ color: maintenanceCount > 0 ? '#f59e0b' : '#ffffff' }}
              >
                {maintenanceCount}
              </span>
              <span className="table-kpi-unit">Offline</span>
            </div>
            <div className="table-kpi-progress">
              <div
                className="table-kpi-bar"
                style={{
                  width: `${totalCount > 0 ? (maintenanceCount / totalCount) * 100 : 0}%`,
                  background: '#f59e0b',
                }}
              />
            </div>
            <span className="table-kpi-subtext">Cloth repair or leveling pending</span>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="toolbar-container">
        <div className="toolbar-search-wrap">
          <div className="search-input-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search table number, floor, or cloth..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
          >
            <option value="All">All Tiers</option>
            {tableCategories.map((category) => (
              <option key={category.value} value={category.label}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {tableStatuses
              .filter(
                (status) =>
                  String(status.value) !== '2' &&
                  String(status.label).toLowerCase() !== 'used'
              )
              .map((status) => (
                <option key={status.value} value={status.label}>
                  {status.label}
                </option>
              ))}
          </select>
        </div>

        <button
          type="button"
          className="btn-primary-action"
          onClick={onOpenAddModal}
        >
          <Plus size={18} />
          <span>Add Billiard Table</span>
        </button>
      </div>

      {/* Billiard Tables Grid */}
      {filteredTables.length === 0 ? (
        <div className="tables-empty-state">
          <CircleDot size={44} color="var(--text-muted)" />
          <h3>No Billiard Tables Found</h3>
          <p>
            {searchQuery || tierFilter !== 'All' || statusFilter !== 'All'
              ? 'No tables matched your filter criteria.'
              : 'Add your first billiard table to start managing floor inventory.'}
          </p>
          <button
            type="button"
            className="btn-primary-action"
            onClick={onOpenAddModal}
            style={{ marginTop: '12px' }}
          >
            <Plus size={16} />
            <span>Add Billiard Table</span>
          </button>
        </div>
      ) : (
        <div className="billiard-table-grid">
          {filteredTables.map((table) => {
            const isMaintenance = table.status === 'Maintenance';

            return (
              <div key={table.id} className="billiard-card">
                {/* Card Top: Number, Tier & Status Pill */}
                <div className="billiard-card-header">
                  <div className="table-badge-group">
                    <div className={`billiard-ball-icon ${getTierClass(table.type)}`}>
                      {getTierIcon(table.type)}
                    </div>
                    <div>
                      <h3 className="table-card-title">{table.tableNumber}</h3>
                      <span className={`table-tier-badge ${getTierClass(table.type)}`}>
                        {table.type}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill Badge */}
                  <span
                    className={`table-status-pill ${isMaintenance ? 'maintenance' : 'available'}`}
                  >
                    <span
                      className={`status-dot ${isMaintenance ? 'amber' : 'green'}`}
                    />
                    <span>{table.status || 'Ready'}</span>
                  </span>
                </div>

                {/* Rate Container */}
                <div className="table-rate-box">
                  <span className="rate-caption">Hourly Rental Rate</span>
                  <div className="rate-amount-row">
                    <span className="rate-val">
                      {formatCurrency(table.hourlyRate)}
                    </span>
                    <span className="rate-unit">/ hour</span>
                  </div>
                </div>

                {/* Card Footer Actions (Clean, Uncrowded Layout) */}
                <div className="billiard-card-footer">
                  {onQuickToggleStatus && (
                    <button
                      type="button"
                      className={`btn-status-toggle ${
                        isMaintenance ? 'is-maintenance' : 'is-ready'
                      }`}
                      onClick={() => onQuickToggleStatus(table.id)}
                      title={
                        isMaintenance
                          ? 'Table is fixed? Click to mark Ready'
                          : 'Needs repair? Click to mark Under Maintenance'
                      }
                    >
                      {isMaintenance ? (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Mark as Ready</span>
                        </>
                      ) : (
                        <>
                          <Wrench size={14} />
                          <span>Set Maintenance</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="card-actions-group">
                    <button
                      type="button"
                      className="btn-card-icon edit"
                      onClick={() => onOpenEditModal(table)}
                      title="Edit Table Details"
                      aria-label="Edit Table"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-card-icon delete"
                      onClick={() => onDeleteTable(table.id)}
                      title="Delete Table"
                      aria-label="Delete Table"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
