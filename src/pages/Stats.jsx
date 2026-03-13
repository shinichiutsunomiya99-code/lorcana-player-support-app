import React from 'react';
import { Trophy, TrendingUp, User, PieChart } from 'lucide-react';
import { COLOR_UI, RESULTS, PLAY_ORDER } from '../lib/constants';

const Stats = ({ data }) => {
  const { matches, decks, events } = data;

  const calculateWinRate = (m) => {
    if (m.length === 0) return 0;
    const wins = m.filter(match => match.result === RESULTS.WIN).length;
    return Math.round((wins / m.length) * 100);
  };

  const getWLD = (m) => {
    const wins = m.filter(match => match.result === RESULTS.WIN).length;
    const losses = m.filter(match => match.result === RESULTS.LOSE).length;
    const draws = m.filter(match => match.result === RESULTS.DRAW).length;
    return { wins, losses, draws };
  };

  const overallWinRate = calculateWinRate(matches);

  // Detailed win rate by my deck
  const deckStats = decks.map(deck => {
    const deckMatches = matches.filter(m => m.myDeckId === deck.id);
    const { wins, losses, draws } = getWLD(deckMatches);
    return {
      name: deck.name,
      colors: deck.colors,
      winRate: calculateWinRate(deckMatches),
      count: deckMatches.length,
      wins, losses, draws
    };
  }).sort((a, b) => b.count - a.count);

  // Win rate by opponent deck (Color + Type)
  const opponentDeckMap = {};
  matches.forEach(m => {
    const colorKey = m.opponentColors.sort().join(',');
    const typeKey = m.opponentDeckType || '不明';
    const key = `${colorKey}|${typeKey}`;
    
    if (!opponentDeckMap[key]) {
      opponentDeckMap[key] = {
        colors: m.opponentColors,
        type: typeKey,
        matches: []
      };
    }
    opponentDeckMap[key].matches.push(m);
  });

  const opponentDeckStats = Object.values(opponentDeckMap).map(stat => {
    const { wins, losses, draws } = getWLD(stat.matches);
    return {
      colors: stat.colors,
      type: stat.type,
      winRate: calculateWinRate(stat.matches),
      count: stat.matches.length,
      wins, losses, draws
    };
  }).sort((a, b) => b.count - a.count);

  // Win rate by play order
  const firstMatches = matches.filter(m => m.playOrder === PLAY_ORDER.FIRST);
  const secondMatches = matches.filter(m => m.playOrder === PLAY_ORDER.SECOND);
  const firstWinRate = calculateWinRate(firstMatches);
  const secondWinRate = calculateWinRate(secondMatches);

  return (
    <div className="stats-page fade-in">
      <h1 style={{ marginBottom: '0.25rem' }}>Lore Analysis</h1>
      <div style={{ opacity: 0.7, marginBottom: '2rem', fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>
        Illumineer Battle Records
      </div>

      <div className="card glow-effect" style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'linear-gradient(135deg, rgba(16,24,38,0.9) 0%, rgba(40,20,60,0.8) 100%)', border: '1px solid var(--accent)' }}>
        <Trophy size={48} color="var(--border)" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))' }} />
        <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Cinzel, serif', color: '#fff', textShadow: '0 0 15px var(--accent)' }}>
          {overallWinRate}%
        </div>
        <div style={{ opacity: 0.8, fontFamily: 'Cinzel, serif', letterSpacing: '2px', marginTop: '0.5rem' }}>
          OVERALL WIN RATE ({matches.length} MATCHES)
        </div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem', fontFamily: 'Cinzel, serif' }}>FIRST</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Cinzel, serif', color: 'var(--sapphire)' }}>{firstWinRate}%</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>{firstMatches.length} Matches</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem', fontFamily: 'Cinzel, serif' }}>SECOND</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Cinzel, serif', color: 'var(--ruby)' }}>{secondWinRate}%</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>{secondMatches.length} Matches</div>
        </div>
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--border)' }}>✨ My Deck Performance</h2>
        {deckStats.map(stat => (
          <div key={stat.name} className="card" style={{ borderLeft: '3px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex' }}>
                  {stat.colors.map(c => <span key={c} className={`ink-dot ink-${c.toLowerCase()}`} title={c}></span>)}
                </div>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{stat.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Cinzel, serif', color: 'var(--border)' }}>{stat.winRate}%</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.7 }}>
              <span>{stat.count} MATCHES</span>
              <span style={{ fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>{stat.wins}W / {stat.losses}L / {stat.draws}D</span>
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: '2rem', paddingBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--border)' }}>🔮 Opponent Matchups</h2>
        <div className="card">
          {opponentDeckStats.map((stat, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {stat.colors.map(c => <span key={c} className={`ink-dot ink-${c.toLowerCase()}`} title={c}></span>)} {stat.type}
                </span>
                <span style={{ fontWeight: 600, fontFamily: 'Cinzel, serif' }}>{stat.winRate}% ({stat.wins}W-{stat.losses}L)</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${stat.winRate}%`, 
                  background: stat.colors.length > 0 ? `var(--${stat.colors[0].toLowerCase()}-gradient)` : 'var(--accent)',
                  borderRadius: '3px',
                  boxShadow: '0 0 8px rgba(255,255,255,0.5)'
                }}></div>
              </div>
            </div>
          ))}
          {opponentDeckStats.length === 0 && (
            <p style={{ textAlign: 'center', opacity: 0.5, fontStyle: 'italic' }}>No research data available yet...</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Stats;
