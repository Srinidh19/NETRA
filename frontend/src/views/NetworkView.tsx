import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, Filter, ZoomIn, ZoomOut, Maximize2, Layers,
  ChevronRight, ChevronDown, Shield, AlertTriangle, X,
  MapPin, Network as NetworkIcon, ArrowRight, RefreshCw,
  Eye, EyeOff, Plus, Minus, GitBranch, Clock,
  Wallet, Building2, Link2, Shuffle, AlertCircle,
  CheckCircle, Info, Activity, FileText, ExternalLink,
  Copy, Check, Share2, Sparkles, Move, User, ArrowDownRight,
  Play, Pause, RotateCcw, Compass, Sun, Moon
} from 'lucide-react';
import { api } from '../api';
import { GraphResponse, GraphNode, GraphEdge, AttributionFinding, TracePath } from '../types';

interface NetworkViewProps {
  onInvestigateWallet: (address: string) => void;
  onOpenCase: (caseId: string) => void;
  onNavigateToSahyog: (wallet: string, vasp: string) => void;
}

// Category metadata for professional, institutional intelligence cards
const CATEGORY_META: Record<string, {
  label: string;
  badgeBgLight: string;
  badgeTextLight: string;
  badgeBorderLight: string;
  accentBarLight: string;
  cardBorderLight: string;
  cardBgLight: string;
  
  badgeBgDark: string;
  badgeTextDark: string;
  badgeBorderDark: string;
  accentBarDark: string;
  cardBorderDark: string;
  cardBgDark: string;
  
  icon: string;
}> = {
  'VICTIM': {
    label: 'COMPLAINANT ENTRY',
    badgeBgLight: '#EFF6FF',
    badgeTextLight: '#1D4ED8',
    badgeBorderLight: '#BFDBFE',
    accentBarLight: '#2563EB',
    cardBorderLight: '#93C5FD',
    cardBgLight: '#FFFFFF',

    badgeBgDark: '#1E293B',
    badgeTextDark: '#60A5FA',
    badgeBorderDark: '#2563EB',
    accentBarDark: '#3B82F6',
    cardBorderDark: '#1E3A8A',
    cardBgDark: '#0F172A',
    icon: '👤',
  },
  'MULE': {
    label: 'LAYER-1 RAPID MULE',
    badgeBgLight: '#FEF2F2',
    badgeTextLight: '#B91C1C',
    badgeBorderLight: '#FECACA',
    accentBarLight: '#DC2626',
    cardBorderLight: '#FCA5A5',
    cardBgLight: '#FFFFFF',

    badgeBgDark: '#2D1515',
    badgeTextDark: '#F87171',
    badgeBorderDark: '#7F1D1D',
    accentBarDark: '#EF4444',
    cardBorderDark: '#991B1B',
    cardBgDark: '#181111',
    icon: '⚠️',
  },
  'CONSOLIDATION': {
    label: 'LAYERING & AGGREGATOR',
    badgeBgLight: '#FFFBEB',
    badgeTextLight: '#B45309',
    badgeBorderLight: '#FDE68A',
    accentBarLight: '#D97706',
    cardBorderLight: '#FCD34D',
    cardBgLight: '#FFFFFF',

    badgeBgDark: '#2B1E0D',
    badgeTextDark: '#FBBF24',
    badgeBorderDark: '#78350F',
    accentBarDark: '#F59E0B',
    cardBorderDark: '#B45309',
    cardBgDark: '#1A140B',
    icon: '⛁',
  },
  'VASP': {
    label: 'FIU REGISTERED VASP',
    badgeBgLight: '#ECFDF5',
    badgeTextLight: '#047857',
    badgeBorderLight: '#A7F3D0',
    accentBarLight: '#059669',
    cardBorderLight: '#6EE7B7',
    cardBgLight: '#FFFFFF',

    badgeBgDark: '#0D261E',
    badgeTextDark: '#34D399',
    badgeBorderDark: '#064E3B',
    accentBarDark: '#10B981',
    cardBorderDark: '#047857',
    cardBgDark: '#0B1713',
    icon: '🏛',
  },
  'BRIDGE': {
    label: 'CROSS-CHAIN BRIDGE',
    badgeBgLight: '#F5F3FF',
    badgeTextLight: '#6D28D9',
    badgeBorderLight: '#DDD6FE',
    accentBarLight: '#7C3AED',
    cardBorderLight: '#C4B5FD',
    cardBgLight: '#FFFFFF',

    badgeBgDark: '#201633',
    badgeTextDark: '#A78BFA',
    badgeBorderDark: '#4C1D95',
    accentBarDark: '#8B5CF6',
    cardBorderDark: '#6D28D9',
    cardBgDark: '#140F22',
    icon: '🌉',
  },
};

