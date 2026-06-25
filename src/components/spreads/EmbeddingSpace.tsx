import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import rawData from '../../data/embeddingSpace.json';
import { useBook } from '../../contexts/BookContext';
import {
  embedQuery,
  subscribeModelState,
  preloadModel,
  type ModelLoadState,
} from '../../lib/embeddingModel';
import {
  findNearestNeighbors,
  computeWeightedCentroid,
  hasStrongMatch,
} from '../../lib/similarity';

type NodeT = {
  id: string;
  label: string;
  cluster: string;
  type: "skill" | "project";
  x: number;
  y: number;
  vector: number[];
};

// Real data, loaded from embeddingSpace.json instead of the hardcoded array.
const NODES: NodeT[] = (rawData as any[]).map((d) => ({
  id: d.id,
  label: d.label,
  cluster: d.cluster,
  type: d.type as "skill" | "project",
  x: d.x,
  y: d.y,
  vector: d.embedding as number[],
}));

const CLUSTERS: Record<string, { name: string; color: string; glow: string; cx: number; cy: number }> = {
  ml:       { name: "Machine Learning",   color: "#6ee7ff", glow: "#22d3ee", cx: 18, cy: 32 },
  cv:       { name: "Computer Vision",    color: "#a78bfa", glow: "#8b5cf6", cx: 64, cy: 18 },
  crypto:   { name: "Cryptography",       color: "#fb7185", glow: "#f43f5e", cx: 83, cy: 58 },
  backend:  { name: "Backend & Infra",    color: "#fbbf24", glow: "#f59e0b", cx: 58, cy: 82 },
  nlp:      { name: "Natural Language",   color: "#34d399", glow: "#10b981", cx: 22, cy: 74 },
  research: { name: "Research Projects",  color: "#f0abfc", glow: "#e879f9", cx: 44, cy: 44 },
};

// Map of project node id -> spread index, for the "View project" tooltip button.
const PROJECT_SPREAD_MAP: Record<string, number> = {
  'railwaypq': 3,
  'archintel': 3,
  'nexusstorage': 4,
  'highcourtner': 4,
};

