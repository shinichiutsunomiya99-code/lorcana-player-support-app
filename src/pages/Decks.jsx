import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import { COLORS, COLOR_UI } from '../lib/constants';

const Decks = ({ data }) => {
  const { decks, deckOps } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    name: '',
    colors: [],
    deckType: '',
    deckCode: '',
    notes: '',
    isArchived: false
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const startEdit = (deck) => {
    setFormData({
      name: deck.name || '',
      colors: deck.colors || [],
      deckType: deck.deckType || '',
      deckCode: deck.deckCode || '',
      notes: deck.notes || '',
      isArchived: deck.isArchived || false
    });
    setEditingId(deck.id);
    setIsAdding(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      deckOps.update(editingId, formData);
      setEditingId(null);
    } else {
      deckOps.add({
        ...formData,
        lastUsedAt: null
      });
      setIsAdding(false);
    }
    setFormData(initialFormState);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(initialFormState);
  };

  const toggleColor = (color) => {
    setFormData(prev => {
      if (prev.colors.includes(color)) {
        return { ...prev, colors: prev.colors.filter(c => c !== color) };
      }
      if (prev.colors.length >= 2) return prev;
      return { ...prev, colors: [...prev.colors, color] };
    });
  };

  const sortedDecks = [...decks].sort((a, b) => {
    if (!a.lastUsedAt) return 1;
    if (!b.lastUsedAt) return -1;
    return new Date(b.lastUsedAt) - new Date(a.lastUsedAt);
  });

  return (
    <div className="decks-page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>デッキ管理</h1>
        <button className="btn btn-primary" onClick={() => { setIsAdding(true); setEditingId(null); setFormData(initialFormState); }}>
          <Plus size={20} />
          <span>追加</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="card glow-effect fade-in" style={{ marginBottom: '2rem', border: '1px solid var(--accent)' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>{editingId ? 'Edit Deck' : 'New Deck'}</h3>
          
          <div className="form-group">
            <label className="form-label">デッキ名 *</label>
            <input
              className="form-input"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ruby/Amethyst Aggro"
            />
          </div>

          <div className="form-group">
            <label className="form-label">インクカラー (最大2)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {Object.values(COLORS).filter(c => c !== 'UNKNOWN').map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleColor(color)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: formData.colors.includes(color) ? COLOR_UI[color].css : 'var(--border)',
                    background: formData.colors.includes(color) ? `${COLOR_UI[color].css}22` : 'transparent',
                    color: formData.colors.includes(color) ? COLOR_UI[color].css : 'var(--fg)',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span className={`ink-dot ${COLOR_UI[color].inkClass}`} style={{ width: '12px', height: '12px' }}></span>
                  {COLOR_UI[color].label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">デッキタイプ / コード (任意)</label>
            <div className="grid-2">
              <input
                className="form-input"
                value={formData.deckType}
                onChange={e => setFormData({ ...formData, deckType: e.target.value })}
                placeholder="Aggro / Control"
              />
              <input
                className="form-input"
                value={formData.deckCode}
                onChange={e => setFormData({ ...formData, deckCode: e.target.value })}
                placeholder="17桁コード"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? '更新' : '保存'}</button>
            <button type="button" className="btn card" style={{ flex: 1, marginBottom: 0 }} onClick={cancelEdit}>キャンセル</button>
          </div>
        </form>
      )}

      <div className="decks-list">
        {sortedDecks.map(deck => (
          <div key={deck.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.25rem' }}>
                {deck.colors.map(c => (
                  <span key={c} className={`ink-dot ${COLOR_UI[c].inkClass}`} title={COLOR_UI[c].label}></span>
                ))}
                <span style={{ fontWeight: 600, marginLeft: '4px' }}>{deck.name}</span>
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                {deck.deckType && <span>{deck.deckType}</span>}
                {deck.lastUsedAt && (
                  <span style={{ marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {new Date(deck.lastUsedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(deck)} style={{ color: 'var(--accent)', opacity: 0.8, padding: '0.5rem' }}>
                <Edit2 size={18} />
              </button>
              <button onClick={() => { if(confirm('削除しますか？')) deckOps.remove(deck.id) }} style={{ color: '#ef4444', opacity: 0.6, padding: '0.5rem' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {decks.length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem', fontFamily: 'Cinzel, serif' }}>Empty Archive</p>
        )}
      </div>
    </div>
  );
};

export default Decks;
