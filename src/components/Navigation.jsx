import React from 'react';
import { Home, Quote, Calendar, Swords, BarChart2, User, Users, StickyNote } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', emoji: '🏰', label: 'Home' },
    { id: 'decks', emoji: '📜', label: 'Deck Archive' },
    { id: 'matches', emoji: '⚔️', label: 'Match Log' },
    { id: 'events', emoji: '🏆', label: 'Tournaments' },
    { id: 'notes', emoji: '📓', label: 'Notes' },
    { id: 'stats', emoji: '📊', label: 'Lore Analysis' },
    { id: 'exchange', emoji: '🤝', label: 'Illumineer List' },
    { id: 'profile', emoji: '✨', label: 'Illumineer' },
  ];

  return (
    <nav className="nav-bar">
      {navItems.map((item) => {
        return (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
