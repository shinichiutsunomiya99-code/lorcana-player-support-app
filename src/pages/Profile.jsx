import React, { useState, useRef } from 'react';
import { Save, User as UserIcon, Award, MapPin, Heart, Settings as SettingsIcon, Camera, Twitter, Youtube, Instagram, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { COLORS, COLOR_UI } from '../lib/constants';

const Profile = ({ data, setCurrentPage }) => {
  const { profile, setProfile } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const fileInputRef = useRef(null);

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        const size = Math.min(width, height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const offsetX = (width - size) / 2;
        const offsetY = (height - size) / 2;

        const drawCanvas = document.createElement('canvas');
        drawCanvas.width = width;
        drawCanvas.height = height;
        const drawCtx = drawCanvas.getContext('2d');
        drawCtx.drawImage(img, 0, 0, width, height);
        
        ctx.drawImage(drawCanvas, offsetX, offsetY, size, size, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFormData({ ...formData, avatar: dataUrl });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const toggleFavoriteColor = (color) => {
    setFormData(prev => {
      const current = prev.favoriteDeckColors || [];
      if (current.includes(color)) {
        return { ...prev, favoriteDeckColors: current.filter(c => c !== color) };
      }
      if (current.length >= 2) return prev;
      return { ...prev, favoriteDeckColors: [...current, color] };
    });
  };

  return (
    <div className="profile-page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: 0 }}>Illumineer</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn card" onClick={() => setCurrentPage('settings')} style={{ padding: '0.5rem' }}>
            <SettingsIcon size={20} />
          </button>
          <button className="btn btn-primary" onClick={() => {
            if (isEditing) {
              setFormData({ ...profile });
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="card glow-effect fade-in" style={{ border: '1px solid var(--accent)' }}>
          <div className="form-group" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                background: 'var(--card-bg)', 
                margin: '0 auto',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontFamily: 'Cinzel, serif',
                border: '2px dashed var(--border-muted)',
                overflow: 'hidden',
                cursor: 'pointer'
              }} onClick={() => fileInputRef.current?.click()}>
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  formData.displayName.charAt(0)
                )}
              </div>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ position: 'absolute', bottom: 0, right: 0, padding: '0.4rem', borderRadius: '50%' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={16} />
              </button>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />
            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.5rem' }}>推奨: 真四角の画像</div>
          </div>

          <div className="form-group">
            <label className="form-label">Display Name *</label>
            <input
              className="form-input"
              required
              value={formData.displayName}
              onChange={e => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">一言コメント (一文程度)</label>
            <input
              className="form-input"
              value={formData.oneLiner || ''}
              onChange={e => setFormData({ ...formData, oneLiner: e.target.value })}
              placeholder="例：最高のインク使いを目指しています！"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label"><Twitter size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> X ID</label>
              <input
                className="form-input"
                value={formData.snsX || ''}
                onChange={e => setFormData({ ...formData, snsX: e.target.value })}
                placeholder="@username"
              />
            </div>
            <div className="form-group">
              <label className="form-label"><Youtube size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> YouTube</label>
              <input
                className="form-input"
                value={formData.snsYouTube || ''}
                onChange={e => setFormData({ ...formData, snsYouTube: e.target.value })}
                placeholder="Channel ID / URL"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label"><Instagram size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> Instagram</label>
              <input
                className="form-input"
                value={formData.snsInstagram || ''}
                onChange={e => setFormData({ ...formData, snsInstagram: e.target.value })}
                placeholder="username"
              />
            </div>
            <div className="form-group">
              <label className="form-label"><LinkIcon size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> 自由欄 (Link)</label>
              <input
                className="form-input"
                value={formData.snsCustom || ''}
                onChange={e => setFormData({ ...formData, snsCustom: e.target.value })}
                placeholder="Other SNS / URL"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Favorite Character</label>
            <input
              className="form-input"
              value={formData.favoriteCharacter}
              onChange={e => setFormData({ ...formData, favoriteCharacter: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Primary Location</label>
            <input
              className="form-input"
              value={formData.primaryLocation}
              onChange={e => setFormData({ ...formData, primaryLocation: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Achievements / Lore</label>
            <input
              className="form-input"
              value={formData.achievements}
              onChange={e => setFormData({ ...formData, achievements: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Favorite Ink Colors</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {Object.values(COLORS).filter(c => c !== 'UNKNOWN').map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleFavoriteColor(color)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: (formData.favoriteDeckColors || []).includes(color) ? 'var(--border)' : 'var(--border-muted)',
                    background: (formData.favoriteDeckColors || []).includes(color) ? 'rgba(255,255,255,0.1)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span className={`ink-dot ${COLOR_UI[color].inkClass}`}></span>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'Cinzel, serif' }}>{COLOR_UI[color].label}</span>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Save size={20} />
            <span>Save Magic</span>
          </button>
        </form>
      ) : (
        <div className="card glow-effect fade-in" style={{ 
          background: 'linear-gradient(135deg, rgba(16,24,38,0.95) 0%, rgba(30,20,50,0.95) 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '2rem 1.5rem',
          minHeight: '450px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.05, transform: 'rotate(15deg)' }}>
            <UserIcon size={250} />
          </div>
          
          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: profile.avatar ? 'transparent' : 'var(--accent)', 
                margin: '0 auto 1rem',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                fontFamily: 'Cinzel, serif',
                boxShadow: '0 0 20px rgba(218, 112, 214, 0.4)',
                border: '2px solid var(--border)',
                overflow: 'hidden'
              }}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile.displayName.charAt(0)
                )}
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{profile.displayName}</h2>
              <div style={{ fontSize: '0.8rem', opacity: 0.6, fontFamily: 'Cinzel, serif', letterSpacing: '2px', marginBottom: '1rem' }}>ID: {profile.playerId}</div>
              
              {profile.oneLiner && (
                <div style={{ 
                  margin: '0 auto 1.5rem', 
                  fontSize: '0.95rem', 
                  fontStyle: 'italic', 
                  color: 'var(--amber)',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  display: 'inline-block',
                  border: '1px solid rgba(255,215,0,0.1)'
                }}>
                  "{profile.oneLiner}"
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                {profile.snsX && <Twitter size={20} style={{ opacity: 0.8 }} title={profile.snsX} />}
                {profile.snsYouTube && <Youtube size={20} style={{ opacity: 0.8 }} title={profile.snsYouTube} />}
                {profile.snsInstagram && <Instagram size={20} style={{ opacity: 0.8 }} title={profile.snsInstagram} />}
                {profile.snsCustom && <LinkIcon size={20} style={{ opacity: 0.8 }} title={profile.snsCustom} />}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Heart size={18} color="var(--ruby)" style={{ filter: 'drop-shadow(0 0 5px var(--ruby))' }} />
                <div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.5, fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>FAVORITE GLIMMER</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{profile.favoriteCharacter || 'Unknown Magic'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MapPin size={18} color="var(--sapphire)" style={{ filter: 'drop-shadow(0 0 5px var(--sapphire))' }} />
                <div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.5, fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>REALM / LOCATION</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{profile.primaryLocation || 'Wandering'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Award size={18} color="var(--amber)" style={{ filter: 'drop-shadow(0 0 5px var(--amber))' }} />
                <div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.5, fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>LORE ACHIEVED</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{profile.achievements || 'Journey just began'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', width: '18px', justifyContent: 'center', filter: 'drop-shadow(0 0 5px #fff)' }}>✨</div>
                <div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.5, fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>MASTERED INKS</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                    {(profile.favoriteDeckColors || []).length > 0 ? (
                      profile.favoriteDeckColors.map(c => <span key={c} className={`ink-dot ${COLOR_UI[c].inkClass}`} title={COLOR_UI[c].label}></span>)
                    ) : <span style={{ opacity: 0.5, fontStyle: 'italic' }}>None yet</span>}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.3, fontFamily: 'Cinzel, serif', fontSize: '0.7rem', letterSpacing: '4px' }}>
              ✦ LORCANA ARCHIVE ✦
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
