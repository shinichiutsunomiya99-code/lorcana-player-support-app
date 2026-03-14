import React, { useState } from 'react';
import { useData } from './hooks/useData';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Decks from './pages/Decks';
import Events from './pages/Events';
import Matches from './pages/Matches';
import MatchupNotes from './pages/MatchupNotes';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Contacts from './pages/Contacts';
import Exchange from './pages/Exchange';
import LoreCounter from './pages/LoreCounter';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const data = useData();

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home setCurrentPage={setCurrentPage} data={data} />;
      case 'decks': return <Decks data={data} />;
      case 'events': return <Events data={data} />;
      case 'matches': return <Matches data={data} />;
      case 'notes': return <MatchupNotes data={data} />;
      case 'stats': return <Stats data={data} />;
      case 'profile': return <Profile setCurrentPage={setCurrentPage} data={data} />;
      case 'contacts': return <Contacts data={data} />;
      case 'exchange': return <Exchange data={data} />;
      case 'lore': return <LoreCounter />;
      case 'settings': return <Settings data={data} />;
      default: return <Home setCurrentPage={setCurrentPage} data={data} />;
    }
  };

  return (
    <div className="app-container">
      <main style={{ paddingBottom: '80px' }}>
        {renderPage()}
      </main>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
