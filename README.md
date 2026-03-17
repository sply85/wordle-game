# Wordle Game

A web‑based clone of the popular word‑guessing game Wordle. Players have 6 attempts to guess a 5‑letter word, with color‑coded feedback after each guess.

## Features

- 6×5 grid of letter tiles
- On‑screen keyboard with visual feedback
- Physical keyboard support
- Color‑coded feedback:
  - **Green:** Letter is correct and in the right position
  - **Yellow:** Letter is in the word but wrong position  
  - **Gray:** Letter is not in the word
- Animations: tile flip on reveal, row shake on invalid guess, win celebration
- Responsive design (works on mobile and desktop)
- New game / Play Again button
- Word validation against a curated word list

## How to Play

1. **Goal:** Guess the hidden 5‑letter word in 6 tries.
2. **Enter a guess:** Type letters using your physical keyboard or click the on‑screen keyboard.
3. **Submit:** Press Enter (or click ENTER on‑screen) when you have 5 letters.
4. **Feedback:** After each guess, the tiles will change color to show how close your guess was.
5. **Win:** Get all 5 letters green.
6. **Lose:** After 6 incorrect guesses, the game ends and reveals the answer.
7. **Play again:** Click the "New Game" button to start fresh.

## Project Structure

```
wordle-game/
├── index.html          # Main HTML structure
├── style.css           # CSS styles and animations
├── script.js           # Game logic and interactivity
├── Dockerfile          # Docker configuration for nginx
├── docker-compose.yml  # Compose file for port 9100
└── README.md           # This file
```

## Deployment

### Docker Compose (Recommended)

The game is configured to run on port 9100:

```bash
cd /shared/projects/wordle-game
docker compose up -d
```

Then open: http://100.75.237.108:9100

### Manual Static Hosting

Any static web server can serve the files. Example with Python:

```bash
cd /shared/projects/wordle-game
python3 -m http.server 8080
```

## Development

- **Word lists:** Curated lists of 5‑letter words in `script.js`
- **CSS variables:** Color scheme supports light/dark mode via `prefers-color-scheme`
- **Animations:** CSS keyframes for tile flip, shake, and celebration

## Testing

Test cases are documented in `/shared/test‑scripts/wordle‑tests.md`.

Main test scenarios:

1. Page loads with empty grid and keyboard
2. Keyboard input (physical and on‑screen)
3. Word validation and feedback
4. Win/lose conditions
5. New game functionality
6. Mobile responsiveness

## Credits

- Design and implementation by Dev Agent for Veridian ERP
- Original Wordle concept by Josh Wardle
- Colors adapted from official Wordle palette
- Font: Inter (Google Fonts)
- Icons: Font Awesome

## License

Open source for educational/demo purposes.