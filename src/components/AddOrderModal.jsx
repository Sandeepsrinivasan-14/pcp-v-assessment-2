import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const RESTAURANTS = [
  'Burger Palace', 'Pizza Heaven', 'Sushi World', 'Spice Garden',
  'The Tandoor House', 'Noodle Box', 'Wrap & Roll', 'Green Bowl',
  'The Biryani Co.', 'Chai & Snacks', 'Dosa Express', 'Grillhouse',
];

const EMPTY_ITEM = { name: '', price: '', quantity: 1 };

export default function AddOrderModal({ onClose }) {
  const { state, dispatch } = useAppContext();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    customerName: '',
    restaurant: RESTAURANTS[0],
    status: 'pending',
    items: [{ ...EMPTY_ITEM }],
  });
  const [errors, setErrors] = useState({});

  const nextId = Math.max(0, ...state.orders.map(o => o.orderId)) + 1;

  const totalAmount = form.items.reduce((s, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 0;
    return s + price * qty;
  }, 0);

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Customer name is required';
    form.items.forEach((item, i) => {
      if (!item.name.trim()) e[`item_name_${i}`] = 'Item name required';
      if (!item.price || parseFloat(item.price) <= 0) e[`item_price_${i}`] = 'Valid price required';
      if (!item.quantity || parseInt(item.quantity) <= 0) e[`item_qty_${i}`] = 'Valid qty required';
    });
    if (totalAmount <= 0) e.total = 'Order total must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleItemChange = (idx, field, value) => {
    setForm(f => ({
      ...f,
      items: f.items.map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
  const removeItem = (idx) => {
    if (form.items.length === 1) return;
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrder = {
      orderId: nextId,
      customerName: form.customerName.trim(),
      restaurant: form.restaurant,
      status: form.status,
      totalAmount: Math.round(totalAmount * 100) / 100,
      items: form.items.map(item => ({
        name: item.name.trim(),
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
      })),
      deliveryTime: '30-35 mins',
    };

    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    addToast(`Order #${nextId} created successfully! 🎉`, 'success');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--surface-solid)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-xl)',
        width: '100%', maxWidth: 580,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        animation: 'fadeInUp 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>➕ New Order</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Order #{nextId}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon" style={{ fontSize: '1.25rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Customer */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
              Customer Name *
            </label>
            <input
              className="premium-input"
              placeholder="e.g. Aarav Sharma"
              value={form.customerName}
              onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
            />
            {errors.customerName && <p style={{ color: 'var(--danger)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>{errors.customerName}</p>}
          </div>

          {/* Restaurant */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
              Restaurant *
            </label>
            <div className="select-wrapper">
              <select
                className="premium-select"
                value={form.restaurant}
                onChange={e => setForm(f => ({ ...f, restaurant: e.target.value }))}
              >
                {RESTAURANTS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
              Status *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['pending', 'delivered', 'cancelled'].map(s => (
                <button
                  key={s} type="button"
                  onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`btn btn-sm ${form.status === s ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize', flex: 1 }}
                >
                  {s === 'pending' ? '⏳' : s === 'delivered' ? '✅' : '❌'} {s}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Items *
              </label>
              <button type="button" onClick={addItem} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                + Add Item
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {form.items.map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 70px 36px', gap: '0.5rem', alignItems: 'start' }}>
                  <div>
                    <input
                      className="premium-input"
                      placeholder="Item name"
                      value={item.name}
                      onChange={e => handleItemChange(idx, 'name', e.target.value)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                    />
                    {errors[`item_name_${idx}`] && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '2px' }}>Required</p>}
                  </div>
                  <div>
                    <input
                      className="premium-input"
                      placeholder="₹ Price"
                      type="number" min="1"
                      value={item.price}
                      onChange={e => handleItemChange(idx, 'price', e.target.value)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                    />
                    {errors[`item_price_${idx}`] && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '2px' }}>Required</p>}
                  </div>
                  <input
                    className="premium-input"
                    placeholder="Qty"
                    type="number" min="1"
                    value={item.quantity}
                    onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ color: 'var(--danger)', marginTop: '2px' }}
                    disabled={form.items.length === 1}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Order Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--primary-light)' }}>
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              🚀 Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