function getNodeCategoryKey(node: GraphNode): string {
  if (node.risk_level === 'victim' || node.label.toLowerCase().includes('victim') || node.label.toLowerCase().includes('complainant')) {
    return 'VICTIM';
  }
  if (node.category === 'VASP' || node.category === 'VASP Infrastructure' || node.label.toLowerCase().includes('binance') || node.label.toLowerCase().includes('coindcx')) {
    return 'VASP';
  }
  if (node.category === 'Bridge' || node.label.toLowerCase().includes('bridge') || node.label.toLowerCase().includes('stargate')) {
    return 'BRIDGE';
  }
  if (node.risk_level === 'high_mule' || node.label.toLowerCase().includes('mule')) {
    return 'MULE';
  }
  return 'CONSOLIDATION';
}

function getNodeInrEstimate(node: GraphNode): string {
  if (node.metadata?.reported_loss) {
    return node.metadata.reported_loss;
  }
  if (node.balance_usd && node.balance_usd > 0) {
    const inrLakh = (node.balance_usd * 83.5) / 100000;
    if (inrLakh >= 100) {
      return `₹${(inrLakh / 100).toFixed(2)} Cr`;
    }
    return `₹${inrLakh.toFixed(1)} Lakh`;
  }
  const key = getNodeCategoryKey(node);
  if (key === 'VICTIM') return '₹42.8 Lakh';
  if (key === 'MULE') return '₹38.2 Lakh';
  if (key === 'CONSOLIDATION') return '₹32.1 Lakh';
  if (key === 'VASP') return '₹29.96 Lakh';
  return '₹12.4 Lakh';
}

function formatEdgeLabel(edge: GraphEdge): string {
  const inrLakh = (edge.usd_value * 83.5) / 100000;
  const inrStr = inrLakh >= 100 ? `₹${(inrLakh / 100).toFixed(2)}Cr` : `₹${inrLakh.toFixed(1)}L`;
  
  if (edge.relation === 'BRIDGED_TO') {
    return `BRIDGE · ${edge.amount} ${edge.asset} (${inrStr})`;
  }
  if (edge.relation === 'CONSOLIDATED_TO') {
    return `CONSOLIDATE · ${edge.amount} ${edge.asset} (${inrStr})`;
  }
  if (edge.relation === 'SWEPT_TO') {
    return `SWEEP · ${edge.amount} ${edge.asset} (${inrStr})`;
  }
  return `${edge.amount} ${edge.asset} · ${inrStr}`;
}

