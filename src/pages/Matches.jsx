import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Trophy, Clock, User } from 'lucide-react';
import { COLORS, COLOR_UI, RESULTS, PLAY_ORDER } from '../lib/constants';

const Matches = ({ data }) => {
  const { matches, matchOps, decks, events, deckOps } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    result: RESULTS.WIN,
    opponentColors: [],
    myDeckId: '',
    opponentName: '',
    opponentDeckType: '',
    playOrder: PLAY_ORDER.FIRST,
    eventId: '',
    notes: '',
    tags: [],
    myLore: '',
    opponentLore: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const startEdit = (match) => {
    setFormData({
      result: match.result || RESULTS.WIN,
      opponentColors: match.opponentColors || [],
      myDeckId: match.myDeckId || '',
      opponentName: match.opponentName || '',
      opponentDeckType: match.opponentDeckType || '',
      playOrder: match.playOrder || PLAY_ORDER.FIRST,
      eventId: match.eventId || '',
      notes: match.notes || '',
      tags: match.tags || [],
      myLore: match.myLore !== undefined ? match.myLore : '',
      opponentLore: match.opponentLore !== undefined ? match.opponentLore : ''
    });
    setEditingId(match.id);
    setIsAdding(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.myDeckId) {
      alert('自分のデッキを選択してください');
      return;
    }
    
    const parsedData = { ...formData };
    if (parsedData.myLore !== '') parsedData.myLore = parseInt(parsedData.myLore, 10);
    if (parsedData.opponentLore !== '') parsedData.opponentLore = parseInt(parsedData.opponentLore, 10);

    if (editingId) {
      matchOps.update(editingId, parsedData);
      setEditingId(null);
    } else {
      const playedAt = new Date().toISOString();
      matchOps.add({ ...parsedData, playedAt });
      deckOps.update(formData.myDeckId, { lastUsedAt: playedAt });
      setIsAdding(false);
    }
    
    setFormData(initialFormState);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(initialFormState);
  };

  const toggleOpponentColor = (color) => {
    setFormData(prev => {
      if (prev.opponentColors.includes(color)) {
        return { ...prev, opponentColors: prev.opponentColors.filter(c => c !== color) };
      }
      if (prev.opponentColors.length >= 2) return prev;
      return { ...prev, opponentColors: [...prev.opponentColors, color] };
    });
  };

  const sortedMatches = [...matches].sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));

  return (
    <div className="matches-page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>試合記録</h1>
        <button className="btn btn-primary" onClick={() => { setIsAdding(true); setEditingId(null); setFormData(initialFormState); }}>
          <Plus size={20} />
          <span>新規記録</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="card glow-effect fade-in" style={{ marginBottom: '2rem', border: '1px solid var(--accent)' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>{editingId ? 'Edit Match Record' : 'New Match Record'}</h3>
          <div className="form-group">
            <label className="form-label">結果 *</label>
            <div className="grid-2">
              {[RESULTS.WIN, RESULTS.LOSE, RESULTS.DRAW].map(res => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setFormData({ ...formData, result: res })}
                  className="btn"
                  style={{
                    background: formData.result === res ? (res === RESULTS.WIN ? '#22c55e' : res === RESULTS.LOSE ? '#ef4444' : '#64748b') : 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    color: formData.result === res ? 'white' : 'var(--fg)',
                  }}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">自分のロア (Lore)</label>
              <input
                type="number"
                min="0"
                max="99"
                className="form-input"
                value={formData.myLore}
                onChange={e => setFormData({ ...formData, myLore: e.target.value })}
                placeholder="例: 20"
                style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', textAlign: 'center' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">相手のロア (Lore)</label>
              <input
                type="number"
                min="0"
                max="99"
                className="form-input"
                value={formData.opponentLore}
                onChange={e => setFormData({ ...formData, opponentLore: e.target.value })}
                placeholder="例: 13"
                style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', textAlign: 'center' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">相手のカラー (最大2)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {Object.values(COLORS).filter(c => c !== 'UNKNOWN').map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleOpponentColor(color)}
                  style={{
                    padding: '0.4rem 0.6rem',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: formData.opponentColors.includes(color) ? COLOR_UI[color].css : 'var(--border)',
                    background: formData.opponentColors.includes(color) ? `${COLOR_UI[color].css}22` : 'transparent',
                    color: formData.opponentColors.includes(color) ? COLOR_UI[color].css : 'var(--fg)',
                    fontSize: '0.75rem',
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
          </div>

          <div className="form-group">
            <label className="form-label">相手のデッキタイプ (重要)</label>
            <input
              className="form-input"
              value={formData.opponentDeckType}
              onChange={e => setFormData({ ...formData, opponentDeckType: e.target.value })}
              placeholder="例：バウンス、ランプ、アグロ、コントロール"
              list="deck-type-suggestions"
            />
            <datalist id="deck-type-suggestions">
              <option value="バウンス" />
              <option value="ランプ" />
              <option value="アグロ" />
              <option value="コントロール" />
              <option value="ミッドレンジ" />
            </datalist>
          </div>

          <div className="form-group">
            <label className="form-label">自分のデッキ *</label>
            <select
              className="form-select"
              required
              value={formData.myDeckId}
              onChange={e => setFormData({ ...formData, myDeckId: e.target.value })}
            >
              <option value="">選択してください</option>
              {decks.map(deck => (
                <option key={deck.id} value={deck.id}>
                  {deck.name} ({deck.colors.map(c => COLOR_UI[c].label).join(', ')})
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">手番</label>
              <select
                className="form-select"
                value={formData.playOrder}
                onChange={e => setFormData({ ...formData, playOrder: e.target.value })}
              >
                <option value={PLAY_ORDER.FIRST}>先手</option>
                <option value={PLAY_ORDER.SECOND}>後手</option>
                <option value={PLAY_ORDER.UNKNOWN}>不明</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">大会 (任意)</label>
              <select
                className="form-select"
                value={formData.eventId}
                onChange={e => setFormData({ ...formData, eventId: e.target.value })}
              >
                <option value="">未紐付け</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">ノート (任意)</label>
            <textarea
              className="form-textarea"
              rows="2"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="対戦の感想など"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? '更新する' : '記録する'}</button>
            <button type="button" className="btn card" style={{ flex: 1, marginBottom: 0 }} onClick={cancelEdit}>キャンセル</button>
          </div>
        </form>
      )}

      <div className="matches-list">
        {sortedMatches.map(match => {
           const myDeck = decks.find(d => d.id === match.myDeckId);
           return (
            <div key={match.id} className="card" style={{ borderLeft: `4px solid ${match.result === RESULTS.WIN ? '#22c55e' : match.result === RESULTS.LOSE ? '#ef4444' : '#64748b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {match.result} - {match.playOrder === PLAY_ORDER.FIRST ? '先手' : '後手'}
                    {(match.myLore !== undefined || match.opponentLore !== undefined) && (
                      <span style={{ fontFamily: 'Cinzel, serif', color: 'var(--amber)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                        [{match.myLore || 0} - {match.opponentLore || 0}]
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{ opacity: 0.6, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Clock size={12} /> {new Date(match.playedAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ marginTop: '0.6rem', fontSize: '0.85rem' }}>
                    <span style={{ opacity: 0.6 }}>My Deck: </span>
                    {myDeck ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'flex' }}>
                          {myDeck.colors.map(c => <span key={c} className={`ink-dot ${COLOR_UI[c].inkClass}`} title={COLOR_UI[c].label}></span>)}
                        </span>
                        {myDeck.name}
                      </span>
                    ) : '---'}
                  </div>
                  <div style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
                    <span style={{ opacity: 0.6 }}>Opponent: </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ display: 'flex' }}>
                        {match.opponentColors.map(c => <span key={c} className={`ink-dot ${COLOR_UI[c] ? COLOR_UI[c].inkClass : 'ink-unknown'}`} title={c}></span>)}
                      </span>
                      {match.opponentDeckType}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button onClick={() => startEdit(match)} style={{ color: 'var(--accent)', opacity: 0.8, padding: '0.25rem' }}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => { if(confirm('削除しますか？')) matchOps.remove(match.id) }} style={{ color: '#ef4444', opacity: 0.6, padding: '0.25rem' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
           );
         })}
        {matches.length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem', fontFamily: 'Cinzel, serif' }}>No match records.</p>
        )}
      </div>
    </div>
  );
};

export default Matches;
