import React from 'react';
import { Swords, Calendar, Book, BarChart2, User, Users, PlusCircle } from 'lucide-react';

const Home = ({ setCurrentPage, data }) => {
  const { matches, decks } = data;

  const quickActions = [
    { id: 'matches', label: '試合を記録', icon: PlusCircle, color: '#6366f1' },
    { id: 'decks', label: 'デッキ管理', icon: Book, color: '#e91e63' },
    { id: 'events', label: '大会ログ', icon: Calendar, color: '#2196f3' },
    { id: 'notes', label: 'マッチアップノート', icon: Swords, color: '#4caf50' },
  ];

  const subActions = [
    { id: 'stats', label: '統計・分析', icon: BarChart2 },
    { id: 'contacts', label: '交換カード一覧', icon: Users },
    { id: 'profile', label: 'マイプロフィール', icon: User },
  ];

  return (
    <div className="home-page fade-in">
      <header style={{ marginBottom: '2.5rem', textAlign: 'center', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#fff', textShadow: '0 0 15px var(--accent)', marginBottom: '0.25rem', letterSpacing: '1px' }}>Lorcana Archive</h1>
        <p style={{ opacity: 0.7, fontFamily: 'Cinzel, serif', letterSpacing: '2px', fontSize: '0.8rem' }}>ILLUMINEER SUPPORT SYSTEM</p>
      </header>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {quickActions.map(action => (
          <button
            key={action.id}
            className="card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.75rem',
              borderColor: action.id === 'matches' ? action.color : 'var(--border)',
              padding: '1.5rem 1rem'
            }}
            onClick={() => setCurrentPage(action.id)}
          >
            <action.icon size={32} color={action.color} />
            <span style={{ fontWeight: 600 }}>{action.label}</span>
          </button>
        ))}
      </div>

      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', opacity: 0.8 }}>最近の状況</h2>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{matches.length}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>試合数</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }}></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{decks.length}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>デッキ数</div>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        {subActions.map(action => (
          <button
            key={action.id}
            className="btn card"
            style={{ marginBottom: 0, justifyContent: 'flex-start', padding: '1rem' }}
            onClick={() => setCurrentPage(action.id)}
          >
            <action.icon size={20} />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