// --- Forensic Graph Canvas Component ---
const GraphCanvas: React.FC<{
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  traceMode: boolean;
  activePath: TracePath | null;
  layoutMode: 'flow' | 'radial';
  themeMode: 'blueprint' | 'analyst';
  filterChain: string;
  playbackStep: number | null;
  onSelectNode: (node: GraphNode) => void;
  onSelectEdge: (edge: GraphEdge) => void;
}> = ({
  nodes,
  edges,
  selectedNode,
  selectedEdge,
  traceMode,
  activePath,
  layoutMode,
  themeMode,
  filterChain,
  playbackStep,
  onSelectNode,
  onSelectEdge
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [zoom, setZoom] = useState(0.92);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const draggingNode = useRef<string | null>(null);

  // Compute Layout Positions (Forensic 4-Stage Flow vs Concentric Radial Map)
  useEffect(() => {
    if (nodes.length === 0) return;

    const newPos: Record<string, { x: number; y: number }> = {};

    if (layoutMode === 'flow') {
      // Stage 1: Complainant (X = 130)
      // Stage 2: Mules Hop-1 (X = 420)
      // Stage 3: Layering & Bridge Hubs (X = 720)
      // Stage 4: VASP Exchanges (X = 1030)
      const colVictims = nodes.filter(n => getNodeCategoryKey(n) === 'VICTIM');
      const colMules = nodes.filter(n => getNodeCategoryKey(n) === 'MULE');
      const colHubs = nodes.filter(n => getNodeCategoryKey(n) === 'CONSOLIDATION' || getNodeCategoryKey(n) === 'BRIDGE');
      const colVasps = nodes.filter(n => getNodeCategoryKey(n) === 'VASP');

      const placeColumn = (colNodes: GraphNode[], colX: number, startY = 120, spacing = 145) => {
        colNodes.forEach((n, i) => {
          newPos[n.id] = { x: colX, y: startY + i * spacing };
        });
      };

      placeColumn(colVictims.length ? colVictims : [nodes[0]], 130, 180, 150);
      placeColumn(colMules, 420, 110, 140);
      placeColumn(colHubs, 720, 115, 140);
      placeColumn(colVasps, 1030, 135, 145);

      // Remaining nodes placement
      nodes.forEach((n, i) => {
        if (!newPos[n.id]) {
          newPos[n.id] = { x: 570, y: 130 + i * 120 };
        }
      });
    } else {
      // Concentric Radial Investigation Layout
      const centerX = 580, centerY = 280;
      const primary = nodes.find(n => n.is_primary) || nodes[0];
      newPos[primary.id] = { x: centerX, y: centerY };

      const others = nodes.filter(n => n.id !== primary.id);
      const angleStep = (2 * Math.PI) / Math.max(others.length, 1);
      others.forEach((n, i) => {
        const isVasp = getNodeCategoryKey(n) === 'VASP';
        const isVictim = getNodeCategoryKey(n) === 'VICTIM';
        const radius = isVictim ? 190 : isVasp ? 360 : 250;
        const angle = angleStep * i - Math.PI / 2;
        newPos[n.id] = {
          x: centerX + Math.cos(angle) * radius * 1.35,
          y: centerY + Math.sin(angle) * radius * 0.95,
        };
      });
    }

    setPositions(newPos);
  }, [nodes, layoutMode]);

  const getNodeX = (id: string) => positions[id]?.x ?? 400;
  const getNodeY = (id: string) => positions[id]?.y ?? 200;

  // Active path node IDs
  const activePathIds = useMemo(() => {
    const set = new Set<string>();
    if (traceMode && activePath) {
      activePath.hops.forEach(hop => {
        set.add(hop.from_entity);
        set.add(hop.to_entity);
      });
    }
    return set;
  }, [traceMode, activePath]);

  // Playback active hop filter
  const playbackActiveEdgeIds = useMemo(() => {
    if (playbackStep === null || !activePath) return null;
    const activeHop = activePath.hops[playbackStep];
    if (!activeHop) return null;
    return new Set<string>([activeHop.tx_hash]);
  }, [playbackStep, activePath]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
    if (draggingNode.current) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setPositions(prev => ({ ...prev, [draggingNode.current!]: { x, y } }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    draggingNode.current = null;
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    draggingNode.current = nodeId;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.45, Math.min(2.0, z - e.deltaY * 0.001)));
  };

  const isDark = themeMode === 'analyst';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[640px] rounded-lg overflow-hidden select-none border transition-colors shadow-xs ${
        isDark
          ? 'bg-[#0B132B] border-[#1E293B]'
          : 'bg-[#FFFFFF] border-slate-300'
      }`}
    >
      {/* Institutional Micro-Grid Layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)'
            : 'linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* SVG Intelligence Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          {/* Subtle Directional Arrowhead */}
          <marker id="arrow-charcoal" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={isDark ? '#64748B' : '#475569'} />
          </marker>
          {/* Active Highlight Arrowhead */}
          <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill={isDark ? '#38BDF8' : '#0A2540'} />
          </marker>

          {/* Clean Drop Shadow */}
          <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="125%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F172A" floodOpacity={isDark ? 0.4 : 0.08} />
          </filter>
        </defs>

        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {/* Stage Column Backdrop Guides in Flow Mode */}
          {layoutMode === 'flow' && (
            <g className="pointer-events-none opacity-90">
              {/* Stage 1: Complainant */}
              <rect
                x="30" y="45" width="225" height="540" rx="8"
                fill={isDark ? '#0F172A' : '#F8FAFC'}
                stroke={isDark ? '#1E293B' : '#E2E8F0'}
                strokeWidth="1" strokeDasharray="4,4"
              />
              <text x="42" y="70" fill={isDark ? '#60A5FA' : '#1E40AF'} fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">
                STAGE 1 · COMPLAINANT INFLOW
              </text>

              {/* Stage 2: Mule Hop-1 */}
              <rect
                x="320" y="45" width="225" height="540" rx="8"
                fill={isDark ? '#0F172A' : '#F8FAFC'}
                stroke={isDark ? '#1E293B' : '#E2E8F0'}
                strokeWidth="1" strokeDasharray="4,4"
              />
              <text x="332" y="70" fill={isDark ? '#F87171' : '#991B1B'} fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">
                STAGE 2 · RAPID MULE PASS-THROUGH
              </text>

              {/* Stage 3: Layering & Bridge */}
              <rect
                x="610" y="45" width="235" height="540" rx="8"
                fill={isDark ? '#0F172A' : '#F8FAFC'}
                stroke={isDark ? '#1E293B' : '#E2E8F0'}
                strokeWidth="1" strokeDasharray="4,4"
              />
              <text x="622" y="70" fill={isDark ? '#FBBF24' : '#92400E'} fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">
                STAGE 3 · CONSOLIDATION &amp; BRIDGE
              </text>

              {/* Stage 4: VASP Exchanges */}
              <rect
                x="915" y="45" width="245" height="540" rx="8"
                fill={isDark ? '#0F172A' : '#F8FAFC'}
                stroke={isDark ? '#1E293B' : '#E2E8F0'}
                strokeWidth="1" strokeDasharray="4,4"
              />
              <text x="927" y="70" fill={isDark ? '#34D399' : '#065F46'} fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">
                STAGE 4 · VASP CASHOUT &amp; SETTLEMENT
              </text>
            </g>
          )}

          {/* Render Flow Edges */}
          {edges.map((edge) => {
            const sx = getNodeX(edge.source);
            const sy = getNodeY(edge.source);
            const tx = getNodeX(edge.target);
            const ty = getNodeY(edge.target);

            const isTrace = activePathIds.has(edge.source) && activePathIds.has(edge.target);
            const isSelected = selectedEdge?.id === edge.id;
            const isPlaybackMatch = playbackActiveEdgeIds ? playbackActiveEdgeIds.has(edge.transaction_hash) : false;
            
            const isHighlighted = isSelected || isPlaybackMatch || (traceMode && isTrace);
            const isFaded = (traceMode && !isTrace) || (playbackStep !== null && !isPlaybackMatch);

            // Curved line
            const dx = tx - sx;
            const dy = ty - sy;
            const cx1 = sx + dx * 0.45;
            const cy1 = sy;
            const cx2 = sx + dx * 0.55;
            const cy2 = ty;

            const midX = (sx + tx) / 2;
            const midY = (sy + ty) / 2;
            const edgeLabel = formatEdgeLabel(edge);

            const strokeColor = isHighlighted
              ? (isDark ? '#38BDF8' : '#0A2540')
              : (isDark ? '#475569' : '#64748B');

            return (
              <g
                key={edge.id}
                opacity={isFaded ? 0.15 : 1}
                className="transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEdge(edge);
                }}
              >
                {/* Forensic Flow Path */}
                <path
                  d={`M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? 2.8 : 1.5}
                  strokeDasharray={edge.relation === 'BRIDGED_TO' ? '6,3' : 'none'}
                  markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-charcoal)'}
                />

                {/* Transfer Metadata Pill */}
                <g transform={`translate(${midX},${midY})`}>
                  <rect
                    x="-65"
                    y="-10"
                    width="130"
                    height="20"
                    rx="4"
                    fill={isDark ? (isHighlighted ? '#1E293B' : '#0F172A') : (isHighlighted ? '#EFF6FF' : '#FFFFFF')}
                    stroke={isHighlighted ? (isDark ? '#38BDF8' : '#0A2540') : (isDark ? '#334155' : '#CBD5E1')}
                    strokeWidth={isHighlighted ? 1.5 : 1}
                    filter="url(#card-shadow)"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill={isHighlighted ? (isDark ? '#38BDF8' : '#0A2540') : (isDark ? '#CBD5E1' : '#334155')}
                    fontSize="9.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                  >
                    {edgeLabel.length > 22 ? `${edgeLabel.slice(0, 20)}..` : edgeLabel}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Render Authentic Intelligence Cards */}
          {nodes.map((node) => {
            const x = getNodeX(node.id);
            const y = getNodeY(node.id);
            const isSelected = selectedNode?.id === node.id;
            const isOnPath = activePathIds.has(node.id);
            const isFaded = (traceMode && activePathIds.size > 0 && !isOnPath);
            const catMeta = CATEGORY_META[getNodeCategoryKey(node)] || CATEGORY_META['CONSOLIDATION'];
            const inrVal = getNodeInrEstimate(node);

            const cardW = 184;
            const cardH = 78;

            const cardBg = isDark ? catMeta.cardBgDark : catMeta.cardBgLight;
            const cardBorder = isDark ? (isSelected ? '#38BDF8' : catMeta.cardBorderDark) : (isSelected ? '#0A2540' : catMeta.cardBorderLight);
            const badgeBg = isDark ? catMeta.badgeBgDark : catMeta.badgeBgLight;
            const badgeText = isDark ? catMeta.badgeTextDark : catMeta.badgeTextLight;
            const badgeBorder = isDark ? catMeta.badgeBorderDark : catMeta.badgeBorderLight;
            const accentBar = isDark ? catMeta.accentBarDark : catMeta.accentBarLight;

            return (
              <g
                key={node.id}
                transform={`translate(${x - cardW / 2},${y - cardH / 2})`}
                opacity={isFaded ? 0.2 : 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                className="cursor-pointer transition-all"
              >
                {/* Active Selection Ring */}
                {isSelected && (
                  <rect
                    x="-3"
                    y="-3"
                    width={cardW + 6}
                    height={cardH + 6}
                    rx="8"
                    fill="none"
                    stroke={isDark ? '#38BDF8' : '#0A2540'}
                    strokeWidth="2.5"
                    strokeDasharray="4,2"
                  />
                )}

                {/* Node Card Base */}
                <rect
                  x="0"
                  y="0"
                  width={cardW}
                  height={cardH}
                  rx="6"
                  fill={cardBg}
                  stroke={cardBorder}
                  strokeWidth={node.is_primary ? 2 : 1.2}
                  filter="url(#card-shadow)"
                />

                {/* Left Category Accent Strip */}
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height={cardH}
                  rx="2"
                  fill={accentBar}
                />

                {/* Category Header Badge */}
                <rect
                  x="10"
                  y="9"
                  width="98"
                  height="15"
                  rx="2.5"
                  fill={badgeBg}
                  stroke={badgeBorder}
                  strokeWidth="0.8"
                />
                <text
                  x="15"
                  y="20"
                  fontSize="8"
                  fontWeight="bold"
                  fill={badgeText}
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {catMeta.icon} {catMeta.label}
                </text>

                {/* Balance / Reported Loss Tag */}
                <text
                  x={cardW - 10}
                  y="20.5"
                  textAnchor="end"
                  fontSize="9.5"
                  fontWeight="700"
                  fill={isDark ? '#F8FAFC' : '#0F172A'}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {inrVal}
                </text>

                {/* Main Node Label */}
                <text
                  x="10"
                  y="42"
                  fontSize="11.5"
                  fontWeight="700"
                  fill={isDark ? '#F8FAFC' : '#0F172A'}
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {node.label.length > 22 ? `${node.label.slice(0, 20)}..` : node.label}
                </text>

                {/* Address Strip */}
                <text
                  x="10"
                  y="60"
                  fontSize="9.5"
                  fill={isDark ? '#94A3B8' : '#475569'}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.id.slice(0, 10)}...{node.id.slice(-6)}
                </text>

                {/* Network Chain Pill */}
                <text
                  x={cardW - 10}
                  y="60"
                  textAnchor="end"
                  fontSize="8.5"
                  fontWeight="600"
                  fill={isDark ? '#64748B' : '#64748B'}
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {node.chain || 'Ethereum'}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Top-Right Canvas Controls */}
      <div className={`absolute top-3 right-3 flex items-center gap-1 rounded shadow-xs p-1 border ${
        isDark ? 'bg-[#0F172A] border-[#1E293B] text-slate-200' : 'bg-white border-slate-300 text-slate-700'
      }`}>
        <button
          onClick={() => setZoom(z => Math.min(2.0, z + 0.15))}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { setZoom(0.92); setPan({ x: 40, y: 30 }); }}
          className="px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-2xs font-mono font-bold"
          title="Reset View 1:1"
        >
          1:1
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.45, z - 0.15))}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Forensic Legend */}
      <div className={`absolute bottom-3 left-3 rounded px-3 py-1.5 text-2xs shadow-xs flex items-center gap-3 border ${
        isDark ? 'bg-[#0F172A]/90 border-[#1E293B] text-slate-300' : 'bg-white/95 border-slate-300 text-slate-700'
      }`}>
        <span className="font-semibold text-slate-500">Forensic Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
          <span>Complainant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-600" />
          <span>Mule (Hop 1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-600" />
          <span>Consolidator (Hop 2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
          <span>Bridge Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
          <span>VASP Exchange</span>
        </div>
      </div>
    </div>
  );
};

