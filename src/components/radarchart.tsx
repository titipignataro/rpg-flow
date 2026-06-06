import { useEffect, useRef } from "react";
import { TRAIT_META } from "../data/archetypes";

function RadarChart({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    
    // Tamanho mantido maior: centro em 150, raio 110
    const cx = 150, cy = 150, r = 110;
    const keys = ["D", "I", "S", "C"];
    const colors = keys.map(k => TRAIT_META[k].color);
    const vals = keys.map(k => state[k]);
    const maxV = 20;
    
    ctx.clearRect(0, 0, 300, 300);

    // Desenha os níveis do gráfico (teia)
    for (let lv = 1; lv <= 4; lv++) {
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        // Rotacionado -45 graus em relação ao anterior: resulta em (i * Math.PI / 2)
        const a = (i * Math.PI / 2);
        const x = cx + (r * lv / 4) * Math.cos(a);
        const y = cy + (r * lv / 4) * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1; ctx.stroke();
    }
    
    // Desenha os eixos
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.stroke();
    }
    
    // Desenha a forma dos dados
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI / 2);
      const pct = Math.min(vals[i] / maxV, 1);
      const x = cx + r * pct * Math.cos(a);
      const y = cy + r * pct * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(139,127,232,0.12)"; ctx.fill();
    ctx.strokeStyle = "#8b7fe8"; ctx.lineWidth = 1.5; ctx.stroke();
    
    // Desenha os pontos e os rótulos (D, I, S, C)
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI / 2);
      const pct = Math.min(vals[i] / maxV, 1);
      const x = cx + r * pct * Math.cos(a);
      const y = cy + r * pct * Math.sin(a);
      
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[i]; ctx.fill();
      
      const lx = cx + (r + 25) * Math.cos(a);
      const ly = cy + (r + 25) * Math.sin(a);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "12px 'DM Mono', monospace"; 
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(keys[i], lx, ly);
    }
  }, [state]);
  
  return <canvas ref={ref} width={300} height={300} />;
}

export default RadarChart;