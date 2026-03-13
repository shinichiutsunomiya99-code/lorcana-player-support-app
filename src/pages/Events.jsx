import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Calendar, MapPin, ChevronLeft, Trophy } from 'lucide-react';
import { COLORS, COLOR_UI } from '../lib/constants';

const Events = ({ data }) => {
  const { events, eventOps, matches, decks } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingEventId, setViewingEventId] = useState(null);
  
  const initialFormState = {
    name: '',
    venue: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const [metaForm, setMetaForm] = useState({
    deckColors: [],
    deckType: '',
    count: 1
  });

  const startEdit = (e, event) => {
    e.stopPropagation();
    setFormData({
      name: event.name || '',
      venue: event.venue || '',
      date: event.date || new Date().toISOString().split('T')[0],
      notes: event.notes || ''
    });
    setEditingId(event.id);
    setIsAdding(false);
    setViewingEventId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      eventOps.update(editingId, formData);
      setEditingId(null);
    } else {
      eventOps.add({ ...formData, deckMeta: [] });
      setIsAdding(false);
    }
    setFormData(initialFormState);
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(initialFormState);
  };

  const handleAddMeta = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const newMeta = [...(event.deckMeta || []), { ...metaForm, id: Date.now().toString() }];
    eventOps.update(eventId, { deckMeta: newMeta });
    setMetaForm({ deckColors: [], deckType: '', count: 1 });
  };

  const handleRemoveMeta = (eventId, metaId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const newMeta = event.deckMeta.filter(m => m.id !== metaId);
    eventOps.update(eventId, { deckMeta: newMeta });
  };

  const toggleMetaColor = (color) => {
    setMetaForm(prev => {
      if (prev.deckColors.includes(color)) {
        return { ...prev, deckColors: prev.deckColors.filter(c => c !== color) };
      }
      if (prev.deckColors.length >= 2) return prev;
      return { ...prev, deckColors: [...prev.deckColors, color] };
    });
  };

  const calculateStats = (eventId) => {
    const eventMatches = matches.filter(m => m.eventId === eventId);
    const wins = eventMatches.filter(m => m.result === 'WIN').length;
    const losses = eventMatches.filter(m => m.result === 'LOSE').length;
    const draws = eventMatches.filter(m => m.result === 'DRAW').length;
    return { wins, losses, draws, total: eventMatches.length };
  };

  if (viewingEventId) {
    const event = events.find(e => e.id === viewingEventId);
    if (!event) {
      setViewingEventId(null);
      return null;
    }
    const stats = calculateStats(event.id);
    const eventMatches = matches.filter(m => m.eventId === event.id).sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));

    return (
      <div className="event-detail fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn card" style={{ padding: '0.5rem', marginBottom: 0 }} onClick={() => setViewingEventId(null)}>
            <ChevronLeft size={20} />
          </button>
          <h1>大会詳細</h1>
        </div>

        <div className="card glow-effect" style={{ background: 'linear-gradient(135deg, rgba(16,24,38,0.95) 0%, rgba(30,20,50,0.95) 100%)', border: '1px solid var(--accent)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'Cinzel, serif' }}>{event.name}</h2>
          <div style={{ fontSize: '0.85rem', opacity: 0.6, display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> {event.date}
            </span>
            {event.venue && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} /> {event.venue}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
            <Trophy size={18} color="var(--amber)" />
            <span style={{ fontWeight: 700 }}>{stats.wins}勝 - {stats.losses}敗 - {stats.draws}分</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.5 }}>({stats.total} 試合)</span>
          </div>
        </div>

        <section style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontFamily: 'Cinzel, serif' }}>試合一覧</h3>
          <div className="matches-list">
            {eventMatches.map(match => {
              const myDeck = decks.find(d => d.id === match.myDeckId);
              return (
                <div key={match.id} className="card" style={{ marginBottom: '0.75rem', fontSize: '0.9rem', borderLeft: `4px solid ${match.result === 'WIN' ? '#22c55e' : match.result === 'LOSE' ? '#ef4444' : '#64748b'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {match.result} - {match.playOrder === 'FIRST' ? '先手' : '後手'} 
                        {(match.myLore !== undefined || match.opponentLore !== undefined) && (
                          <span style={{ marginLeft: '8px', fontSize: '0.85rem', color: 'var(--amber)' }}>
                            [{match.myLore || 0} - {match.opponentLore || 0}]
                          </span>
                        )}
                      </div>
                      <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>{new Date(match.playedAt).toLocaleTimeString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                        vs 
                        <span style={{ display: 'flex' }}>
                          {match.opponentColors.map(c => <span key={c} className={`ink-dot ${COLOR_UI[c] ? COLOR_UI[c].inkClass : 'ink-unknown'}`} title={c}></span>)}
                        </span>
                        {match.opponentDeckType}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {eventMatches.length === 0 && <p style={{ opacity: 0.5, fontSize: '0.9rem', textAlign: 'center', fontFamily: 'Cinzel, serif' }}>No encounters recorded yet.</p>}
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontFamily: 'Cinzel, serif' }}>参加デッキ分布 (メタ)</h3>
          <div className="card">
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-muted)' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>カラー / デッキタイプ / 人数</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
                {Object.values(COLORS).filter(c => c !== 'UNKNOWN').map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleMetaColor(color)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: metaForm.deckColors.includes(color) ? COLOR_UI[color].css : 'var(--border)',
                      background: metaForm.deckColors.includes(color) ? `${COLOR_UI[color].css}22` : 'transparent',
                      color: metaForm.deckColors.includes(color) ? COLOR_UI[color].css : 'var(--fg)',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span className={`ink-dot ${COLOR_UI[color].inkClass}`} style={{ width: '8px', height: '8px' }}></span>
                    {COLOR_UI[color].label}
                  </button>
                ))}
              </div>
              <div className="grid-2" style={{ marginBottom: '0.75rem' }}>
                <input 
                  className="form-input" 
                  style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                  value={metaForm.deckType}
                  onChange={e => setMetaForm({ ...metaForm, deckType: e.target.value })}
                  placeholder="タイプ"
                />
                <input 
                  type="number" 
                  className="form-input" 
                  style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                  value={metaForm.count}
                  onChange={e => setMetaForm({ ...metaForm, count: parseInt(e.target.value) || 0 })}
                />
              </div>
              <button className="btn btn-primary" style={{ width: '100%', padding: '0.5rem' }} onClick={() => handleAddMeta(event.id)}>追加</button>
            </div>

            <div className="meta-list">
              {(event.deckMeta || []).map(meta => (
                <div key={meta.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'flex' }}>
                      {meta.deckColors.map(c => <span key={c} className={`ink-dot ${COLOR_UI[c] ? COLOR_UI[c].inkClass : 'ink-unknown'}`} title={c}></span>)}
                    </span>
                    {meta.deckType}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{meta.count} 人</span>
                    <button onClick={() => handleRemoveMeta(event.id, meta.id)} style={{ color: '#ef4444', opacity: 0.4 }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {(event.deckMeta || []).length > 0 && (
                <div style={{ marginTop: '0.5rem', textAlign: 'right', fontSize: '0.85rem', opacity: 0.6 }}>
                  合計: {event.deckMeta.reduce((acc, m) => acc + m.count, 0)} 人
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="events-page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>大会ログ</h1>
        <button className="btn btn-primary" onClick={() => { setIsAdding(true); setEditingId(null); setFormData(initialFormState); }}>
          <Plus size={20} />
          <span>新規大会</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="card glow-effect fade-in" style={{ marginBottom: '2rem', border: '1px solid var(--accent)' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>{editingId ? 'Edit Event' : 'New Event'}</h3>
          <div className="form-group">
            <label className="form-label">大会名 *</label>
            <input
              className="form-input"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="店舗大会 / Lorcana Challenge"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">開催日 *</label>
              <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">会場 (任意)</label>
              <input className="form-input" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} placeholder="店名など" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? '更新' : '保存'}</button>
            <button type="button" className="btn card" style={{ flex: 1, marginBottom: 0 }} onClick={cancelEdit}>キャンセル</button>
          </div>
        </form>
      )}

      <div className="events-list">
        {events.map(event => {
          const stats = calculateStats(event.id);
          return (
            <div key={event.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setViewingEventId(event.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{event.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, display: 'flex', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {event.date}</span>
                    {event.venue && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {event.venue}</span>}
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trophy size={14} color="var(--amber)" />
                    <span style={{ fontWeight: 600 }}>{stats.wins}勝 - {stats.losses}敗 - {stats.draws}分</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button 
                    onClick={(e) => startEdit(e, event)} 
                    style={{ color: 'var(--accent)', opacity: 0.8, padding: '0.5rem' }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm('削除しますか？')) eventOps.remove(event.id);
                    }} 
                    style={{ color: '#ef4444', opacity: 0.6, padding: '0.5rem' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {events.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem', fontFamily: 'Cinzel, serif' }}>No event logs.</p>}
      </div>
    </div>
  );
};

export default Events;