// --- Main Network View Component ---
export const NetworkView: React.FC<NetworkViewProps> = ({
  onInvestigateWallet,
  onOpenCase,
  onNavigateToSahyog,
}) => {
  const [walletInput, setWalletInput] = useState('0x7a912e84c98f5b89a456102dc840b8a1c97012fe');
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [attribution, setAttribution] = useState<AttributionFinding | null>(null);
  const [paths, setPaths] = useState<TracePath[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [traceMode, setTraceMode] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'flow' | 'radial'>('flow');
  const [themeMode, setThemeMode] = useState<'blueprint' | 'analyst'>('blueprint');
  const [filterChain, setFilterChain] = useState<string>('ALL');
  const [playbackStep, setPlaybackStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadGraph(walletInput);
  }, []);

  async function loadGraph(addr: string) {
    setIsLoading(true);
    setSelectedNode(null);
    setSelectedEdge(null);
    try {
      const [g, a, p] = await Promise.all([
        api.getWalletGraph(addr, 2, 12),
        api.getAttribution(addr),
        api.getPaths(addr),
      ]);
      setGraphData(g);
      setAttribution(a);
      setPaths(p);
      if (g?.nodes?.length) {
        setSelectedNode(g.nodes.find(n => n.is_primary) || g.nodes[0]);
      }
    } catch (e) {
      console.error('Error loading graph:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletInput.trim()) {
      loadGraph(walletInput.trim());
    }
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const activePath = paths[0] || null;

  // Trail playback timer
  useEffect(() => {
    let timer: any;
    if (isPlaying && activePath) {
      timer = setInterval(() => {
        setPlaybackStep(curr => {
          if (curr === null) return 0;
          if (curr >= activePath.hops.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return curr + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activePath]);

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-80px)] pb-10">
      {/* Subheader Toolbar */}
      <div className="bg-white border-b border-slate-200">
        <div className="gov-container py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              National Blockchain Intelligence Workspace
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Multi-Chain Forensic Fund Flow Graph
            </h1>
          </div>

          {/* Canvas Controls: Theme + Layout + Path Highlight */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Theme Switcher: Blueprint vs Analyst Slate */}
            <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-slate-50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setThemeMode('blueprint')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  themeMode === 'blueprint' ? 'bg-gov-blue text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Forensic Blueprint Theme (Crisp Paper Grid)"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Forensic Blueprint</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('analyst')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  themeMode === 'analyst' ? 'bg-gov-blue text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Analyst Command Theme (Subdued Slate)"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Analyst Slate</span>
              </button>
            </div>

            {/* Layout Mode */}
            <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-slate-50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLayoutMode('flow')}
                className={`px-3 py-1 rounded transition-colors ${
                  layoutMode === 'flow' ? 'bg-gov-blue text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4-Stage Pipeline (L➔R)
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('radial')}
                className={`px-3 py-1 rounded transition-colors ${
                  layoutMode === 'radial' ? 'bg-gov-blue text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Radial Map
              </button>
            </div>

            {/* Path Highlight Toggle */}
            <button
              type="button"
              onClick={() => {
                setTraceMode(!traceMode);
                setPlaybackStep(null);
                setIsPlaying(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded border transition-all flex items-center gap-1.5 ${
                traceMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-amber-700" />
              <span>{traceMode ? 'Trace Path: ON' : 'Highlight Path'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="gov-container mt-4 space-y-4">
        {/* Quick Search & Target Presets */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
            <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={walletInput}
                onChange={e => setWalletInput(e.target.value)}
                placeholder="Enter wallet address or transaction hash..."
                className="w-full bg-transparent text-xs font-mono text-slate-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-gov-blue hover:bg-gov-blue-2 text-white font-semibold text-xs rounded shadow-xs"
            >
              {isLoading ? 'Tracing...' : 'Trace Target'}
            </button>
          </form>

          {/* Quick Target Chips */}
          <div className="flex items-center gap-1.5 text-2xs overflow-x-auto no-scrollbar">
            <span className="font-semibold text-slate-500 shrink-0">Presets:</span>
            {[
              { label: 'Victim (Pune FIR 412)', addr: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97' },
              { label: 'Syndicate Mule 1', addr: '0x7a912e84c98f5b89a456102dc840b8a1c97012fe' },
              { label: 'Layering Hub', addr: '0x28c6c06298d514db089934071355e5743bf21d60' },
              { label: 'Binance HW6', addr: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be' },
            ].map(p => (
              <button
                key={p.addr}
                type="button"
                onClick={() => {
                  setWalletInput(p.addr);
                  loadGraph(p.addr);
                }}
                className={`px-2 py-1 rounded font-mono border transition-colors shrink-0 ${
                  walletInput.toLowerCase() === p.addr.toLowerCase()
                    ? 'bg-gov-blue text-white border-gov-blue font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Money Trail Scrubber Bar */}
        {activePath && (
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gov-blue" />
                <span>Money Trail Playback:</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2.5 py-1 rounded bg-gov-blue text-white text-xs font-semibold flex items-center gap-1 hover:bg-gov-blue-2"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlaying ? 'Pause' : 'Play Trail'}</span>
                </button>
                <button
                  onClick={() => { setPlaybackStep(null); setIsPlaying(false); }}
                  className="px-2 py-1 rounded border border-slate-200 text-slate-600 text-xs hover:bg-slate-50"
                  title="Reset Playback"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Stepper buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {activePath.hops.map((hop, i) => (
                <button
                  key={hop.step}
                  onClick={() => {
                    setPlaybackStep(i);
                    setIsPlaying(false);
                  }}
                  className={`px-2 py-1 rounded font-mono text-2xs transition-colors shrink-0 border ${
                    playbackStep === i
                      ? 'bg-gov-blue text-white border-gov-blue font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Hop {hop.step}: {hop.action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WORKSPACE GRID: Canvas (8 cols) + Node Inspector (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Visual Graph Canvas (8 cols) */}
          <div className="lg:col-span-8">
            <GraphCanvas
              nodes={graphData?.nodes || []}
              edges={graphData?.edges || []}
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              traceMode={traceMode}
              activePath={activePath}
              layoutMode={layoutMode}
              themeMode={themeMode}
              filterChain={filterChain}
              playbackStep={playbackStep}
              onSelectNode={(node) => {
                setSelectedNode(node);
                setSelectedEdge(null);
              }}
              onSelectEdge={(edge) => {
                setSelectedEdge(edge);
                const targetNode = graphData?.nodes.find(n => n.id === edge.target);
                if (targetNode) setSelectedNode(targetNode);
              }}
            />
          </div>

          {/* Right Node / Edge Inspector Drawer (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg shadow-xs p-4 flex flex-col justify-between">
            {selectedEdge ? (
              /* Transaction Forensics Inspector */
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-2xs font-bold font-mono bg-blue-50 text-blue-800 border border-blue-200">
                      ON-CHAIN TRANSFER EXHIBIT
                    </span>
                    <span className="font-mono text-2xs text-emerald-700 font-bold">
                      {selectedEdge.confidence}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {selectedEdge.relation} ({selectedEdge.asset})
                  </h3>
                </div>

                {/* Amount & Time */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Transfer Amount</div>
                    <div className="font-bold text-slate-900 font-mono text-sm mt-0.5">
                      {selectedEdge.amount} {selectedEdge.asset}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      ≈ ₹{((selectedEdge.usd_value * 83.5) / 100000).toFixed(2)} Lakh
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Timestamp</div>
                    <div className="font-bold text-slate-900 font-mono text-xs mt-0.5">
                      {selectedEdge.timestamp}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Chain: {selectedEdge.chain}
                    </div>
                  </div>
                </div>

                {/* TX Hash */}
                <div>
                  <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Transaction Hash (Proof)
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center justify-between gap-1">
                    <span className="font-mono text-2xs text-slate-800 break-all select-all font-semibold">
                      {selectedEdge.transaction_hash}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedEdge.transaction_hash)}
                      className="p-1 text-slate-400 hover:text-slate-700 shrink-0"
                      title="Copy TX Hash"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Sender & Recipient */}
                <div className="space-y-1.5 text-2xs font-mono">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase">Sender (From):</span>
                    <span className="text-slate-700 break-all">{selectedEdge.source}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase">Recipient (To):</span>
                    <span className="text-slate-900 font-bold break-all">{selectedEdge.target}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-2xs space-y-1">
                  <div className="font-bold text-emerald-800 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    <span>Statutory Evidence Attached</span>
                  </div>
                  <div className="text-emerald-700 font-mono text-[10px]">
                    Exhibit ID: {selectedEdge.evidence_id} · Source: {selectedEdge.source_provider}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToSahyog(selectedEdge.target, 'Binance Global')}
                    className="w-full py-2 bg-gov-blue hover:bg-gov-blue-2 text-white font-semibold text-xs rounded shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Attach to SAHYOG Notice</span>
                  </button>
                </div>
              </div>
            ) : selectedNode ? (
              /* Entity Node Inspector */
              <div className="space-y-4">
                {/* Node Title & Category */}
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-2xs font-bold font-mono bg-slate-100 text-slate-800 border border-slate-200">
                      {getNodeCategoryKey(selectedNode)}
                    </span>
                    <span className="font-mono text-2xs text-slate-900 font-bold">
                      {getNodeInrEstimate(selectedNode)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {selectedNode.label}
                  </h3>
                </div>

                {/* Address Box */}
                <div>
                  <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    On-Chain Address
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center justify-between gap-1">
                    <span className="font-mono text-xs text-slate-800 break-all select-all font-semibold">
                      {selectedNode.id}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedNode.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 shrink-0"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <div className="text-2xs text-slate-500">Blockchain</div>
                    <div className="font-bold text-slate-900 font-mono mt-0.5">
                      {selectedNode.chain || 'Ethereum'}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <div className="text-2xs text-slate-500">Connected Hops</div>
                    <div className="font-bold text-slate-900 font-mono mt-0.5">
                      {selectedNode.known_relationships || 4} Wallets
                    </div>
                  </div>
                </div>

                {/* Forensic Indicator */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-2xs space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-gov-blue" />
                    Forensic Observation:
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedNode.label.toLowerCase().includes('binance')
                      ? 'Identified as Binance Institutional Hot Wallet 6 receiving 70% of stolen victim funds within 43 minutes. Actionable for Section 91 CrPC freeze.'
                      : selectedNode.label.toLowerCase().includes('victim')
                      ? 'Complainant deposit address linked to FIR 412/2026. Stolen capital ₹42.8 Lakh induced via deceptive algorithmic portal.'
                      : 'Syndicate mule pass-through used to fan out stolen capital and evade automated AML tripwires.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onInvestigateWallet(selectedNode.id)}
                    className="w-full py-2 bg-gov-blue hover:bg-gov-blue-2 text-white font-semibold text-xs rounded shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Investigate in Forensic Desk</span>
                  </button>

                  <button
                    onClick={() => onNavigateToSahyog(selectedNode.id, 'Binance Global')}
                    className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs rounded shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-gov-blue" />
                    <span>Section 91 CrPC Freeze (SAHYOG)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <NetworkIcon className="w-8 h-8 text-slate-300 mb-2" />
                <div className="text-xs font-semibold text-slate-600">Select any Entity or Flow Edge</div>
                <div className="text-2xs text-slate-400 mt-0.5">Click any wallet card or transaction link to inspect on-chain balance, attribution findings, and Section 91 notice triggers.</div>
              </div>
            )}

            <div className="text-[10px] text-slate-400 text-center font-mono mt-3 pt-2 border-t border-slate-100">
              NETRA Forensic Canvas · I4C Certified Layout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
