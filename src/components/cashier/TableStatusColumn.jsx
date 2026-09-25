import React from 'react';
import { Gem, Star, CircleDot } from 'lucide-react';

export default function TableStatusColumn({
  tables = [],
  selectedTableId,
  onSelectTable,
  activeSessions = {},
}) {
  const getTierInfo = (category = '') => {
    const cat = String(category).toUpperCase();
    if (cat.includes('VVIP')) {
      return {
        tierKey: 'vvip',
        label: 'VVIP',
        feltClass: 'felt-vvip',
        color: '#c084fc',
      };
    }
    if (cat.includes('VIP')) {
      return {
        tierKey: 'vip',
        label: 'VIP',
        feltClass: 'felt-vip',
        color: '#fbbf24',
      };
    }
    return {
      tierKey: 'standard',
      label: 'Standard',
      feltClass: 'felt-standard',
      color: '#38bdf8',
    };
  };

  return (
    <aside className="cashier-col-tables">
      <div className="pos-col-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h2 className="pos-col-title">Meja Billiard Status</h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>
            {tables.length} Total Units &bull; Color Coded by Tier
          </span>
        </div>
      </div>

      <div className="tables-scroll-area">
        <div className="tables-grid">
          {tables.map((table, index) => {
            const isSelected = String(table.id) === String(selectedTableId);
            const session = activeSessions[table.id];
            const isTerpakai =
              Boolean(session) ||
              Number(table.statusId) === 2 ||
              table.status?.toLowerCase() === 'in use' ||
              table.status?.toLowerCase() === 'terpakai';
            const isMaintenance =
              Number(table.statusId) === 3 ||
              table.status?.toLowerCase() === 'maintenance';

            const tier = getTierInfo(table.category);

            // Cleanly extract number or clean short name for standardized display
            const numMatch = table.name?.match(/\d+/);
            const displayNum = numMatch
              ? numMatch[0]
              : (table.name?.replace(/^table\s*/i, '').trim() || String(index + 1));
            const displayTag = numMatch
              ? `T${numMatch[0]}`
              : (displayNum.length > 4 ? displayNum.slice(0, 4) : displayNum);
            const displayTitle = numMatch ? `Table ${numMatch[0]}` : (table.name || 'Table');

            return (
              <button
                key={table.id}
                type="button"
                className={`pool-table-card tier-${tier.tierKey} ${isSelected ? 'is-selected' : ''} ${
                  isTerpakai ? 'is-occupied' : isMaintenance ? 'is-maintenance' : 'is-available'
                }`}
                onClick={() => onSelectTable(table)}
                title={`${table.name} (${tier.label}) - ${
                  isTerpakai ? 'Terpakai' : isMaintenance ? 'Maintenance' : 'Kosong'
                }`}
              >
                {/* Pool Table Body (Rails + Pockets + Felt) */}
                <div className={`pool-table-outer tier-${tier.tierKey}`}>
                  {/* Corner & Side Pockets */}
                  <span className="pocket pocket-tl" />
                  <span className="pocket pocket-tc" />
                  <span className="pocket pocket-tr" />
                  <span className="pocket pocket-bl" />
                  <span className="pocket pocket-bc" />
                  <span className="pocket pocket-br" />

                  {/* Felt Canvas with Tier Color: Blue=Standard, Gold=VIP, Purple=VVIP */}
                  <div
                    className={`pool-table-felt ${
                      isMaintenance ? 'felt-gray' : tier.feltClass
                    }`}
                  >
                    {isTerpakai ? (
                      <div className="table-occupied-info">
                        <span className="table-occupied-title">
                          {displayTitle}
                        </span>
                        <span className="table-occupied-status-badge">
                          TERPAKAI
                        </span>
                        {session?.startTime && (
                          <span className="table-occupied-time">
                            {session.startTime}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="table-felt-center">
                        <span
                          className={`table-num-large ${
                            String(displayNum).length > 2 ? 'is-text' : ''
                          }`}
                        >
                          {displayNum}
                        </span>
                        <span className="table-felt-tier-icon">
                          {tier.tierKey === 'vvip' ? (
                            <Gem size={10} />
                          ) : tier.tierKey === 'vip' ? (
                            <Star size={10} />
                          ) : (
                            <CircleDot size={10} />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Meta Row: Table Number + Tier Pill (Strictly Standardized, Never Wraps) */}
                <div className="table-card-meta-row">
                  <span className="table-card-number-tag" title={table.name}>
                    {displayTag}
                  </span>
                  <span className={`table-card-tier-pill ${tier.tierKey}`}>
                    {tier.tierKey === 'vvip' ? (
                      <Gem size={8} />
                    ) : tier.tierKey === 'vip' ? (
                      <Star size={8} />
                    ) : (
                      <CircleDot size={8} />
                    )}
                    <span>{tier.label}</span>
                  </span>
                </div>

                {/* Status Indicator (Fixed Height) */}
                <span
                  className={`pool-table-status-label ${
                    isTerpakai
                      ? 'status-red'
                      : isMaintenance
                      ? 'status-gray'
                      : 'status-green'
                  }`}
                >
                  {isTerpakai ? 'TERPAKAI' : isMaintenance ? 'MAINT' : 'KOSONG'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier Color Reference Legend at bottom */}
      <div className="tables-legend-bar">
        <span className="legend-tier standard" title="Standard: Simonis Tournament Blue">
          <span className="tier-dot standard" /> Standard (Blue)
        </span>
        <span className="legend-tier vip" title="VIP: Luxury Gold Felt">
          <span className="tier-dot vip" /> VIP (Gold)
        </span>
        <span className="legend-tier vvip" title="VVIP: Royal Executive Purple Felt">
          <span className="tier-dot vvip" /> VVIP (Purple)
        </span>
      </div>
    </aside>
  );
}
