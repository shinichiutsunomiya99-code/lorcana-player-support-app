import React, { useState } from 'react';
import { Plus, Trash2, Edit2, BookOpen, Layers } from 'lucide-react';
import { COLORS, COLOR_UI, NOTE_SCOPE } from '../lib/constants';

const MatchupNotes = ({ data }) => {
  const { notes, noteOps, decks } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    scope: NOTE_SCOPE.GLOBAL,
    myDeckId: '',
    myColors: [],
    opponentColors: [],
    title: '',
    mulliganGuide: '',
    gamePlan: '',
    keyThreats: '',
    winCons: '',
    loseCons: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const startEdit = (note) => {
    setFormData({
      scope: note.scope || NOTE_SCOPE.GLOBAL,
      myDeckId: note.myDeckId || '',
      myColors: note.myColors || [],
      opponentColors: note.opponentColors || [],
      title: note.title || '',
      mulliganGuide: note.mulliganGuide || '',
      gamePlan: note.gamePlan || '',
      keyThreats: note.keyThreats || '',
      winCons: note.winCons || '',
      loseCons: note.loseCons || ''
    });
    setEditingId(note.id);
    setIsAdding(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      noteOps.update(editingId, formData);
      setEditingId(null);
    } else {
      noteOps.add(formData);
      setIsAdding(false);
    }
    setFormData(initialFormState);
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(initialFormState);
  };

  const toggleColors = (field, color) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(color)) {
        return { ...prev, [field]: current.filter(c => c !== color) };
      }
      if (current.length >= 2) return prev;
      return { ...prev, [field]: [...current, color] };
    });
  };

  return (
    <div className="notes-page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>マッチアップノート</h1>
        <button className="btn btn-primary" onClick={() => { setIsAdding(true); setEditingId(null); setFormData(initialFormState); }}>
          <Plus size={20} />
          <span>新規ノート</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="card glow-effect fade-in" style={{ marginBottom: '2rem', border: '1px solid var(--accent)' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>{editingId ? 'Edit Notes' : 'New Research Notes'}</h3>
          <div className="form-group">
            <label className="form-label">種類</label>
            <div className="grid-2">
              <button
                type="button"
                className={`btn ${formData.scope === NOTE_SCOPE.GLOBAL ? 'btn-primary' : 'card'}`}
                style={{ marginBottom: 0 }}
                onClick={() => setFormData({ ...formData, scope: NOTE_SCOPE.GLOBAL })}
              >
                グローバル
              </button>
              <button
                type="button"
                className={`btn ${formData.scope === NOTE_SCOPE.DECK_SPECIFIC ? 'btn-primary' : 'card'}`}
                style={{ marginBottom: 0 }}
                onClick={() => setFormData({ ...formData, scope: NOTE_SCOPE.DECK_SPECIFIC })}
              >
                デッキ固有
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">タイトル *</label>
            <input
              className="form-input"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="vs Blue/Grey Control"
            />
          </div>

          {formData.scope === NOTE_SCOPE.DECK_SPECIFIC ? (
            <div className="form-group">
              <label className="form-label">対象デッキ</label>
              <select
                className="form-select"
                value={formData.myDeckId}
                onChange={e => setFormData({ ...formData, myDeckId: e.target.value })}
              >
                <option value="">選択してください</option>
                {decks.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">自分のカラー</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {Object.values(COLORS).filter(c => c !== 'UNKNOWN').map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleColors('myColors', color)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: formData.myColors.includes(color) ? COLOR_UI[color].css : 'var(--border)',
                      background: formData.myColors.includes(color) ? `${COLOR_UI[color].css}22` : 'transparent',
                      color: formData.myColors.includes(color) ? COLOR_UI[color].css : 'var(--fg)',
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
          )}

          <div className="form-group">
            <label className="form-label">相手のカラー</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {Object.values(COLORS).map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleColors('opponentColors', color)}
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
                  <span className={`ink-dot ${COLOR_UI[color] && COLOR_UI[color].inkClass ? COLOR_UI[color].inkClass : 'ink-unknown'}`} style={{ width: '8px', height: '8px' }}></span>
                  {COLOR_UI[color].label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">基本戦略</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={formData.gamePlan}
              onChange={e => setFormData({ ...formData, gamePlan: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? '更新' : '保存'}</button>
            <button type="button" className="btn card" style={{ flex: 1, marginBottom: 0 }} onClick={cancelEdit}>キャンセル</button>
          </div>
        </form>
      )}

      <div className="notes-list">
        {notes.map(note => {
          const myDeck = note.myDeckId ? decks.find(d => d.id === note.myDeckId) : null;
          return (
            <div key={note.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'Cinzel, serif', opacity: 0.6, letterSpacing: '1px' }}>
                  {note.scope === NOTE_SCOPE.GLOBAL ? 'GLOBAL RESEARCH' : 'DECK SPECIFIC'}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => startEdit(note)} style={{ color: 'var(--accent)', opacity: 0.8, padding: '0.25rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => { if(confirm('削除しますか？')) noteOps.remove(note.id) }} style={{ color: '#ef4444', opacity: 0.6, padding: '0.25rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'Cinzel, serif' }}>{note.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex' }}>
                  {note.scope === NOTE_SCOPE.DECK_SPECIFIC && myDeck ? (
                    myDeck.colors.map(c => <span key={c} className={`ink-dot ${COLOR_UI[c] ? COLOR_UI[c].inkClass : 'ink-unknown'}`} title={c}></span>)
                  ) : (
                    note.myColors.map(c => <span key={c} className={`ink-dot ${COLOR_UI[c] ? COLOR_UI[c].inkClass : 'ink-unknown'}`} title={c}></span>)
                  )}
                </div>
                <span style={{ opacity: 0.5, fontStyle: 'italic' }}>vs</span>
                <div style={{ display: 'flex' }}>
                  {note.opponentColors.map(c => <span key={c} className={`ink-dot ${COLOR_UI[c] ? COLOR_UI[c].inkClass : 'ink-unknown'}`} title={c}></span>)}
                </div>
              </div>
              {note.gamePlan && (
                <div style={{ fontSize: '0.85rem', opacity: 0.8, whiteSpace: 'pre-wrap', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                  {note.gamePlan}
                </div>
              )}
            </div>
          );
        })}
        {notes.length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem', fontFamily: 'Cinzel, serif' }}>No research notes found.</p>
        )}
      </div>
    </div>
  );
};

export default MatchupNotes;
