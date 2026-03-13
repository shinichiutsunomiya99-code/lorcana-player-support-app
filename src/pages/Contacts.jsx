import React, { useState } from 'react';
import { Plus, UserPlus, Search, Edit3, Trash2, Calendar, MapPin, User, Sword } from 'lucide-react';
import { COLOR_UI } from '../lib/constants';

const Contacts = ({ data }) => {
  const { contacts, contactOps } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [viewingContact, setViewingContact] = useState(null);
  const [playerIdInput, setPlayerIdInput] = useState('');
  const [memoInput, setMemoInput] = useState('');

  const handleExchange = (e) => {
    e.preventDefault();
    if (!playerIdInput) return;

    // Simulate finding a player by ID
    const mockPlayer = {
      playerId: playerIdInput.toUpperCase(),
      displayName: `Player ${playerIdInput.toUpperCase().slice(0, 4)}`,
      favoriteCharacter: 'Mickey Mouse',
      primaryLocation: 'Weekly League',
      achievements: 'Top 8 Store Champ',
      favoriteDeck: 'Ruby/Amethyst',
      favoriteDeckColors: ['RUBY', 'AMETHYST'],
    };

    contactOps.add({
      ...mockPlayer,
      memo: '',
      exchangedAt: new Date().toISOString()
    });

    setIsAdding(false);
    setPlayerIdInput('');
  };

  const handleUpdateMemo = (id) => {
    contactOps.update(id, { memo: memoInput });
    setViewingContact({ ...viewingContact, memo: memoInput });
    setMemoInput('');
  };

  return (
    <div className="contacts-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>交換カード一覧</h1>
        {!viewingContact && (
          <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
            <UserPlus size={20} />
            <span>交換</span>
          </button>
        )}
        {viewingContact && (
          <button className="btn card" style={{ marginBottom: 0 }} onClick={() => setViewingContact(null)}>
            戻る
          </button>
        )}
      </div>

      {isAdding && !viewingContact && (
        <form onSubmit={handleExchange} className="card" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Player ID を入力</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-input"
                required
                value={playerIdInput}
                onChange={e => setPlayerIdInput(e.target.value)}
                placeholder="PLAYER123"
              />
              <button type="submit" className="btn btn-primary">追加</button>
            </div>
          </div>
        </form>
      )}

      {viewingContact ? (
        <div className="contact-detail">
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, var(--card-bg) 0%, #064e3b 100%)',
            border: '1px solid var(--emerald)',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{viewingContact.displayName}</h2>
            <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1.5rem' }}>ID: {viewingContact.playerId}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} opacity={0.6} /> <span>{viewingContact.primaryLocation}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sword size={16} opacity={0.6} /> 
                <div style={{ display: 'flex', gap: '4px' }}>
                  {viewingContact.favoriteDeckColors.map(c => <span key={c}>{COLOR_UI[c].icon}</span>)}
                  <span>{viewingContact.favoriteDeck}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                {viewingContact.achievements}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">メモ (対戦時の印象など)</label>
            <textarea
              className="form-textarea"
              rows="4"
              value={memoInput || viewingContact.memo}
              onChange={e => setMemoInput(e.target.value)}
              placeholder="〇〇デッキを使っていた、プレイスタイルなど..."
            />
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => handleUpdateMemo(viewingContact.id)}
            >
              メモを更新
            </button>
          </div>
        </div>
      ) : (
        <div className="contacts-list">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className="card" 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => {
                setViewingContact(contact);
                setMemoInput(contact.memo);
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{contact.displayName}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span>{contact.primaryLocation}</span>
                  <span>•</span>
                  <span>{new Date(contact.exchangedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {contact.favoriteDeckColors.map(c => <span key={c}>{COLOR_UI[c].icon}</span>)}
              </div>
            </div>
          ))}
          {contacts.length === 0 && (
            <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>交換したカードがありません</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Contacts;
