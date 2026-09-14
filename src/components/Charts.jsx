import React, { useEffect, useRef, useState } from 'react';

/* ===== Donut Chart ===== */
export function DonutChart({ data, size = 180 }) {
  const radius = 70;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.value, 0);

  let offset = 0;
  const slices = data.map(d => {
    const pct = total ? d.value / total : 0;
    const len = pct * circumference;
    const slice = { ...d, pct, offset, len };
    offset += len;
    return slice;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border)" strokeWidth="20" />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth="20"
            strokeDasharray={`${s.len} ${circumference - s.len}`}
            strokeDashoffset={circumference / 4 - s.offset}
            strokeLinecap="butt"
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text)" fontSize="22" fontWeight="800" fontFamily="inherit">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontFamily="inherit">
          Total
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', minWidth: 80 }}>{s.label}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', marginLeft: 'auto' }}>{s.value}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', minWidth: 36 }}>
              {total ? Math.round(s.pct * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Horizontal Bar Chart ===== */
export function HBarChart({ data, maxItems = 8, colorPrimary = 'var(--primary-light)', colorSecondary = 'var(--accent)' }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = data.slice(0, maxItems);
  const max = Math.max(...items.map(d => d.value), 1);

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {items.map((d, i) => {
        const pct = (d.value / max) * 100;
        const gradient = `linear-gradient(90deg, ${colorPrimary}, ${colorSecondary})`;
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)' }}>
                {d.prefix || ''}{d.value.toLocaleString()}{d.suffix || ''}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: animated ? `${pct}%` : '0%',
                  background: gradient,
                  transition: `width ${0.6 + i * 0.1}s cubic-bezier(0.4,0,0.2,1)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== Vertical Bar Chart ===== */
export function VBarChart({ data, height = 160, color = 'var(--primary-light)' }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height, padding: '0 4px' }}>
      {data.map((d, i) => {
        const h = animated ? Math.max(4, (d.value / max) * (height - 24)) : 4;
        return (
          <div
            key={i}
            title={`${d.label}: ${d.value}`}
            style={{
              flex: 1,
              height: `${h}px`,
              background: `linear-gradient(180deg, ${color}, var(--accent))`,
              borderRadius: '4px 4px 2px 2px',
              transition: `height ${0.5 + i * 0.05}s cubic-bezier(0.4,0,0.2,1)`,
              cursor: 'default',
              minWidth: 0,
            }}
          />
        );
      })}
    </div>
  );
}

/* ===== Animated Counter ===== */
export function AnimatedNumber({ target, prefix = '', suffix = '', duration = 1200 }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(ease * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{prefix}{current.toLocaleString()}{suffix}</span>;
}