// Deterministic pseudo-random for backdrop stars
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function EmbeddingSpace() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hover, setHover] = useState<NodeT | null>(null);
  const [query, setQuery] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [noResults, setNoResults] = useState(false);
  const [topProjectMatch, setTopProjectMatch] = useState<NodeT | null>(null);
  const nodePosRef = useRef({ x: 0, y: 0 });

  const { goToSpread } = useBook();

  // ── Semantic search state ──────────────────────────────────────────────────
  const [modelState, setModelState] = useState<ModelLoadState>('idle');
  const [queryResults, setQueryResults] = useState<{
    position: { x: number; y: number };
    neighbors: Array<{ node: NodeT; score: number }>;
  } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preload the embedding model shortly after mount.
  useEffect(() => {
    const unsub = subscribeModelState(setModelState);
    const timer = setTimeout(() => preloadModel(), 800);
    return () => { unsub(); clearTimeout(timer); };
  }, []);

  const handleQuery = async (text: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.length < 3) {
      setNoResults(false);
      setQueryResults(null);
      setTopProjectMatch(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setNoResults(false);
      setTopProjectMatch(null);
      try {
        const vector = await embedQuery(text);
        const neighbors = findNearestNeighbors(vector, NODES as any, 3);
        if (!hasStrongMatch(neighbors, 0.35)) {
          setNoResults(true);
          setQueryResults(null);
          setTopProjectMatch(null);
          return;
        }
        const position = computeWeightedCentroid(neighbors as any);
        setQueryResults({ position, neighbors: neighbors as any });
        const topMatch = neighbors[0];
        if (topMatch?.node.type === 'project' && PROJECT_SPREAD_MAP[topMatch.node.id]) {
          setTopProjectMatch(topMatch.node);
        } else {
          setTopProjectMatch(null);
        }
      } catch (e) {
        console.error('Query failed:', e);
      }
    }, 400);
  };

  // Living starfield: drifting parallax stars + shooting stars
  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);

    type Star = { x: number; y: number; z: number; r: number; tw: number; tws: number };
    type Shoot = { x: number; y: number; vx: number; vy: number; life: number; max: number; len: number };
    let stars: Star[] = [];
    let shoots: Shoot[] = [];

    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.floor((W * H) / 6000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 0.9 + 0.1, // depth 0.1..1
        r: Math.random() * 1.1 + 0.2,
        tw: Math.random() * Math.PI * 2,
        tws: 0.5 + Math.random() * 1.5,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const spawnShoot = () => {
      const fromLeft = Math.random() < 0.5;
      const angle = (Math.PI / 6) + Math.random() * (Math.PI / 8); // ~30-52deg
      const speed = 9 + Math.random() * 7;
      const vx = (fromLeft ? 1 : -1) * Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const x = fromLeft ? -50 : W + 50;
      const y = Math.random() * H * 0.6;
      shoots.push({ x, y, vx, vy, life: 0, max: 60 + Math.random() * 40, len: 120 + Math.random() * 140 });
    };

    let last = performance.now();
    let nextShoot = 1200 + Math.random() * 2500;
    let acc = 0;

    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      acc += dt;
      if (acc > nextShoot) {
        acc = 0;
        nextShoot = 1500 + Math.random() * 4000;
        spawnShoot();
      }

      ctx.clearRect(0, 0, W, H);

      // drifting parallax stars
      for (const s of stars) {
        s.x += s.z * 0.04 * (dt / 16);
        s.y += s.z * 0.015 * (dt / 16);
        if (s.x > W + 2) s.x = -2;
        if (s.y > H + 2) s.y = -2;
        s.tw += (dt / 1000) * s.tws;
        const alpha = (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s.tw))) * (0.4 + s.z * 0.6);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }

      // shooting stars
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i];
        sh.x += sh.vx * (dt / 16);
        sh.y += sh.vy * (dt / 16);
        sh.life += dt;
        const t = sh.life / sh.max / 16;
        const fade = Math.max(0, 1 - Math.abs(t - 0.5) * 2);
        const tailX = sh.x - (sh.vx / Math.hypot(sh.vx, sh.vy)) * sh.len;
        const tailY = sh.y - (sh.vy / Math.hypot(sh.vx, sh.vy)) * sh.len;
        const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
        grad.addColorStop(0.3, `rgba(180,220,255,${0.6 * fade})`);
        grad.addColorStop(1, "rgba(180,220,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        // bright head
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${fade})`;
        ctx.arc(sh.x, sh.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        if (sh.x < -200 || sh.x > W + 200 || sh.y > H + 200) shoots.splice(i, 1);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    const wrap = wrapRef.current!;
    let w = wrap.clientWidth;
    let h = wrap.clientHeight;

    const render = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      svg.attr("viewBox", `0 0 ${w} ${h}`).attr("width", w).attr("height", h);

      svg.selectAll("*").remove();

      const defs = svg.append("defs");

      // Radial nebula gradients per cluster
      Object.entries(CLUSTERS).forEach(([key, c]) => {
        const g = defs
          .append("radialGradient")
          .attr("id", `neb-${key}`)
          .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
        g.append("stop").attr("offset", "0%").attr("stop-color", c.glow).attr("stop-opacity", 0.45);
        g.append("stop").attr("offset", "55%").attr("stop-color", c.color).attr("stop-opacity", 0.08);
        g.append("stop").attr("offset", "100%").attr("stop-color", c.color).attr("stop-opacity", 0);
      });

      // Star gradient (white core to transparent)
      const starG = defs.append("radialGradient").attr("id", "star-core");
      starG.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff").attr("stop-opacity", 1);
      starG.append("stop").attr("offset", "40%").attr("stop-color", "#ffffff").attr("stop-opacity", 0.8);
      starG.append("stop").attr("offset", "100%").attr("stop-color", "#ffffff").attr("stop-opacity", 0);

      // Glow filter
      const f = defs.append("filter").attr("id", "glow").attr("x", "-100%").attr("y", "-100%").attr("width", "300%").attr("height", "300%");
      f.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "b");
      const merge = f.append("feMerge");
      merge.append("feMergeNode").attr("in", "b");
      merge.append("feMergeNode").attr("in", "SourceGraphic");

      const bigGlow = defs.append("filter").attr("id", "bigGlow").attr("x", "-200%").attr("y", "-200%").attr("width", "500%").attr("height", "500%");
      bigGlow.append("feGaussianBlur").attr("stdDeviation", "8").attr("result", "b");
      const m2 = bigGlow.append("feMerge");
      m2.append("feMergeNode").attr("in", "b");
      m2.append("feMergeNode").attr("in", "SourceGraphic");

      // Deep space gradient bg
      const bg = defs.append("radialGradient").attr("id", "spaceBg").attr("cx", "50%").attr("cy", "45%").attr("r", "75%");
      bg.append("stop").attr("offset", "0%").attr("stop-color", "#0b1029");
      bg.append("stop").attr("offset", "60%").attr("stop-color", "#05060f");
      bg.append("stop").attr("offset", "100%").attr("stop-color", "#000003");

      svg.append("rect").attr("width", w).attr("height", h).attr("fill", "url(#spaceBg)");

      // Nebula clouds per cluster
      const nebLayer = svg.append("g").attr("class", "nebula-layer");
      Object.entries(CLUSTERS).forEach(([key, c]) => {
        nebLayer
          .append("ellipse")
          .attr("cx", (c.cx / 100) * w)
          .attr("cy", (c.cy / 100) * h)
          .attr("rx", Math.min(w, h) * 0.28)
          .attr("ry", Math.min(w, h) * 0.22)
          .attr("fill", `url(#neb-${key})`)
          .attr("opacity", 0.9);
      });

      // Backdrop tiny stars
      const rand = mulberry32(42);
      const bgStars = svg.append("g").attr("class", "bg-stars");
      const STAR_COUNT = Math.floor((w * h) / 2200);
      for (let i = 0; i < STAR_COUNT; i++) {
        const cx = rand() * w;
        const cy = rand() * h;
        const r = rand() * 1.2 + 0.2;
        const o = rand() * 0.7 + 0.15;
        const s = bgStars
          .append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", r)
          .attr("fill", "#ffffff")
          .attr("opacity", o);
        // twinkle
        const dur = 1500 + rand() * 4000;
        s.append("animate")
          .attr("attributeName", "opacity")
          .attr("values", `${o};${Math.max(0.05, o - 0.5)};${o}`)
          .attr("dur", `${dur}ms`)
          .attr("repeatCount", "indefinite");
      }

      // Distant dust streaks
      const dust = svg.append("g").attr("opacity", 0.25);
      for (let i = 0; i < 6; i++) {
        dust
          .append("ellipse")
          .attr("cx", rand() * w)
          .attr("cy", rand() * h)
          .attr("rx", 200 + rand() * 300)
          .attr("ry", 1 + rand() * 2)
          .attr("fill", "#7dd3fc")
          .attr("opacity", 0.07)
          .attr("transform", `rotate(${rand() * 360} ${rand() * w} ${rand() * h})`);
      }

      // Constellation lines (within cluster, nearest neighbours)
      const lineLayer = svg.append("g").attr("class", "lines");
      const byCluster = d3.group(NODES, (d) => d.cluster);
      byCluster.forEach((arr) => {
        // connect each node to its nearest 2 in cluster
        arr.forEach((a) => {
          const others = arr
            .filter((b) => b.id !== a.id)
            .map((b) => ({ b, d: Math.hypot(a.x - b.x, a.y - b.y) }))
            .sort((x, y) => x.d - y.d)
            .slice(0, 2);
          others.forEach(({ b }) => {
            lineLayer
              .append("line")
              .attr("x1", (a.x / 100) * w)
              .attr("y1", (a.y / 100) * h)
              .attr("x2", (b.x / 100) * w)
              .attr("y2", (b.y / 100) * h)
              .attr("stroke", CLUSTERS[a.cluster].color)
              .attr("stroke-opacity", 0.18)
              .attr("stroke-width", 0.6);
          });
        });
      });

      // Nodes
      const nodeLayer = svg.append("g").attr("class", "nodes");
      const g = nodeLayer
        .selectAll("g.node")
        .data(NODES)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${(d.x / 100) * w},${(d.y / 100) * h})`)
        .style("cursor", "pointer");

      // outer glow halo
      g.append("circle")
        .attr("r", (d) => (d.type === "project" ? 22 : 14))
        .attr("fill", (d) => CLUSTERS[d.cluster].glow)
        .attr("opacity", 0.18)
        .attr("filter", "url(#bigGlow)")
        .attr("class", "halo");

      // colored ring
      g.append("circle")
        .attr("r", (d) => (d.type === "project" ? 6.5 : 4))
        .attr("fill", "none")
        .attr("stroke", (d) => CLUSTERS[d.cluster].color)
        .attr("stroke-opacity", 0.9)
        .attr("stroke-width", 1)
        .attr("filter", "url(#glow)");

      // white core
      g.append("circle")
        .attr("r", (d) => (d.type === "project" ? 4 : 2.4))
        .attr("fill", "url(#star-core)")
        .attr("class", "core");

      // diffraction spikes for projects
      g.filter((d) => d.type === "project")
        .each(function (d) {
          const sel = d3.select(this);
          const len = 18;
          const col = CLUSTERS[d.cluster].color;
          [
            [0, -len, 0, len],
            [-len, 0, len, 0],
          ].forEach(([x1, y1, x2, y2]) => {
            sel.append("line")
              .attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2)
              .attr("stroke", col).attr("stroke-opacity", 0.55)
              .attr("stroke-width", 0.6).attr("filter", "url(#glow)");
          });
        });

      // pulse animation
      g.append("circle")
        .attr("r", (d) => (d.type === "project" ? 6.5 : 4))
        .attr("fill", "none")
        .attr("stroke", (d) => CLUSTERS[d.cluster].color)
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 0.8)
        .each(function (_, i) {
          const sel = d3.select(this);
          sel.append("animate")
            .attr("attributeName", "r")
            .attr("values", `4;14;4`)
            .attr("dur", `${3000 + (i % 5) * 400}ms`)
            .attr("repeatCount", "indefinite");
          sel.append("animate")
            .attr("attributeName", "stroke-opacity")
            .attr("values", `0.6;0;0.6`)
            .attr("dur", `${3000 + (i % 5) * 400}ms`)
            .attr("repeatCount", "indefinite");
        });

      // gentle float
      g.each(function (_, i) {
        const sel = d3.select(this);
        const baseX = (NODES[i].x / 100) * w;
        const baseY = (NODES[i].y / 100) * h;
        const dx = 2 + (i % 3);
        const dy = 1.5 + (i % 4);
        const dur = 6000 + (i * 137) % 5000;
        sel.append("animateTransform")
          .attr("attributeName", "transform")
          .attr("type", "translate")
          .attr("values", `${baseX},${baseY}; ${baseX + dx},${baseY - dy}; ${baseX - dx},${baseY + dy}; ${baseX},${baseY}`)
          .attr("dur", `${dur}ms`)
          .attr("repeatCount", "indefinite");
      });

      // interaction
      g.on("mouseenter", function (event, d) {
        setHover(d);
        const wrapRect = wrapRef.current!.getBoundingClientRect();
        setMousePos({
          x: event.clientX - wrapRect.left,
          y: event.clientY - wrapRect.top,
        });
        d3.select(this).select("circle.halo").transition().duration(250).attr("opacity", 0.55).attr("r", d.type === "project" ? 34 : 24);
        d3.select(this).select("circle.core").transition().duration(250).attr("r", d.type === "project" ? 6 : 4);
      }).on("mousemove", function (event) {
        const wrapRect = wrapRef.current!.getBoundingClientRect();
        setMousePos({
          x: event.clientX - wrapRect.left,
          y: event.clientY - wrapRect.top,
        });
      }).on("mouseleave", function (_, d) {
        setHover(null);
        d3.select(this).select("circle.halo").transition().duration(300).attr("opacity", 0.18).attr("r", d.type === "project" ? 22 : 14);
        d3.select(this).select("circle.core").transition().duration(300).attr("r", d.type === "project" ? 4 : 2.4);
      });

      // ── Query results — added node, dashed connection lines, neighbor highlight ──
      if (queryResults) {
        const qx = (queryResults.position.x / 100) * w;
        const qy = (queryResults.position.y / 100) * h;

        const queryLayer = svg.append("g").attr("class", "query-layer").attr("opacity", 0);

        // Dashed lines from query node to each matched neighbor, "drawing in"
        queryResults.neighbors.forEach(({ node }) => {
          const nx = (node.x / 100) * w;
          const ny = (node.y / 100) * h;
          const dist = Math.hypot(nx - qx, ny - qy);

          queryLayer
            .append("line")
            .attr("x1", qx).attr("y1", qy)
            .attr("x2", nx).attr("y2", ny)
            .attr("stroke", "#ffffff")
            .attr("stroke-opacity", 0.7)
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4 4")
            .attr("stroke-dashoffset", dist)
            .call((sel) => {
              sel.append("animate")
                .attr("attributeName", "stroke-dashoffset")
                .attr("from", dist)
                .attr("to", 0)
                .attr("dur", "700ms")
                .attr("fill", "freeze");
            });

          // Briefly scale up / brighten the matched neighbor's halo + core
          nodeLayer
            .selectAll<SVGGElement, NodeT>("g.node")
            .filter((d) => d.id === node.id)
            .each(function (d) {
              d3.select(this).select("circle.halo")
                .transition().duration(300)
                .attr("opacity", 0.6)
                .attr("r", d.type === "project" ? 30 : 20);
              d3.select(this).select("circle.core")
                .transition().duration(300)
                .attr("r", d.type === "project" ? 6 : 4);
            });

          const labelX = (node.x / 100) * w;
          const labelY = (node.y / 100) * h - 18;

          queryLayer
            .append("text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("text-anchor", "middle")
            .attr("fill", "rgba(0,0,0,0.8)")
            .attr("stroke", "rgba(0,0,0,0.8)")
            .attr("stroke-width", 3)
            .attr("font-family", "'Inter', system-ui, sans-serif")
            .attr("font-size", 10)
            .attr("font-weight", 500)
            .attr("letter-spacing", "0.08em")
            .attr("opacity", 0)
            .attr("pointer-events", "none")
            .text(node.label);

          queryLayer
            .append("text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("text-anchor", "middle")
            .attr("fill", "#ffffff")
            .attr("font-family", "'Inter', system-ui, sans-serif")
            .attr("font-size", 10)
            .attr("font-weight", 500)
            .attr("letter-spacing", "0.08em")
            .attr("opacity", 0)
            .attr("pointer-events", "none")
            .text(node.label)
            .transition().delay(400).duration(300).attr("opacity", 1);
        });

        // Query node itself — white pulsing circle with crosshair, labeled "QUERY"
        const queryNode = queryLayer.append("g").attr("transform", `translate(${qx},${qy})`);

        queryNode.append("circle")
          .attr("r", 16)
          .attr("fill", "#ffffff")
          .attr("opacity", 0.15)
          .attr("filter", "url(#bigGlow)");

        queryNode.append("circle")
          .attr("r", 5)
          .attr("fill", "none")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 1)
          .attr("filter", "url(#glow)")
          .each(function () {
            const sel = d3.select(this);
            sel.append("animate")
              .attr("attributeName", "r")
              .attr("values", "5;11;5")
              .attr("dur", "1800ms")
              .attr("repeatCount", "indefinite");
            sel.append("animate")
              .attr("attributeName", "stroke-opacity")
              .attr("values", "1;0;1")
              .attr("dur", "1800ms")
              .attr("repeatCount", "indefinite");
          });

        // Crosshair
        [[0, -10, 0, 10], [-10, 0, 10, 0]].forEach(([x1, y1, x2, y2]) => {
          queryNode.append("line")
            .attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2)
            .attr("stroke", "#ffffff")
            .attr("stroke-opacity", 0.8)
            .attr("stroke-width", 0.8);
        });

        queryNode.append("circle")
          .attr("r", 2.2)
          .attr("fill", "url(#star-core)");

        // Fade the whole query layer in
        queryLayer.transition().duration(250).attr("opacity", 1);
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [queryResults]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#e5e7eb',
        borderRadius: '12px',
      }}
    >
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', width: '100%' }}>
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, borderRadius: 'inherit' }}
        />
        <svg ref={svgRef} style={{ display: "block", width: "100%", height: "100%", position: "relative", zIndex: 1 }} />

        {/* Search bar — overlays the bottom of the starfield, does not push it up */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(480px, 90%)",
            zIndex: 10,
          }}
        >
          {topProjectMatch && (
            <div
              role="button"
              onClick={() => {
                const spreadId = PROJECT_SPREAD_MAP[topProjectMatch.id];
                if (spreadId) {
                  goToSpread(spreadId);
                }
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
              style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginBottom: 10,
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(6,8,20,0.88)",
                border: "1px solid rgba(125,211,252,0.25)",
                backdropFilter: "blur(14px)",
                color: "#e5e7eb",
                fontSize: 12,
                letterSpacing: "0.04em",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "opacity 250ms ease, filter 150ms ease",
                opacity: 1,
                zIndex: 11,
              }}
            >
              <span style={{ opacity: 0.88 }}>Top match:</span>
              <span style={{ fontWeight: 700, color: "#7dd3fc" }}>{topProjectMatch.label}</span>
              <span style={{ opacity: 0.78 }}>&rarr;</span>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: 999,
              background:
                "linear-gradient(120deg, rgba(125,211,252,0.6), rgba(167,139,250,0.6), rgba(240,171,252,0.6), rgba(125,211,252,0.6))",
              filter: "blur(10px)",
              opacity: 0.55,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 16px",
              borderRadius: 999,
              background: "rgba(6,8,20,0.75)",
              border: "1px solid rgba(125,211,252,0.25)",
              backdropFilter: "blur(14px)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
              <line x1="9" y1="9" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); handleQuery(e.target.value); }}
              placeholder='Try "cryptography"'
              disabled={modelState !== 'ready'}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e5e7eb",
                fontSize: 12,
                letterSpacing: "0.05em",
                fontFamily: "inherit",
              }}
            />
            {noResults && (
              <div
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  paddingRight: 4,
                }}
              >
                no strong matches found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover tooltip — absolute positioning relative to wrapper */}
      {hover && (
        <div
          style={{
            position: "absolute",
            left: mousePos.x + 12,
            top: mousePos.y - 40,
            zIndex: 9999,
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999,
            padding: "5px 14px",
            fontSize: 12,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.08em",
            backdropFilter: "blur(8px)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {hover.label}
        </div>
      )}
    </div>
  );
}
