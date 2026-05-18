import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

// ─── CSS (convert 1:1 từ mockup HTML) ────────────────────────────────────────
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes pulseRed{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes pulseOrange{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scanline{from{top:0}to{top:100%}}
@keyframes ripple{to{transform:scale(2.2);opacity:0}}

.pm-page{background:#0a1520;min-height:100vh;color:#fff;font-family:system-ui,sans-serif}
.pm-topbar{background:#060e18;border-bottom:0.5px solid rgba(34,211,238,0.15);display:flex;align-items:center;justify-content:space-between;padding:9px 14px}
.pm-tbl{display:flex;align-items:center;gap:8px}
.pm-back{background:rgba(148,163,184,0.08);border:0.5px solid rgba(148,163,184,0.18);border-radius:6px;color:#94a3b8;font-size:11px;padding:4px 9px;display:flex;align-items:center;gap:3px;cursor:pointer}
.pm-back:hover{background:rgba(148,163,184,0.14)}
.pm-pond-nm{color:#e0f2fe;font-size:13px;font-weight:500}
.pm-pond-sub{color:rgba(148,163,184,0.55);font-size:10px;margin-top:1px}
.pm-badge{background:rgba(34,211,238,0.1);border:0.5px solid rgba(34,211,238,0.28);border-radius:5px;color:#22d3ee;font-size:10px;padding:3px 7px;display:flex;align-items:center;gap:4px}
.pm-live-dot{width:5px;height:5px;border-radius:50%;background:#22d3ee;animation:pulse 2s infinite;display:inline-block}
.pm-warn-badge{background:rgba(251,191,36,0.1);border:0.5px solid rgba(251,191,36,0.3);border-radius:5px;color:#fbbf24;font-size:10px;padding:3px 7px}

.pm-body{display:grid;grid-template-columns:1fr 268px;min-height:calc(100vh - 90px)}
.pm-left{display:flex;flex-direction:column;border-right:0.5px solid rgba(34,211,238,0.08)}

.pm-map-wrap{position:relative;flex:1;background:#0a1520;overflow:hidden;min-height:380px}
.pm-grid-bg{position:absolute;inset:0;opacity:.05;background-image:repeating-linear-gradient(0deg,rgba(34,211,238,1) 0,transparent 1px,transparent 38px),repeating-linear-gradient(90deg,rgba(34,211,238,1) 0,transparent 1px,transparent 38px);pointer-events:none}
.pm-scan{position:absolute;left:0;right:0;height:1px;background:rgba(34,211,238,0.12);animation:scanline 5s linear infinite;pointer-events:none}
.pm-map-lbl{position:absolute;top:10px;left:12px;color:rgba(148,163,184,0.45);font-size:9px;letter-spacing:1.5px;text-transform:uppercase}
.pm-map-acts{position:absolute;top:8px;right:10px;display:flex;gap:5px}
.pm-mb{background:rgba(6,14,24,0.8);border:0.5px solid rgba(34,211,238,0.18);border-radius:5px;color:#22d3ee;font-size:9px;padding:3px 8px;cursor:pointer;display:flex;align-items:center;gap:3px}
.pm-mb:hover{opacity:.8}
.pm-mb.edit{color:#fbbf24;border-color:rgba(251,191,36,0.28)}

.pm-pond-shape{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:270px;height:175px;border:1.5px solid rgba(34,211,238,0.22);border-radius:65px 85px 72px 68px;display:flex;align-items:center;justify-content:center;pointer-events:none}
.pm-pond-inner{width:240px;height:150px;background:rgba(14,116,144,0.12);border:0.5px solid rgba(34,211,238,0.12);border-radius:52px 72px 60px 56px;display:flex;align-items:center;justify-content:center}
.pm-pond-txt{color:rgba(34,211,238,0.25);font-size:9px;letter-spacing:2px}

.pm-dev{position:absolute;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer}
.pm-dev-wrap{position:relative;display:flex;align-items:center;justify-content:center}
.pm-dev-ico{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:1px solid;position:relative;z-index:2}
.pm-dev-ico.on-fan{background:rgba(34,211,238,0.15);border-color:rgba(34,211,238,0.5);color:#22d3ee}
.pm-dev-ico.on-sensor{background:rgba(99,102,241,0.15);border-color:rgba(99,102,241,0.45);color:#818cf8}
.pm-dev-ico.on-pump{background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.45);color:#34d399}
.pm-dev-ico.on-cam{background:rgba(168,85,247,0.15);border-color:rgba(168,85,247,0.45);color:#c084fc}
.pm-dev-ico.off{background:rgba(71,85,105,0.15);border-color:rgba(71,85,105,0.3);color:#475569}
.pm-dev-ico.err{background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.5);color:#f87171;animation:pulseRed 1.2s infinite}
.pm-dev-ico.warn{background:rgba(251,191,36,0.12);border-color:rgba(251,191,36,0.45);color:#fbbf24;animation:pulseOrange 1.5s infinite}
.pm-fan-spin{animation:spin 2.5s linear infinite}
.pm-glow-ring{position:absolute;inset:-5px;border-radius:50%;border:1.5px solid rgba(34,211,238,0.3);animation:ripple 2s ease-out infinite;z-index:1}
.pm-glow-ring.err{border-color:rgba(239,68,68,0.4);animation-duration:1s}
.pm-glow-ring.warn{border-color:rgba(251,191,36,0.35);animation-duration:1.4s}
.pm-glow-ring.off{display:none}
.pm-dev-lbl{font-size:9px;color:rgba(148,163,184,0.65);white-space:nowrap;text-align:center;max-width:68px}
.pm-dev-lbl.err{color:#f87171}
.pm-dev.selected .pm-dev-ico{box-shadow:0 0 0 2px #22d3ee}
.pm-dev.selected .pm-dev-ico.err{box-shadow:0 0 0 2px #f87171}

.pm-legend{position:absolute;bottom:10px;left:12px;display:flex;gap:8px}
.pm-leg-item{display:flex;align-items:center;gap:4px;font-size:9px;color:rgba(148,163,184,0.5)}
.pm-leg-dot{width:6px;height:6px;border-radius:50%;display:inline-block}

.pm-cam-section{background:#060e18;border-top:0.5px solid rgba(34,211,238,0.1);padding:10px 12px}
.pm-cam-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.pm-cam-title{color:rgba(148,163,184,0.55);font-size:9px;letter-spacing:1.5px;display:flex;align-items:center;gap:5px}
.pm-cam-rec{width:5px;height:5px;border-radius:50%;background:#ef4444;animation:pulseRed 1.2s infinite;display:inline-block}
.pm-cam-feeds{display:flex;gap:7px}
.pm-cam-feed{flex:1;background:#0a1520;border:0.5px solid rgba(148,163,184,0.1);border-radius:6px;height:90px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
.pm-cam-feed.active{border-color:rgba(34,211,238,0.3)}
.pm-cam-body{display:flex;flex-direction:column;align-items:center;gap:3px}
.pm-cam-ico{font-size:18px;color:rgba(34,211,238,0.2)}
.pm-cam-ico.off{color:rgba(148,163,184,0.15)}
.pm-cam-st{font-size:8px;color:rgba(34,211,238,0.35);letter-spacing:.5px}
.pm-cam-st.off{color:rgba(148,163,184,0.3)}
.pm-cam-badge{position:absolute;bottom:4px;left:5px;background:rgba(0,0,0,0.55);border:0.5px solid rgba(34,211,238,0.18);border-radius:3px;color:#22d3ee;font-size:8px;padding:1px 4px}
.pm-cam-badge.off{color:rgba(148,163,184,0.35);border-color:rgba(148,163,184,0.12)}
.pm-snap-btn{position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.5);border:0.5px solid rgba(148,163,184,0.18);border-radius:3px;color:#94a3b8;font-size:8px;padding:2px 5px;cursor:pointer}
.pm-live-tag{position:absolute;top:4px;left:5px;display:flex;align-items:center;gap:2px;font-size:7px;color:#ef4444;letter-spacing:.5px}

.pm-right{display:flex;flex-direction:column;overflow-y:auto;max-height:calc(100vh - 90px)}
.pm-rpanel{border-bottom:0.5px solid rgba(34,211,238,0.07);padding:11px 13px}
.pm-rpanel:last-child{border-bottom:none}
.pm-rtitle{color:rgba(148,163,184,0.5);font-size:9px;letter-spacing:1.5px;margin-bottom:9px;display:flex;align-items:center;justify-content:space-between;text-transform:uppercase}

.pm-dev-detail{background:rgba(34,211,238,0.05);border:0.5px solid rgba(34,211,238,0.2);border-radius:8px;padding:10px 12px}
.pm-dd-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.pm-dd-name{color:#e0f2fe;font-size:13px;font-weight:500}
.pm-dd-type{font-size:10px;color:rgba(148,163,184,0.45);margin-top:1px}
.pm-dd-status-on{background:rgba(34,211,238,0.12);border:0.5px solid rgba(34,211,238,0.35);border-radius:4px;color:#22d3ee;font-size:9px;padding:2px 7px}
.pm-dd-status-err{background:rgba(239,68,68,0.12);border:0.5px solid rgba(239,68,68,0.35);border-radius:4px;color:#f87171;font-size:9px;padding:2px 7px}
.pm-dd-status-off{background:rgba(71,85,105,0.15);border:0.5px solid rgba(71,85,105,0.3);border-radius:4px;color:#475569;font-size:9px;padding:2px 7px}
.pm-dd-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}
.pm-dd-stat{background:rgba(255,255,255,0.03);border-radius:6px;padding:6px 8px}
.pm-dd-stat-lbl{font-size:9px;color:rgba(148,163,184,0.45);margin-bottom:2px}
.pm-dd-stat-val{font-size:13px;color:#e0f2fe;font-weight:500}

.pm-toggle-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}
.pm-tgl-lbl{color:#94a3b8;font-size:11px}
.pm-tgl{width:32px;height:16px;border-radius:8px;position:relative;cursor:pointer;border:none;padding:0}
.pm-tgl.on{background:rgba(34,211,238,0.35)}
.pm-tgl.off{background:rgba(71,85,105,0.25)}
.pm-tgl-thumb{position:absolute;top:2px;width:12px;height:12px;border-radius:50%;background:#fff;transition:left .18s}

.pm-mode-row{display:flex;gap:5px;margin-bottom:9px}
.pm-mode-btn{flex:1;background:rgba(255,255,255,0.04);border:0.5px solid rgba(148,163,184,0.18);border-radius:5px;color:#94a3b8;font-size:10px;padding:5px;text-align:center;cursor:pointer}
.pm-mode-btn:hover{opacity:.85}
.pm-mode-btn.active-auto{background:rgba(34,211,238,0.1);border-color:rgba(34,211,238,0.35);color:#22d3ee}
.pm-mode-btn.active-manual{background:rgba(251,191,36,0.1);border-color:rgba(251,191,36,0.3);color:#fbbf24}

.pm-sched{background:rgba(99,102,241,0.07);border:0.5px solid rgba(99,102,241,0.2);border-radius:6px;padding:7px 9px;margin-bottom:9px}
.pm-sched-lbl{font-size:9px;color:rgba(148,163,184,0.5);margin-bottom:3px;display:flex;align-items:center;gap:4px}
.pm-sched-time{display:flex;gap:6px;flex-wrap:wrap}
.pm-sched-item{background:rgba(99,102,241,0.1);border-radius:4px;padding:3px 7px;color:#818cf8;font-size:10px}

.pm-estop{width:100%;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.35);border-radius:6px;padding:7px;text-align:center;color:#f87171;font-size:11px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;letter-spacing:.5px}
.pm-estop:hover{background:rgba(239,68,68,0.15)}

.pm-dlist{display:flex;flex-direction:column;gap:5px}
.pm-drow{display:flex;align-items:center;gap:7px;padding:4px 6px;cursor:pointer;border-radius:5px;transition:background .15s}
.pm-drow:hover{background:rgba(255,255,255,0.02)}
.pm-drow.sel{background:rgba(34,211,238,0.05)}
.pm-ddot{width:6px;height:6px;border-radius:50%;flex-shrink:0;display:inline-block}
.pm-dinfo{flex:1;min-width:0}
.pm-dname{color:#cbd5e1;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pm-dtype{color:rgba(148,163,184,0.4);font-size:9px}
.pm-dstat-on{font-size:9px;color:#22d3ee;display:flex;align-items:center;gap:3px;white-space:nowrap}
.pm-dstat-off{font-size:9px;color:#475569;white-space:nowrap}
.pm-dstat-err{font-size:9px;color:#f87171;display:flex;align-items:center;gap:3px;white-space:nowrap}
.pm-dstat-live{font-size:9px;color:#c084fc;display:flex;align-items:center;gap:3px;white-space:nowrap}

.pm-sensor-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.pm-s-card{background:rgba(255,255,255,0.03);border:0.5px solid rgba(148,163,184,0.1);border-radius:8px;padding:8px 10px}
.pm-s-lbl{font-size:9px;color:rgba(148,163,184,0.5);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.pm-s-val{font-size:18px;font-weight:600;line-height:1}
.pm-s-unit{font-size:9px;color:rgba(148,163,184,0.35);margin-left:2px}
.pm-s-bar{height:3px;background:rgba(148,163,184,0.08);border-radius:2px;margin-top:6px;overflow:hidden}
.pm-s-bar-fill{height:100%;border-radius:2px;transition:width .6s}

.pm-ai-card{border-radius:8px;padding:10px 12px}
.pm-risk-reco{margin-top:8px;background:rgba(251,191,36,0.07);border-left:2px solid #fbbf24;border-radius:0 4px 4px 0;padding:5px 8px;color:#fbbf24;font-size:10px;line-height:1.5}

.pm-weather{background:rgba(255,255,255,0.03);border:0.5px solid rgba(148,163,184,0.1);border-radius:8px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between}
.pm-wval{color:#e0f2fe;font-size:13px;font-weight:500}
.pm-wbadge{background:rgba(251,191,36,0.08);border:0.5px solid rgba(251,191,36,0.2);border-radius:4px;padding:2px 6px;color:#fbbf24;font-size:9px}

.pm-empty-hint{background:rgba(255,255,255,0.02);border:0.5px dashed rgba(148,163,184,0.15);border-radius:8px;padding:20px;display:flex;flex-direction:column;align-items:center;gap:8px}
`;

// ─── Data helpers ──────────────────────────────────────────────────────────────
const DEVICE_ICON = { FAN: '💨', SENSOR: '📡', PUMP: '💧', CAMERA: '📷' };
const DEVICE_LABEL = { FAN: 'Quạt Oxy', SENSOR: 'Cảm biến', PUMP: 'Máy bơm', CAMERA: 'Camera' };

function getDevIcoClass(type, status) {
    if (status === 'ERROR') return 'err';
    if (status === 'WARNING') return 'warn';
    if (status === 'OFF') return 'off';
    const map = { FAN: 'on-fan', SENSOR: 'on-sensor', PUMP: 'on-pump', CAMERA: 'on-cam' };
    return map[type] || 'on-sensor';
}
function getGlowClass(status) {
    if (status === 'ERROR') return 'err';
    if (status === 'OFF') return 'off';
    return '';
}
function getGlowColor(type) {
    const map = { SENSOR: 'rgba(129,140,248,0.35)', PUMP: 'rgba(52,211,153,0.35)', CAMERA: 'rgba(192,132,252,0.35)' };
    return map[type] || '';
}

function sensorStatus(key, v) {
    if (v == null) return 'none';
    if (key === 'oxygen')      return v < 4 ? 'danger' : v < 5 ? 'warn' : 'ok';
    if (key === 'ph')          return (v < 6.5 || v > 8.5) ? 'warn' : 'ok';
    if (key === 'temperature') return v > 32 ? 'warn' : 'ok';
    if (key === 'turbidity')   return v > 30 ? 'warn' : 'ok';
    return 'ok';
}
const SC = { ok: '#34d399', warn: '#fbbf24', danger: '#f87171', none: '#475569' };
const SW = { ok: '72%', warn: '52%', danger: '28%', none: '20%' };

// ─── Default device positions for map (fallback nếu API không có posX/posY) ───
const DEFAULT_POSITIONS = [
    { left: '17%',  top: '28%' },
    { right: '18%', top: '26%' },
    { left: '50%',  top: '16%', transform: 'translateX(-50%)' },
    { left: '20%',  bottom: '26%' },
    { right: '20%', bottom: '28%' },
    { left: '50%',  bottom: '16%', transform: 'translateX(-50%)' },
    { right: '36%', top: '58%' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function DeviceOnMap({ device, index, selected, onClick }) {
    const icoClass = `pm-dev-ico ${getDevIcoClass(device.type, device.status)}`;
    const glowClass = `pm-glow-ring ${getGlowClass(device.status)}`;
    const pos = device.posX != null
        ? { left: `${device.posX * 100}%`, top: `${device.posY * 100}%`, transform: 'translate(-50%,-50%)' }
        : DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length];
    const isErr = device.status === 'ERROR';
    const lblClass = `pm-dev-lbl${isErr ? ' err' : ''}`;
    const isFan = device.type === 'FAN' && device.status === 'ON';

    return (
        <div className={`pm-dev${selected ? ' selected' : ''}`} style={{ position: 'absolute', ...pos }} onClick={() => onClick(device)}>
            <div className="pm-dev-wrap">
                <div className={icoClass}>
                    <span className={isFan ? 'pm-fan-spin' : ''}>{DEVICE_ICON[device.type] || '⚙️'}</span>
                </div>
                <div className={glowClass} style={getGlowColor(device.type) ? { borderColor: getGlowColor(device.type) } : {}} />
            </div>
            <div className={lblClass}>{device.name}</div>
        </div>
    );
}

function DeviceDetailPanel({ device, onToggle, onEmergencyStop }) {
    const [mode, setMode] = useState('auto');

    if (!device) return (
        <div className="pm-empty-hint">
            <span style={{ fontSize: '26px', opacity: .25 }}>⚙️</span>
            <p style={{ color: 'rgba(148,163,184,0.4)', fontSize: '11px', textAlign: 'center', lineHeight: 1.5 }}>
                Chọn thiết bị trên bản đồ<br />để xem chi tiết
            </p>
        </div>
    );

    const isOn  = device.status === 'ON';
    const isErr = device.status === 'ERROR';
    const isOff = device.status === 'OFF';

    const statusEl = isErr
        ? <span className="pm-dd-status-err">ERROR</span>
        : isOff
            ? <span className="pm-dd-status-off">OFF</span>
            : <span className="pm-dd-status-on">ON</span>;

    return (
        <motion.div key={device.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}
            className="pm-dev-detail">
            <div className="pm-dd-head">
                <div>
                    <div className="pm-dd-name">{device.name}</div>
                    <div className="pm-dd-type">
                        {DEVICE_LABEL[device.type] || device.type} · {device.location || `Vị trí ${(device.posX||0).toFixed(2)}, ${(device.posY||0).toFixed(2)}`}
                    </div>
                </div>
                {statusEl}
            </div>

            <div className="pm-dd-stats">
                <div className="pm-dd-stat"><div className="pm-dd-stat-lbl">Công suất</div><div className="pm-dd-stat-val">{device.power || '120W'}</div></div>
                <div className="pm-dd-stat"><div className="pm-dd-stat-lbl">Runtime</div><div className="pm-dd-stat-val">{device.runtime || '—'}</div></div>
                <div className="pm-dd-stat"><div className="pm-dd-stat-lbl">Vị trí X</div><div className="pm-dd-stat-val">{device.posX != null ? device.posX.toFixed(2) : '—'}</div></div>
                <div className="pm-dd-stat"><div className="pm-dd-stat-lbl">Vị trí Y</div><div className="pm-dd-stat-val">{device.posY != null ? device.posY.toFixed(2) : '—'}</div></div>
            </div>

            {!isErr && (
                <div className="pm-toggle-row">
                    <span className="pm-tgl-lbl">Bật/Tắt thiết bị</span>
                    <button
                        className={`pm-tgl ${isOn ? 'on' : 'off'}`}
                        onClick={() => onToggle(device.id, isOn ? 'OFF' : 'ON')}
                        aria-label="Toggle thiết bị"
                    >
                        <span className="pm-tgl-thumb" style={{ left: isOn ? '18px' : '2px' }} />
                    </button>
                </div>
            )}

            <div className="pm-mode-row">
                <div className={`pm-mode-btn${mode === 'auto' ? ' active-auto' : ''}`} onClick={() => setMode('auto')}>🤖 AUTO</div>
                <div className={`pm-mode-btn${mode === 'manual' ? ' active-manual' : ''}`} onClick={() => setMode('manual')}>✋ MANUAL</div>
            </div>

            <div className="pm-sched">
                <div className="pm-sched-lbl">🕐 Lịch bật tự động</div>
                <div className="pm-sched-time">
                    <div className="pm-sched-item">01:00 – 04:00</div>
                    <div className="pm-sched-item">10:00 – 12:00</div>
                </div>
            </div>

            <button className="pm-estop" onClick={() => onEmergencyStop(device.id)}>
                🛑 EMERGENCY STOP
            </button>
        </motion.div>
    );
}

function DeviceRow({ device, selected, onClick }) {
    const sc = { ON: 'pm-dstat-on', OFF: 'pm-dstat-off', ERROR: 'pm-dstat-err', CAMERA_ON: 'pm-dstat-live' };
    const dotColor = { ON: '#22d3ee', OFF: '#475569', ERROR: '#f87171', WARNING: '#fbbf24' };
    const isCamera = device.type === 'CAMERA' && device.status === 'ON';
    const statusLabel = isCamera ? '📷 LIVE' : device.status === 'ON' ? `${DEVICE_ICON[device.type]} ACTIVE` : device.status === 'ERROR' ? '⚠ ERROR' : 'OFFLINE';
    const statClass = isCamera ? 'pm-dstat-live' : device.status === 'ON' ? 'pm-dstat-on' : device.status === 'ERROR' ? 'pm-dstat-err' : 'pm-dstat-off';

    return (
        <div className={`pm-drow${selected ? ' sel' : ''}`} onClick={() => onClick(device)}>
            <span className="pm-ddot" style={{ background: dotColor[device.status] || '#475569' }} />
            <div className="pm-dinfo">
                <div className="pm-dname" style={device.status === 'ERROR' ? { color: '#f87171' } : {}}>{device.name}</div>
                <div className="pm-dtype">{DEVICE_LABEL[device.type] || device.type} · {device.location || '—'}</div>
            </div>
            <div className={statClass}>{statusLabel}</div>
        </div>
    );
}

function SensorCard({ label, value, unit, sk }) {
    const c = SC[sk] || SC.none;
    return (
        <div className="pm-s-card">
            <div className="pm-s-lbl">{label}</div>
            <div>
                <span className="pm-s-val" style={{ color: c }}>{value ?? '—'}</span>
                {unit && <span className="pm-s-unit">{unit}</span>}
            </div>
            <div className="pm-s-bar">
                <div className="pm-s-bar-fill" style={{ width: SW[sk] || '20%', background: c }} />
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PondMapPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pond, setPond]                     = useState(null);
    const [devices, setDevices]               = useState([]);
    const [sensorData, setSensorData]         = useState(null);
    const [alerts, setAlerts]                 = useState([]);
    const [prediction, setPrediction]         = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [loading, setLoading]               = useState(true);
    const [lastUpdate, setLastUpdate]         = useState(new Date());

    const fetchPond       = useCallback(async () => { try { const r = await api.get(`/api/ponds/${id}`);          setPond(r.data);          } catch { toast.error('Không tìm thấy ao'); navigate('/ponds'); } }, [id, navigate]);
    const fetchDevices    = useCallback(async () => { try { const r = await api.get(`/api/devices?pondId=${id}`); setDevices(r.data || []); } catch { setDevices([]);    } }, [id]);
    const fetchSensor     = useCallback(async () => { try { const r = await api.get(`/api/sensor/latest/${id}`);  setSensorData(r.data);    } catch { setSensorData(null); } }, [id]);
    const fetchAlerts     = useCallback(async () => { try { const r = await api.get(`/api/alerts?pondId=${id}`);  setAlerts(r.data || []);  } catch { setAlerts([]);      } }, [id]);
    const fetchPrediction = useCallback(async () => { try { const r = await api.get(`/api/predict/latest/${id}`); setPrediction(r.data);   } catch { setPrediction(null); } }, [id]);

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchPond(), fetchDevices(), fetchSensor(), fetchAlerts(), fetchPrediction()]);
            setLoading(false);
        };
        init();
        const iv = setInterval(() => {
            fetchDevices(); fetchSensor(); fetchAlerts(); fetchPrediction();
            setLastUpdate(new Date());
        }, 15000);
        return () => clearInterval(iv);
    }, [fetchPond, fetchDevices, fetchSensor, fetchAlerts, fetchPrediction]);

    const handleToggle = async (deviceId, newStatus) => {
        try {
            await api.put(`/api/devices/${deviceId}`, { status: newStatus });
            setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: newStatus } : d));
            if (selectedDevice?.id === deviceId) setSelectedDevice(p => ({ ...p, status: newStatus }));
            toast.success(`Đã ${newStatus === 'ON' ? 'bật' : 'tắt'} thiết bị`);
        } catch { toast.error('Không thể cập nhật'); fetchDevices(); }
    };

    const handleEmergencyStop = async (deviceId) => {
        if (!window.confirm('⚠️ Xác nhận dừng khẩn cấp?')) return;
        try {
            await api.put(`/api/devices/${deviceId}`, { status: 'OFF' });
            setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'OFF' } : d));
            if (selectedDevice?.id === deviceId) setSelectedDevice(p => ({ ...p, status: 'OFF' }));
            toast.success('Đã dừng khẩn cấp');
        } catch { toast.error('Lệnh dừng thất bại'); }
    };

    const unreadCount = alerts.filter(a => !a.isRead).length;
    const riskLevel   = prediction?.riskLevel || 'UNKNOWN';
    const riskColor   = { LOW: '#34d399', MEDIUM: '#fbbf24', HIGH: '#f87171', UNKNOWN: '#94a3b8' }[riskLevel];

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#0a1520', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navbar />
            <span style={{ color: '#22d3ee', fontSize: '13px', opacity: .6 }}>Đang tải bản đồ...</span>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}>
            <style>{CSS}</style>
            <Navbar />

            <div className="pm-page" style={{ paddingTop: '56px' }}>

                {/* ── TOPBAR ── */}
                <div className="pm-topbar">
                    <div className="pm-tbl">
                        <button className="pm-back" onClick={() => navigate(`/ponds/${id}`)}>← Quay lại</button>
                        <div>
                            <div className="pm-pond-nm">{pond?.name} — Pond Map Chi Tiết</div>
                            <div className="pm-pond-sub">
                                Auto-refresh 15s · {lastUpdate.toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <div className="pm-badge"><span className="pm-live-dot" />REALTIME</div>
                        {unreadCount > 0 && (
                            <div className="pm-warn-badge">🔔 {unreadCount} cảnh báo</div>
                        )}
                    </div>
                </div>

                {/* ── BODY ── */}
                <div className="pm-body">

                    {/* ── LEFT ── */}
                    <div className="pm-left">

                        {/* Map */}
                        <div className="pm-map-wrap">
                            <div className="pm-grid-bg" />
                            <div className="pm-scan" />
                            <div className="pm-map-lbl">DIGITAL TWIN · {(pond?.name || 'AO NUÔI TÔM').toUpperCase()}</div>
                            <div className="pm-map-acts">
                                <div className="pm-mb">🔍 Zoom</div>
                                <div className="pm-mb">⛶ Full</div>
                                <div className="pm-mb edit">✏️ Edit</div>
                            </div>

                            {/* Ao hình oval */}
                            <div className="pm-pond-shape">
                                <div className="pm-pond-inner">
                                    <span className="pm-pond-txt">{(pond?.name || 'AO NUÔI TÔM').toUpperCase()}</span>
                                </div>
                            </div>

                            {/* Thiết bị trên map */}
                            {devices.map((device, i) => (
                                <DeviceOnMap
                                    key={device.id}
                                    device={device}
                                    index={i}
                                    selected={selectedDevice?.id === device.id}
                                    onClick={setSelectedDevice}
                                />
                            ))}

                            {/* Legend */}
                            <div className="pm-legend">
                                {[['ON','#22d3ee'],['OFF','#475569'],['ERROR','#f87171'],['WARN','#fbbf24']].map(([label, color]) => (
                                    <div key={label} className="pm-leg-item">
                                        <span className="pm-leg-dot" style={{ background: color }} />{label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Camera section */}
                        <div className="pm-cam-section">
                            <div className="pm-cam-hdr">
                                <div className="pm-cam-title">
                                    <span className="pm-cam-rec" />
                                    CAMERA GIÁM SÁT LIVE
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <div className="pm-mb" style={{ fontSize: '8px' }} onClick={() => toast.success('📷 Đã chụp tất cả camera')}>
                                        📷 Snapshot tất cả
                                    </div>
                                </div>
                            </div>
                            <div className="pm-cam-feeds">
                                {/* CAM-01 active */}
                                <div className="pm-cam-feed active">
                                    <div className="pm-cam-body">
                                        <span className="pm-cam-ico">📹</span>
                                        <span className="pm-cam-st">ESP32-CAM · Streaming</span>
                                    </div>
                                    <div className="pm-live-tag"><span className="pm-cam-rec" />LIVE</div>
                                    <div className="pm-cam-badge">CAM-01 · 720p</div>
                                    <button className="pm-snap-btn" onClick={() => toast.success('📷 Đã chụp CAM-01')}>📷</button>
                                </div>
                                {/* CAM-02 inactive */}
                                <div className="pm-cam-feed">
                                    <div className="pm-cam-body">
                                        <span className="pm-cam-ico off" style={{ fontSize: '18px' }}>🎥</span>
                                        <span className="pm-cam-st off">Chưa kết nối</span>
                                    </div>
                                    <div className="pm-cam-badge off">CAM-02</div>
                                </div>
                                {/* CAM-03 inactive */}
                                <div className="pm-cam-feed">
                                    <div className="pm-cam-body">
                                        <span className="pm-cam-ico off" style={{ fontSize: '18px' }}>🎥</span>
                                        <span className="pm-cam-st off">Chưa kết nối</span>
                                    </div>
                                    <div className="pm-cam-badge off">CAM-03</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR ── */}
                    <div className="pm-right">

                        {/* Chi tiết thiết bị — ĐẶT LÊN ĐẦU giống mockup */}
                        <div className="pm-rpanel">
                            <div className="pm-rtitle">
                                CHI TIẾT THIẾT BỊ
                                {!selectedDevice && (
                                    <span style={{ color: 'rgba(34,211,238,0.45)', fontSize: '9px', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                                        ← chọn thiết bị trên map
                                    </span>
                                )}
                            </div>
                            <DeviceDetailPanel
                                device={selectedDevice}
                                onToggle={handleToggle}
                                onEmergencyStop={handleEmergencyStop}
                            />
                        </div>

                        {/* Danh sách thiết bị */}
                        <div className="pm-rpanel">
                            <div className="pm-rtitle">DANH SÁCH THIẾT BỊ</div>
                            <div className="pm-dlist">
                                {devices.length === 0
                                    ? <div style={{ color: 'rgba(148,163,184,0.3)', fontSize: '11px', textAlign: 'center', padding: '12px 0' }}>Chưa có thiết bị nào</div>
                                    : devices.map(d => (
                                        <DeviceRow key={d.id} device={d} selected={selectedDevice?.id === d.id} onClick={setSelectedDevice} />
                                    ))
                                }
                            </div>
                        </div>

                        {/* Cảm biến — thêm vào dưới device list */}
                        <div className="pm-rpanel">
                            <div className="pm-rtitle">CẢM BIẾN REALTIME</div>
                            <div className="pm-sensor-grid">
                                <SensorCard label="Nhiệt độ" value={sensorData?.temperature?.toFixed(1)} unit="°C"   sk={sensorStatus('temperature', sensorData?.temperature)} />
                                <SensorCard label="pH"       value={sensorData?.ph?.toFixed(1)}                       sk={sensorStatus('ph', sensorData?.ph)} />
                                <SensorCard label="Oxy (DO)" value={sensorData?.oxygen?.toFixed(1)}    unit="mg/L"    sk={sensorStatus('oxygen', sensorData?.oxygen)} />
                                <SensorCard label="Độ đục"   value={sensorData?.turbidity?.toFixed(0)} unit="NTU"     sk={sensorStatus('turbidity', sensorData?.turbidity)} />
                            </div>
                        </div>

                        {/* AI Risk */}
                        <div className="pm-rpanel">
                            <div className="pm-rtitle">AI RISK ANALYSIS</div>
                            <div className="pm-ai-card" style={{ background: `${riskColor}0d`, border: `0.5px solid ${riskColor}40` }}>
                                <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.5)', marginBottom: '4px' }}>Mức độ nguy cơ hiện tại</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: riskColor, background: `${riskColor}18`, border: `0.5px solid ${riskColor}50`, borderRadius: '4px', padding: '2px 8px', fontSize: '12px', fontWeight: '600' }}>
                                        {riskLevel}
                                    </span>
                                    <span style={{ color: riskColor, fontSize: '22px', fontWeight: '700' }}>
                                        {prediction?.riskPercent ?? '—'}
                                        <small style={{ fontSize: '11px', color: 'rgba(148,163,184,0.4)', fontWeight: '400' }}>/100</small>
                                    </span>
                                </div>
                                {prediction?.recommendation && (
                                    <div className="pm-risk-reco">⚠ {prediction.recommendation}</div>
                                )}
                            </div>
                        </div>

                        {/* Weather */}
                        <div className="pm-rpanel">
                            <div className="pm-rtitle">WEATHER <span className="pm-wbadge">FUTURE</span></div>
                            <div className="pm-weather">
                                <div>
                                    <div style={{ color: 'rgba(148,163,184,0.45)', fontSize: '9px', marginBottom: '3px' }}>
                                        {pond?.location || 'Biên Hòa, Đồng Nai'}
                                    </div>
                                    <div className="pm-wval">29°C · Ẩm 81%</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '22px', color: 'rgba(148,163,184,0.2)' }}>☁️</span>
                                    <div style={{ fontSize: '9px', color: 'rgba(148,163,184,0.35)', marginTop: '2px' }}>Ít mây</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
}