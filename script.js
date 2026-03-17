// Wordle Game - Full Core Logic (Tasks #92-95)
(function() {
    'use strict';

    // DOM Elements
    const gridEl = document.getElementById('grid');
    const messageEl = document.getElementById('message');
    const newGameBtn = document.getElementById('new-game-btn');
    const helpBtn = document.getElementById('help-btn');
    const keyboardButtons = document.querySelectorAll('.keyboard button');

    // Word Lists (Task #92)
    // Answers: common 5‑letter words (subset of Wordle original)
    const ANSWER_LIST = [
        'CRANE', 'TOAST', 'LEMON', 'CHAIR', 'PHONE',
        'CLOUD', 'BRAIN', 'FLAME', 'GRASS', 'STONE',
        'WATER', 'EARTH', 'MONEY', 'HAPPY', 'SMILE',
        'APPLE', 'BEACH', 'CLOCK', 'DOZEN', 'EAGLE',
        'FLUTE', 'GHOST', 'HOUSE', 'IGLOO', 'JELLY',
        'KNIFE', 'LEAFY', 'MAGIC', 'NOISE', 'OCEAN',
        'PIANO', 'QUEEN', 'RIVER', 'SNAKE', 'TIGER',
        'UMBRA', 'VOICE', 'WHEEL', 'YACHT', 'ZEBRA'
    ];

    // Valid guesses: larger list of allowed words (including answers)
    const VALID_GUESSES = ANSWER_LIST.concat([
        'ALBUM', 'BRICK', 'CRISP', 'DREAM', 'ELECT',
        'FROST', 'GLOBE', 'HONEY', 'IVORY', 'JUMBO',
        'KARMA', 'LIMBO', 'MARCH', 'NIGHT', 'OPERA',
        'PLUMB', 'QUIET', 'ROBOT', 'SHINE', 'TRUCK',
        'UNITY', 'VOWEL', 'WHALE', 'XENON', 'YOUTH',
        'ZIPPY', 'ABACK', 'BAGEL', 'CABIN', 'DANCE',
        'EMBER', 'FAITH', 'GRAND', 'HUMOR', 'INBOX',
        'JOKER', 'KAYAK', 'LASER', 'MERRY', 'NERDY',
        'OLIVE', 'PEARL', 'QUART', 'RASPY', 'SALAD',
        'TANGY', 'ULTRA', 'VAPOR', 'WACKY', 'YOGIC',
        'ZONED'
    ]);

    // Game State
    const gameState = {
        currentRow: 0,
        currentGuess: '',
        guesses: Array(6).fill(''),
        feedback: Array(6).fill(Array(5).fill(null)),
        answer: '',
        gameOver: false,
        letterStates: {} // map letter -> status
    };

    // Initialize the 6x5 grid of tiles
    function initGrid() {
        gridEl.innerHTML = '';
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 5; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.row = row;
                tile.dataset.col = col;
                gridEl.appendChild(tile);
            }
        }
    }

    // Update a single tile with letter and optional status
    function updateTile(row, col, letter = '', status = '') {
        const tile = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
        if (!tile) return;
        tile.textContent = letter.toUpperCase();
        tile.classList.remove('filled', 'correct', 'present', 'absent', 'shake');
        if (letter) {
            tile.classList.add('filled');
        }
        if (status) {
            tile.classList.add(status);
        }
    }

    // Update the on-screen keyboard button colors
    function updateKeyboard(letter, status) {
        const key = document.querySelector(`.keyboard button[data-key="${letter.toUpperCase()}"]`);
        if (!key) return;
        // Only upgrade status (correct > present > absent)
        const current = key.classList.contains('correct') ? 'correct' :
                       key.classList.contains('present') ? 'present' :
                       key.classList.contains('absent') ? 'absent' : '';
        if (status === 'correct' || (status === 'present' && current !== 'correct') ||
            (status === 'absent' && current !== 'correct' && current !== 'present')) {
            key.classList.remove('correct', 'present', 'absent');
            key.classList.add(status);
        }
    }

    // Display a temporary message
    function showMessage(text, type = 'info') {
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        if (type === 'error') {
            messageEl.classList.add('shake');
            setTimeout(() => messageEl.classList.remove('shake'), 600);
        }
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'message';
        }, 3000);
    }

    // Shake the current row
    function shakeRow() {
        for (let col = 0; col < 5; col++) {
            const tile = document.querySelector(`.tile[data-row="${gameState.currentRow}"][data-col="${col}"]`);
            if (tile) tile.classList.add('shake');
        }
        setTimeout(() => {
            for (let col = 0; col < 5; col++) {
                const tile = document.querySelector(`.tile[data-row="${gameState.currentRow}"][data-col="${col}"]`);
                if (tile) tile.classList.remove('shake');
            }
        }, 600);
    }

    // Add a letter to current guess
    function addLetter(letter) {
        if (gameState.gameOver || gameState.currentGuess.length >= 5) return;
        gameState.currentGuess += letter;
        updateTile(gameState.currentRow, gameState.currentGuess.length - 1, letter);
    }

    // Remove last letter
    function removeLetter() {
        if (gameState.gameOver || gameState.currentGuess.length === 0) return;
        const col = gameState.currentGuess.length - 1;
        gameState.currentGuess = gameState.currentGuess.slice(0, -1);
        updateTile(gameState.currentRow, col, '');
    }

    // Check if a word is in the valid guess list
    function isWordValid(word) {
        return VALID_GUESSES.includes(word.toUpperCase());
    }

    // Calculate feedback for a guess (green/yellow/gray)
    function getFeedback(guess, answer) {
        guess = guess.toUpperCase();
        answer = answer.toUpperCase();
        const feedback = Array(5).fill('absent');
        const answerCounts = {};
        const guessCounts = {};

        // Count letters in answer
        for (let i = 0; i < 5; i++) {
            const letter = answer[i];
            answerCounts[letter] = (answerCounts[letter] || 0) + 1;
        }

        // First pass: mark correct (green)
        for (let i = 0; i < 5; i++) {
            const letter = guess[i];
            if (letter === answer[i]) {
                feedback[i] = 'correct';
                answerCounts[letter]--;
            }
        }

        // Second pass: mark present (yellow)
        for (let i = 0; i < 5; i++) {
            const letter = guess[i];
            if (feedback[i] !== 'correct' && answerCounts[letter] > 0) {
                feedback[i] = 'present';
                answerCounts[letter]--;
            }
        }

        return feedback;
    }

    // Submit current guess
    function submitGuess() {
        if (gameState.gameOver) return;

        const guess = gameState.currentGuess.toUpperCase();

        if (guess.length !== 5) {
            showMessage('Not enough letters', 'error');
            shakeRow();
            return;
        }

        if (!isWordValid(guess)) {
            showMessage('Not in word list', 'error');
            shakeRow();
            return;
        }

        // Store guess
        gameState.guesses[gameState.currentRow] = guess;
        const feedback = getFeedback(guess, gameState.answer);
        gameState.feedback[gameState.currentRow] = feedback;

        // Update tiles with feedback and flip animations
        for (let col = 0; col < 5; col++) {
            const letter = guess[col];
            const status = feedback[col];
            // Apply flip animation with staggered delay
            setTimeout(() => {
                const tile = document.querySelector(`.tile[data-row="${gameState.currentRow}"][data-col="${col}"]`);
                if (tile) {
                    tile.classList.add('flip');
                    // Update after half of flip animation
                    setTimeout(() => {
                        updateTile(gameState.currentRow, col, letter, status);
                        updateKeyboard(letter, status);
                        gameState.letterStates[letter] = status;
                        // Remove flip class after animation completes
                        setTimeout(() => {
                            tile.classList.remove('flip');
                        }, 300);
                    }, 300);
                }
            }, col * 300); // Stagger each column by 300ms
        }

        // Check win/lose
        if (guess === gameState.answer) {
            gameState.gameOver = true;
            showMessage('🎉 You win!', 'info');
            // Add celebration effect (Task #94)
            document.querySelectorAll('.tile.correct').forEach(tile => {
                tile.style.animationDelay = `${Math.random() * 0.5}s`;
                tile.classList.add('celebrate');
            });
        } else if (gameState.currentRow >= 5) {
            gameState.gameOver = true;
            showMessage(`Game over! The word was ${gameState.answer}.`, 'info');
        } else {
            // Move to next row
            gameState.currentRow++;
            gameState.currentGuess = '';
            showMessage('Next guess...', 'info');
        }
    }

    // Start a new game
    function newGame() {
        // Reset state
        gameState.currentRow = 0;
        gameState.currentGuess = '';
        gameState.guesses = Array(6).fill('');
        gameState.feedback = Array(6).fill(Array(5).fill(null));
        gameState.answer = ANSWER_LIST[Math.floor(Math.random() * ANSWER_LIST.length)];
        gameState.gameOver = false;
        gameState.letterStates = {};

        // Reset UI
        initGrid();
        keyboardButtons.forEach(btn => {
            btn.classList.remove('correct', 'present', 'absent');
        });
        showMessage('New game started! Good luck!');
        console.log('Answer:', gameState.answer); // for debugging
    }

    // Handle physical keyboard input
    function handlePhysicalKeydown(event) {
        if (gameState.gameOver) return;
        const key = event.key.toUpperCase();
        const button = document.querySelector(`.keyboard button[data-key="${key}"]`);
        if (button) button.classList.add('active');
        if (/^[A-Z]$/.test(key)) {
            addLetter(key);
        } else if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'BACKSPACE') {
            removeLetter();
        }
    }

    function handlePhysicalKeyup(event) {
        const key = event.key.toUpperCase();
        const button = document.querySelector(`.keyboard button[data-key="${key}"]`);
        if (button) button.classList.remove('active');
    }

    // Initialize event listeners
    function initEvents() {
        // Physical keyboard
        document.addEventListener('keydown', handlePhysicalKeydown);
        document.addEventListener('keyup', handlePhysicalKeyup);

        // On-screen keyboard
        keyboardButtons.forEach(button => {
            // Visual feedback on press
            button.addEventListener('mousedown', () => button.classList.add('active'));
            button.addEventListener('mouseup', () => button.classList.remove('active'));
            button.addEventListener('mouseleave', () => button.classList.remove('active'));
            button.addEventListener('touchstart', () => button.classList.add('active'));
            button.addEventListener('touchend', () => button.classList.remove('active'));

            // Game action
            button.addEventListener('click', () => {
                if (gameState.gameOver) return;
                const key = button.dataset.key;
                if (key === 'Enter') {
                    submitGuess();
                } else if (key === 'Backspace') {
                    removeLetter();
                } else if (/^[A-Z]$/.test(key)) {
                    addLetter(key);
                }
            });
        });

        // New game button
        newGameBtn.addEventListener('click', newGame);

        // Help button
        helpBtn.addEventListener('click', () => {
            showMessage('Guess the 5‑letter word in 6 tries. Green = correct letter & position, Yellow = letter in word, Gray = letter not in word.', 'info');
        });
    }

    // Initialize the game
    function initGame() {
        initGrid();
        initEvents();
        newGame();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }

})();