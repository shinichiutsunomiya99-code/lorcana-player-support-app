import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Scan, Users, ChevronLeft, Heart, MapPin, Trash2 } from 'lucide-react';
import { COLOR_UI } from '../lib/constants';

const Exchange = ({ data }) => {
  const { profile, contactOps, contacts } = data;
  const [mode, setMode] = useState('list'); // 'list', 'show', 'scan'
  const [viewingContact, setViewingContact] = useState(null);
  const [memoInput, setMemoInput] = useState('');

  // Encode profile data for QR. We intentionally DO NOT include the base64 avatar to keep the QR lightweight.
  const qrData = JSON.stringify({
    type: 'LORCANA_PLAYER_CARD',
    playerId: profile.playerId,
    displayName: profile.displayName,
    favoriteCharacter: profile.favoriteCharacter,
    primaryLocation: profile.primaryLocation,
    achievements: profile.achievements,
    favoriteDeck: profile.favoriteDeck,
    favoriteDeckColors: profile.favoriteDeckColors,
    bio: profile.bio,
    exchangedAt: new Date().toISOString()
  });

  useEffect(() => {
    if (mode === 'scan') {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render((decodedText) => {
        try {
          const parsed = JSON.parse(decodedText);
          if (parsed.type === 'LORCANA_PLAYER_CARD') {
            scanner.clear();
            handleAutoAdd(parsed);
          }
        } catch (e) {
          console.error("Invalid QR code");
        }
      }, (error) => {
        // console.warn(error);
      });

      return () => {
        scanner.clear().catch(err => console.error("Failed to clear scanner", err));
      };
    }
  }, [mode]);

  const handleAutoAdd = (playerData) => {
    const existing = contacts.find(c => c.playerId === playerData.playerId);
    if (existing) {
      alert(`${playerData.displayName} さんは既に登録されています`);
    } else {
      contactOps.add({
        ...playerData,
        exchangedAt: new Date().toISOString(),
        memo: ''
      });
      alert(`${playerData.displayName} さんをコンタクトに追加しました`);
    }
    setMode('list');
  };

  const handleUpdateMemo = () => {
    if (!viewingContact) return;
    contactOps.update(viewingContact.id, { memo: memoInput });
    setViewingContact({ ...viewingContact, memo: memoInput });
    alert('メモを更新しました');
  };

  if (viewingContact) {
    return (
      <div className="contact-detail fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn card" style={{ padding: '0.5rem', marginBottom: 0 }} onClick={() => setViewingContact(null)}>
            <ChevronLeft size={20} />
          </button>
          <h1 style={{ marginBottom: 0 }}>Illumineer Details</h1>
        </div>

        <div className="card glow-effect fade-in" style={{ 
          background: 'linear-gradient(135deg, rgba(16,24,38,0.95) 0%, rgba(30,20,50,0.95) 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '2rem 1.5rem',
          minHeight: '350px',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '1.5rem'
        }}>
          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: viewingContact.avatar ? 'transparent' : 'var(--accent)', 
                margin: '0 auto 1rem',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                fontFamily: 'Cinzel, serif',
                boxShadow: '0 0 20px rgba(218, 112, 214, 0.4)',
                border: '2px solid var(--border)',
                overflow: 'hidden'
              }}>
                {viewingContact.avatar ? (
                  <img src={viewingContact.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  viewingContact.displayName.charAt(0)
                )}
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{viewingContact.displayName}</h2>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, fontFamily: 'Cinzel, serif', letterSpacing: '2px' }}>ID: {viewingContact.playerId}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MapPin size={18} color="var(--sapphire)" style={{ filter: 'drop-shadow(0 0 5px var(--sapphire))' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5, fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>REALM</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>{viewingContact.primaryLocation || 'Unknown'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', width: '18px', justifyContent: 'center', filter: 'drop-shadow(0 0 5px #fff)' }}>✨</div>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5, fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>MASTERED INKS</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    {(viewingContact.favoriteDeckColors || []).length > 0 ? (
                      viewingContact.favoriteDeckColors.map(c => <span key={c} className={`ink-dot ${COLOR_UI[c] ? COLOR_UI[c].inkClass : 'ink-unknown'}`} title={c}></span>)
                    ) : <span style={{ opacity: 0.5, fontStyle: 'italic' }}>None yet</span>}
                  </div>
                </div>
              </div>

              {viewingContact.favoriteCharacter && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Heart size={18} color="var(--ruby)" style={{ filter: 'drop-shadow(0 0 5px var(--ruby))' }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5, fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>FAVORITE GLIMMER</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{viewingContact.favoriteCharacter}</div>
                  </div>
                </div>
              )}

              {viewingContact.achievements && (
                <div style={{ fontSize: '0.85rem', opacity: 0.8, padding: '0.75rem', background: 'rgba(218, 112, 214, 0.1)', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7, fontFamily: 'Cinzel, serif', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>LORE</span>
                  {viewingContact.achievements}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Research Notes (Opponent strategy, etc.)</label>
          <textarea
            className="form-textarea"
            rows="4"
            value={memoInput}
            onChange={e => setMemoInput(e.target.value)}
            placeholder="Document your encounters with this Illumineer..."
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={handleUpdateMemo}
          >
            Save Notes
          </button>
        </div>

        <button className="btn" style={{ width: '100%', marginTop: '2rem', color: '#ef4444', opacity: 0.6 }} onClick={() => {
          if (confirm('Erase this Illumineer from your records?')) {
            contactOps.remove(viewingContact.id);
            setViewingContact(null);
          }
        }}>
          <Trash2 size={16} /> Erase Record
        </button>
      </div>
    );
  }

  return (
    <div className="exchange-page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: 0 }}>Illumineer List</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${mode === 'show' ? 'btn-primary' : 'card'}`} onClick={() => setMode('show')} title="Show My QR">
            <QrCode size={20} />
          </button>
          <button className={`btn ${mode === 'scan' ? 'btn-primary' : 'card'}`} onClick={() => setMode('scan')} title="Scan QR">
            <Scan size={20} />
          </button>
        </div>
      </div>

      {mode === 'show' && (
        <div className="card glow-effect fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', letterSpacing: '1px', color: 'var(--border)', marginBottom: '0.5rem' }}>My Illumineer Card</h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1.5rem' }}>Allow other Illumineers to scan this magical seal to connect.</p>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
            <QRCodeSVG value={qrData} size={200} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              background: profile.avatar ? 'transparent' : 'var(--accent)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'Cinzel, serif',
              boxShadow: '0 0 10px rgba(218, 112, 214, 0.4)',
              border: '2px solid var(--border)',
              overflow: 'hidden'
            }}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                profile.displayName.charAt(0)
              )}
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.5rem', fontFamily: 'Cinzel, serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{profile.displayName}</div>
          <div style={{ opacity: 0.5, fontSize: '0.8rem', letterSpacing: '1px' }}>ID: {profile.playerId}</div>
          <button className="btn card" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setMode('list')}>Close Spellbook</button>
        </div>
      )}

      {mode === 'scan' && (
        <div className="card fade-in">
          <h3 style={{ fontFamily: 'Cinzel, serif', letterSpacing: '1px', color: 'var(--border)', marginBottom: '0.5rem' }}>Scan Seal</h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1rem' }}>Focus your magical lens on another Illumineer's QR seal.</p>
          <div id="reader" style={{ borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--accent)', boxShadow: '0 0 15px var(--accent)' }}></div>
          <button className="btn card" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setMode('list')}>Cancel Spell</button>
        </div>
      )}

      {mode === 'list' && (
        <div className="contacts-list fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', opacity: 0.8, fontFamily: 'Cinzel, serif', letterSpacing: '1px', color: 'var(--border)' }}>
            <Users size={18} />
            <span style={{ fontSize: '0.9rem' }}>Connections: {contacts.length}</span>
          </div>

          {contacts.map(contact => (
            <div key={contact.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', padding: '1rem' }} onClick={() => {
              setViewingContact(contact);
              setMemoInput(contact.memo || '');
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: contact.avatar ? 'transparent' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-muted)', fontSize: '1.2rem', fontFamily: 'Cinzel, serif', color: 'var(--border)', overflow: 'hidden' }}>
                  {contact.avatar ? (
                    <img src={contact.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    contact.displayName.charAt(0)
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Cinzel, serif', marginBottom: '2px' }}>{contact.displayName}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={10} color="var(--ruby)" /> {contact.favoriteCharacter || 'Mysterious'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.4, fontFamily: 'Cinzel, serif' }}>{new Date(contact.exchangedAt).toLocaleDateString()}</span>
                <ChevronLeft size={16} style={{ transform: 'rotate(180deg)', color: 'var(--accent)' }} />
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.5 }}>
              <Users size={64} style={{ marginBottom: '1rem', opacity: 0.2, filter: 'drop-shadow(0 0 10px #fff)' }} />
              <p style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No connections yet</p>
              <p style={{ fontSize: '0.8rem' }}>Use the scan feature to connect with other Illumineers.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Exchange;
