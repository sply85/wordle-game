// Wordle Game - Core Script
// Initialization for Task #91 (basic HTML structure)
// Game logic will be added in Task #92

(function() {
    'use strict';

    // DOM Elements
    const gridEl = document.getElementById('grid');
    const messageEl = document.getElementById('message');
    const newGameBtn = document.getElementById('new-game-btn');
    const helpBtn = document.getElementById('help-btn');
    const keyboardButtons = document.querySelectorAll('.keyboard button');

    // Game State
    const gameState = {
        currentRow: 0,
        currentGuess: '',
        guesses: Array(6).fill(''),
        feedback: Array(6).fill(Array(5).fill(null)),
        answer: 'CRANE', // placeholder answer (Task #92 will randomize)
        gameOver: false,
        wordList: [], // populated later
        answerList: [] // populated later
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
        tile.classList.remove('filled', 'correct', 'present', 'absent');
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
        if (status === 'correct' || (status === 'present' && !key.classList.contains('correct')) ||
            (status === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present'))) {
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

    // Handle physical keyboard input
    function handlePhysicalKeydown(event) {
        if (gameState.gameOver) return;
        const key = event.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
            addLetter(key);
        } else if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'BACKSPACE') {
            removeLetter();
        }
    }

    // Add a letter to current guess
    function addLetter(letter) {
        if (gameState.currentGuess.length >= 5) return;
        gameState.currentGuess += letter;
        updateTile(gameState.currentRow, gameState.currentGuess.length - 1, letter);
    }

    // Remove last letter
    function removeLetter() {
        if (gameState.currentGuess.length === 0) return;
        const col = gameState.currentGuess.length - 1;
        gameState.currentGuess = gameState.currentGuess.slice(0, -1);
        updateTile(gameState.currentRow, col, '');
    }

    // Submit current guess (placeholder for Task #92)
    function submitGuess() {
        if (gameState.currentGuess.length !== 5) {
            showMessage('Not enough letters', 'error');
            return;
        }
        // For Task #91, just show a placeholder message
        showMessage('Game logic will be implemented in Task #92', 'info');
        // Simulate moving to next row
        gameState.currentRow++;
        gameState.currentGuess = '';
        if (gameState.currentRow >= 6) {
            gameState.gameOver = true;
            showMessage('Game over! The word was ' + gameState.answer, 'info');
        }
    }

    // Start a new game (placeholder)
    function newGame() {
        // Reset state
        gameState.currentRow = 0;
        gameState.currentGuess = '';
        gameState.guesses = Array(6).fill('');
        gameState.feedback = Array(6).fill(Array(5).fill(null));
        gameState.gameOver = false;
        // Reset UI
        initGrid();
        keyboardButtons.forEach(btn => {
            btn.classList.remove('correct', 'present', 'absent');
        });
        showMessage('New game started!');
    }

    // Load word lists (placeholder for Task #92)
    function loadWordLists() {
        // Temporary small word list for testing
        gameState.wordList = [
            'CRANE', 'TOAST', 'LEMON', 'CHAIR', 'PHONE',
            'CLOUD', 'BRAIN', 'FLAME', 'GRASS', 'STONE',
            'WATER', 'EARTH', 'MONEY', 'HAPPY', 'SMILE'
        ];
        gameState.answerList = gameState.wordList.slice(0, 5);
        // Set a random answer
        gameState.answer = gameState.answerList[Math.floor(Math.random() * gameState.answerList.length)];
    }

    // Initialize event listeners
    function initEvents() {
        // Physical keyboard
        document.addEventListener('keydown', handlePhysicalKeydown);

        // On-screen keyboard
        keyboardButtons.forEach(button => {
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
        loadWordLists();
        initEvents();
        showMessage('Welcome to Wordle! Start typing or click the keyboard.');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }

})();