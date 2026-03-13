import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const add = (item) => {
    const newItem = {
      ...item,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setValue(prev => [...prev, newItem]);
    return newItem;
  };

  const update = (id, updates) => {
    setValue(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
  };

  const remove = (id) => {
    setValue(prev => prev.filter(item => item.id !== id));
  };

  const getById = (id) => value.find(item => item.id === id);

  return [value, { add, update, remove, getById }];
}

export function useLocalStorageValue(key, initialValue) {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function useData() {
  const [decks, deckOps] = useLocalStorage('lorcana_decks', []);
  const [events, eventOps] = useLocalStorage('lorcana_events', []);
  const [matches, matchOps] = useLocalStorage('lorcana_matches', []);
  const [notes, noteOps] = useLocalStorage('lorcana_notes', []);
  const [profile, setProfile] = useLocalStorageValue('lorcana_profile', {
    userId: uuidv4(),
    playerId: Math.random().toString(36).substr(2, 9).toUpperCase(),
    displayName: 'Player',
    favoriteCharacter: '',
    primaryLocation: '',
    achievements: '',
    favoriteDeck: '',
    favoriteDeckColors: [],
    snsX: '',
    snsYouTube: '',
    snsInstagram: '',
    snsCustom: '',
    oneLiner: '',
    bio: ''
  });
  const [contacts, contactOps] = useLocalStorage('lorcana_contacts', []);

  const exportData = () => {
    const data = {
      lorcana_decks: decks,
      lorcana_events: events,
      lorcana_matches: matches,
      lorcana_notes: notes,
      lorcana_profile: profile,
      lorcana_contacts: contacts,
      version: '1.1',
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.lorcana_decks) localStorage.setItem('lorcana_decks', JSON.stringify(data.lorcana_decks));
      if (data.lorcana_events) localStorage.setItem('lorcana_events', JSON.stringify(data.lorcana_events));
      if (data.lorcana_matches) localStorage.setItem('lorcana_matches', JSON.stringify(data.lorcana_matches));
      if (data.lorcana_notes) localStorage.setItem('lorcana_notes', JSON.stringify(data.lorcana_notes));
      if (data.lorcana_profile) localStorage.setItem('lorcana_profile', JSON.stringify(data.lorcana_profile));
      if (data.lorcana_contacts) localStorage.setItem('lorcana_contacts', JSON.stringify(data.lorcana_contacts));
      window.location.reload();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return {
    decks, deckOps,
    events, eventOps,
    matches, matchOps,
    notes, noteOps,
    profile, setProfile,
    contacts, contactOps,
    exportData, importData
  };
}
