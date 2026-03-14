import React, { useState, useEffect } from 'react';
import { RotateCcw, Swords, Trophy, Dices, ChevronUp, ChevronDown } from 'lucide-react';

const LoreCounter = () => {
  const [player1Lore, setPlayer1Lore] = useState(0);
  const [player2Lore, setPlayer2Lore] = useState(0);
  const [player1Die, setPlayer1Die] = useState(null);
  const [player2Die, setPlayer2Die] = useState(null);
  const [firstPlayer, setFirstPlayer] = useState(null);
  const [winner, setWinner] = useState(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (player1Lore >= 20) setWinner('Player 1');
    else if (player2Lore >= 20) setWinner('Player 2');
    else setWinner(null);
  }, [player1Lore, player2Lore]);

  const rollDice = () => {
    setRolling(true);
    setFirstPlayer(null);
    let count = 0;
    const interval = setInterval(() => {
      setPlayer1Die(Math.floor(Math.random() * 6) + 1);
      setPlayer2Die(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        const p1 = Math.floor(Math.random() * 6) + 1;
        const p2 = Math.floor(Math.random() * 6) + 1;
        setPlayer1Die(p1);
        setPlayer2Die(p2);
        setRolling(false);
        if (p1 > p2) setFirstPlayer('Player 1');
        else if (p2 > p1) setFirstPlayer('Player 2');
        else setFirstPlayer('Draw');
      }
    }, 50);
  };

  const resetGame = () => {
    if (confirm('Reset the game?')) {
      setPlayer1Lore(0);
      setPlayer2Lore(0);
      setPlayer1Die(null);
      setPlayer2Die(null);
      setFirstPlayer(null);
      setWinner(null);
    }
  };

  const adjustLore = (player, amount) => {
    if (winner) return;
    if (player === 1) {
      setPlayer1Lore(Math.max(0, player1Lore + amount));
    } else {
      setPlayer2Lore(Math.max(0, player2Lore + amount));
    }
  };

  const PlayerSection = ({ playerNum, lore, dieValue, isFirst, isWinner, onAdjust }) => {
    const isOpponent = playerNum === 1; // P1 is top (rotated)
    return (
      <div className={`lore-section ${isOpponent ? 'opponent' : ''} ${isWinner ? 'winner-bg' : ''}`}>
        <div className="lore-content">
          <div className="player-meta">
            <span className="player-name">Player {playerNum}</span>
            {isFirst && <span className="turn-indicator">{isFirst === 'Draw' ? 'Draw!' : 'Goes First!'}</span>}
          </div>

          <div className="lore-display">
            <div className="lore-value">{lore}</div>
            <div className="lore-label">LORE</div>
          </div>

          <div className="lore-controls">
            <div className="control-row">
              <button className="lore-btn minus" onClick={() => onAdjust(-2)}>-2</button>
              <button className="lore-btn minus" onClick={() => onAdjust(-1)}>-1</button>
              <button className="lore-btn plus" onClick={() => onAdjust(1)}>+1</button>
              <button className="lore-btn plus" onClick={() => onAdjust(2)}>+2</button>
            </div>
          </div>

          {dieValue !== null && (
            <div className="die-display">
               <Dices size={16} /> {dieValue}
            </div>
          )}
        </div>
        
        {isWinner && (
          <div className="victory-overlay">
            <Trophy size={48} className="victory-icon" />
            <div className="victory-text">VICTORY</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lore-counter-container fade-in">
      <PlayerSection 
        playerNum={1} 
        lore={player1Lore} 
        dieValue={player1Die}
        isFirst={firstPlayer === 'Player 1' || (firstPlayer === 'Draw' && 'Draw') ? firstPlayer : null}
        isWinner={winner === 'Player 1'}
        onAdjust={(amt) => adjustLore(1, amt)}
      />

      <div className="lore-divider">
        <button className="lore-tool-btn" onClick={rollDice} disabled={rolling}>
          <Dices size={24} />
          <span>{rolling ? '...' : (firstPlayer === 'Draw' ? 'Re-roll' : 'Roll')}</span>
        </button>
        <button className="lore-tool-btn reset" onClick={resetGame}>
          <RotateCcw size={24} />
          <span>Reset</span>
        </button>
      </div>

      <PlayerSection 
        playerNum={2} 
        lore={player2Lore} 
        dieValue={player2Die}
        isFirst={firstPlayer === 'Player 2' || (firstPlayer === 'Draw' && 'Draw') ? firstPlayer : null}
        isWinner={winner === 'Player 2'}
        onAdjust={(amt) => adjustLore(2, amt)}
      />
    </div>
  );
};

export default LoreCounter;
