import React, { useState, useEffect, useCallback } from 'react';
import { Shuffle, Trophy, Clock } from 'lucide-react';

const SlidePuzzle = () => {
  // ====================================
  // Image URL Setting (Change this)
  // ====================================
  const IMAGE_URL = 'https://i.imgur.com/placeholder.png';
  
  const [difficulty, setDifficulty] = useState(3);
  const [tiles, setTiles] = useState([]);
  const [emptyPos, setEmptyPos] = useState({ row: 0, col: 0 });
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestTime, setBestTime] = useState(null);

  const TIME_LIMIT = 600; // Time limit: 600 seconds

  // Timer
  useEffect(() => {
    let interval;
    if (isPlaying && !isComplete && !gameOver) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev >= TIME_LIMIT - 1) {
            setGameOver(true);
            setIsPlaying(false);
            return TIME_LIMIT;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isComplete, gameOver]);

  // Initialize puzzle
  const initializePuzzle = useCallback(() => {
    const total = difficulty * difficulty;
    const newTiles = Array.from({ length: total }, (_, i) => i + 1);
    
    // Shuffle (ensures solvable pattern)
    const shuffled = [...newTiles];
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.indexOf(total);
      const emptyRow = Math.floor(emptyIndex / difficulty);
      const emptyCol = emptyIndex % difficulty;
      
      const possibleMoves = [];
      if (emptyRow > 0) possibleMoves.push(-difficulty);
      if (emptyRow < difficulty - 1) possibleMoves.push(difficulty);
      if (emptyCol > 0) possibleMoves.push(-1);
      if (emptyCol < difficulty - 1) possibleMoves.push(1);
      
      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      const swapIndex = emptyIndex + move;
      [shuffled[emptyIndex], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[emptyIndex]];
    }
    
    setTiles(shuffled);
    const emptyIndex = shuffled.indexOf(total);
    setEmptyPos({
      row: Math.floor(emptyIndex / difficulty),
      col: emptyIndex % difficulty
    });
    setMoves(0);
    setTimer(0);
    setIsComplete(false);
    setGameOver(false);
    setIsPlaying(true);
  }, [difficulty]);

  // Check completion
  useEffect(() => {
    if (tiles.length === 0) return;
    
    const isCorrect = tiles.every((tile, index) => tile === index + 1);
    if (isCorrect && isPlaying) {
      setIsComplete(true);
      setIsPlaying(false);
      if (!bestTime || timer < bestTime) {
        setBestTime(timer);
      }
    }
  }, [tiles, isPlaying, timer, bestTime]);

  // Tile click handler
  const handleTileClick = (row, col) => {
    if (!isPlaying || isComplete || gameOver) return;
    
    const rowDiff = Math.abs(row - emptyPos.row);
    const colDiff = Math.abs(col - emptyPos.col);
    
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      const clickedIndex = row * difficulty + col;
      const emptyIndex = emptyPos.row * difficulty + emptyPos.col;
      
      const newTiles = [...tiles];
      [newTiles[clickedIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[clickedIndex]];
      
      setTiles(newTiles);
      setEmptyPos({ row, col });
      setMoves(prev => prev + 1);
    }
  };

  // Change difficulty
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setIsPlaying(false);
    setTiles([]);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      padding: '2rem',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            SLIDE PUZZLE
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#999',
            fontWeight: '300'
          }}>
            Complete the puzzle within time limit
          </p>
        </div>

        {/* Control Panel */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Difficulty Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              color: '#aaa',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              DIFFICULTY
            </label>
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              {[
                { label: 'EASY', value: 3 },
                { label: 'NORMAL', value: 4 },
                { label: 'HARD', value: 5 }
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleDifficultyChange(value)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: difficulty === value 
                      ? 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    border: difficulty === value 
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: difficulty === value ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (difficulty !== value) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (difficulty !== value) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                >
                  {label} ({value}×{value})
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '0.75rem'
          }}>
            <button
              onClick={initializePuzzle}
              disabled={tiles.length > 0 && isPlaying}
              style={{
                flex: 1,
                padding: '1rem',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: tiles.length > 0 && isPlaying ? 'not-allowed' : 'pointer',
                opacity: tiles.length > 0 && isPlaying ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)'
              }}
            >
              <Shuffle size={20} />
              {tiles.length === 0 ? 'START GAME' : 'RESTART'}
            </button>
          </div>
        </div>

        {/* Status Display */}
        {tiles.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.85rem',
                color: '#999',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                MOVES
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#ff6b6b'
              }}>
                {moves}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.85rem',
                color: '#999',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                ELAPSED TIME
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: timer >= TIME_LIMIT * 0.8 ? '#ff5252' : '#4CAF50'
              }}>
                {formatTime(timer)}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.85rem',
                color: '#999',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                TIME LEFT
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: timer >= TIME_LIMIT * 0.8 ? '#ff5252' : '#fff'
              }}>
                {formatTime(TIME_LIMIT - timer)}
              </div>
            </div>
          </div>
        )}

        {/* Puzzle Board */}
        {tiles.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${difficulty}, 1fr)`,
              gap: '8px',
              maxWidth: '600px',
              margin: '0 auto',
              aspectRatio: '1'
            }}>
              {tiles.map((tile, index) => {
                const row = Math.floor(index / difficulty);
                const col = index % difficulty;
                const isEmpty = tile === difficulty * difficulty;
                const tileSize = 100 / difficulty;
                
                return (
                  <div
                    key={index}
                    onClick={() => handleTileClick(row, col)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      background: isEmpty ? 'rgba(0, 0, 0, 0.3)' : '#fff',
                      borderRadius: '12px',
                      cursor: !isEmpty && isPlaying ? 'pointer' : 'default',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      transform: !isEmpty && isPlaying ? 'scale(1)' : 'scale(0.98)',
                      boxShadow: isEmpty ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.3)',
                      border: isEmpty ? '2px dashed rgba(255, 255, 255, 0.2)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isEmpty && isPlaying) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isEmpty && isPlaying) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                      }
                    }}
                  >
                    {!isEmpty && (
                      <>
                        {/* Image */}
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${IMAGE_URL})`,
                          backgroundSize: `${difficulty * 100}% ${difficulty * 100}%`,
                          backgroundPosition: `${((tile - 1) % difficulty) * tileSize}% ${Math.floor((tile - 1) / difficulty) * tileSize}%`
                        }} />
                        
                        {/* Number */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: difficulty === 5 ? '0.7rem' : '0.85rem',
                          fontWeight: '700',
                          backdropFilter: 'blur(4px)'
                        }}>
                          {tile}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clear Message */}
        {isComplete && (
          <div style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
            marginBottom: '2rem'
          }}>
            <Trophy size={48} style={{ marginBottom: '1rem' }} />
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
              🎉 CLEAR!
            </h2>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9
            }}>
              Time: {formatTime(timer)} | Moves: {moves}
            </p>
            {bestTime === timer && (
              <p style={{
                fontSize: '1rem',
                marginTop: '0.5rem',
                opacity: 0.8
              }}>
                🏆 New Best Time!
              </p>
            )}
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div style={{
            background: 'linear-gradient(135deg, #ff5252 0%, #ff1744 100%)',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(255, 82, 82, 0.4)',
            marginBottom: '2rem'
          }}>
            <Clock size={48} style={{ marginBottom: '1rem' }} />
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
              TIME OVER
            </h2>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9
            }}>
              Time limit exceeded
            </p>
          </div>
        )}

        {/* Best Time Display */}
        {bestTime !== null && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.85rem',
              color: '#999',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              BEST TIME
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#FFD700'
            }}>
              {formatTime(bestTime)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlidePuzzle;