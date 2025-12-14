# SLIDE PUZZLE GAME

A modern slide puzzle game with time limit and move counter.

![Game Screenshot](./screenshot.png)

## 🎮 Overview

A slide puzzle game where you complete the puzzle within a time limit. Choose from three difficulty levels with timer and move counter.

## ✨ Features

### Core Features
- **Difficulty Selection**: EASY (3×3), NORMAL (4×4), HARD (5×5)
- **Number Display**: Each piece shows a number in the top-left corner (ordered 1-N when solved)
- **Random Shuffle**: Generates only solvable patterns
- **Time Limit**: 600 seconds (10 minutes)
- **Timer**: Real-time display of elapsed and remaining time
- **Move Counter**: Tracks player moves
- **Best Time Recording**: Saves your fastest clear time

### Game Status
- **Clear Detection**: Automatically detects puzzle completion
- **Time Over**: Game over when time limit is exceeded
- **Best Time Update**: Notifies when you beat your personal record

## 🎨 Design

- Modern dark theme
- Glassmorphism UI
- Smooth animations
- Responsive design
- Red as accent color

## 🚀 How to Play

### 1. Start Game
1. Select difficulty (EASY / NORMAL / HARD)
2. Click "START GAME" button
3. Puzzle will be randomly shuffled

### 2. Gameplay
- Click on tiles adjacent to the empty space to move them
- Goal is to arrange numbers in order (1→2→3...)
- Complete the puzzle within 600 seconds

### 3. Clear Condition
- All pieces must be in correct order
- Numbers arranged from top-left to bottom-right
  - EASY (3×3): 1-9
  - NORMAL (4×4): 1-16
  - HARD (5×5): 1-25

### 4. Restart
- "RESTART" button is disabled during gameplay
- Start a new game after clearing or game over

## ⚙️ Customization

### Changing the Image

Edit the `IMAGE_URL` constant on line 7:

```javascript
// ====================================
// Image URL Setting (Change this)
// ====================================
const IMAGE_URL = 'https://github.com/sunsunjp/SlidePuzzle/blob/main/image.png';
```

**Recommended Image Specifications:**
- Square image (1:1 aspect ratio)
- Minimum size: 600×600px
- Recommended size: 1000×1000px or larger
- Format: PNG, JPG, WebP
- Works best with logos, icons, or images with clear composition

### Changing Time Limit

Edit the `TIME_LIMIT` constant on line 13:

```javascript
const TIME_LIMIT = 600; // In seconds (Default: 600 seconds = 10 minutes)
```

## 📋 Technical Specifications

### Technologies Used
- React 18+
- Lucide React (Icons)
- CSS-in-JS (Inline styles)

### Puzzle Generation Algorithm
- Executes 1000 random moves from solved state
- Guarantees only solvable patterns
- Randomly positions empty space

### State Management
- `tiles`: Array of puzzle pieces
- `emptyPos`: Position of empty space
- `moves`: Move counter
- `timer`: Elapsed time
- `isPlaying`: Game in progress flag
- `isComplete`: Clear detection
- `gameOver`: Time over detection
- `bestTime`: Best time record

## 🎯 Game Screen Layout

### Header
- Title: "SLIDE PUZZLE"
- Subtitle: "Complete the puzzle within time limit"

### Control Panel
- Difficulty selection buttons (EASY / NORMAL / HARD)
- Start/Restart button

### Status Display
- **Move Count**: Current number of moves (red)
- **Elapsed Time**: Time since game start (green→red transition)
- **Remaining Time**: Time left until limit

### Puzzle Board
- Grid display (3×3, 4×4, or 5×5 based on difficulty)
- Number displayed in top-left of each piece
- Empty space shown with dashed border
- Pieces scale up on hover

### Results Display
- **Clear**: Green completion message with time and moves
- **Time Over**: Red game over message
- **Best Time**: Gold display of fastest record

## 🔧 Developer Information

### File Structure
```
slide-puzzle.jsx    # Main component
README.md           # This file
Image.png           # Default image
```

### Key Functions
- `initializePuzzle()`: Initialize and shuffle puzzle
- `handleTileClick()`: Handle tile click events
- `formatTime()`: Format time display

### Customization Points
1. Image URL (line 7)
2. Time limit (line 13)
3. Color theme (CSS variables)
4. Difficulty levels (can add to array)

## 📝 License

This project is released under the MIT License.

**Version**: 1.0.0  
**Last Updated**: December 2025