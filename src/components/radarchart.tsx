import { useEffect, useRef } from "react";
import { TRAIT_META } from "../data/archetypes";

function RadarChart({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const cx = 130, cy = 130, r = 90;
    const keys = ["D", "I", "S", "C"];
    const colors = keys.map(k => TRAIT_META[k].color);
    const vals = keys.map(k => state[k]);
    const maxV = 20;
    ctx.clearRect(0, 0, 260, 260);

    for (let lv = 1; lv <= 4; lv++) {
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI / 2) - Math.PI / 4;
        const x = cx + (r * lv / 4) * Math.cos(a);
        const y = cy + (r * lv / 4) * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1; ctx.stroke();
    }
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI / 2) - Math.PI / 4;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.stroke();
    }
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI / 2) - Math.PI / 4;
      const pct = Math.min(vals[i] / maxV, 1);
      const x = cx + r * pct * Math.cos(a);
      const y = cy + r * pct * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(139,127,232,0.12)"; ctx.fill();
    ctx.strokeStyle = "#8b7fe8"; ctx.lineWidth = 1.5; ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI / 2) - Math.PI / 4;
      const pct = Math.min(vals[i] / maxV, 1);
      const x = cx + r * pct * Math.cos(a);
      const y = cy + r * pct * Math.sin(a);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[i]; ctx.fill();
      const lx = cx + (r + 20) * Math.cos(a);
      const ly = cy + (r + 20) * Math.sin(a);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "11px 'DM Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(keys[i], lx, ly);
    }
  }, [state]);
  return <canvas ref={ref} width={260} height={260} />;
}

export default RadarChart;