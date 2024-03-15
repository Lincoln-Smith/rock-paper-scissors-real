document.addEventListener('DOMContentLoaded', function() {
    let username = localStorage.getItem('username');
    if (!username) {
        username = prompt('Enter your name:');
        if (username) {
            localStorage.setItem('username', username);
        }
    }
    if (username) {
        document.getElementById('usernameDisplay').textContent = `Welcome ${username}!`;
    }

    const selectionButtons = document.querySelectorAll('[data-selection]');
    const finalColumn = document.querySelector('[data-final-column]');
    const computerScoreSpan = document.querySelector('[data-computer-score]');
    const yourScoreSpan = document.querySelector('[data-your-score]');
    const gameOverMessages = document.querySelector('.gameOverMessages');
    const resetButton = document.createElement('button'); // Create a reset button element
    resetButton.textContent = 'Play Again'; // Set button text
    resetButton.addEventListener('click', resetGame); // Add event listener to reset the game

    const SELECTIONS = [
        {
            name: 'rock',
            emoji: '✊',
            beats: 'scissors'
        },
        {
            name: 'paper',
            emoji: '✋',
            beats: 'rock'
        },
        {
            name: 'scissors',
            emoji: '✌',
            beats: 'paper'
        }
    ];

    let playerScore = 0;
    let computerScore = 0;
    let roundsPlayed = 0;
    const MAX_ROUNDS = 5;

    selectionButtons.forEach(selectionButton => {
        selectionButton.addEventListener('click', e => {
            if (roundsPlayed < MAX_ROUNDS) {
                const selectionName = selectionButton.dataset.selection;
                const selection = SELECTIONS.find(selection => selection.name === selectionName);
                makeSelection(selection);
            } else {
                // Disable selection buttons when the game is over
                selectionButtons.forEach(button => (button.disabled = true));
                // Game is over, display a message
                displayGameOverMessage();
            }
        });
    });

    function makeSelection(selection) {
        const computerSelection = randomSelection();
        const yourWinner = isWinner(selection, computerSelection);
        const computerWinner = isWinner(computerSelection, selection);

        addSelectionResult(computerSelection, computerWinner);
        addSelectionResult(selection, yourWinner);

        if (yourWinner) {
            incrementScore(yourScoreSpan);
            playerScore++;
        }
        if (computerWinner) {
            incrementScore(computerScoreSpan);
            computerScore++;
        }

        roundsPlayed++;

        if (roundsPlayed === MAX_ROUNDS) {
            // Disable selection buttons when the game is over
            selectionButtons.forEach(button => (button.disabled = true));
            // Game is over, display a message
            displayGameOverMessage();
        }
    }

    function incrementScore(scoreSpan) {
        scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1;
    }

    function addSelectionResult(selection, winner) {
        const div = document.createElement('div');
        div.textContent = selection.emoji;
        div.classList.add('result-selection');
        if (winner) div.classList.add('winner');
        finalColumn.appendChild(div); // Append to finalColumn instead of finalColumn.after(div)
    }

    function isWinner(selection, opponentSelection) {
        return selection.beats === opponentSelection.name;
    }

    function randomSelection() {
        const randomIndex = Math.floor(Math.random() * SELECTIONS.length);
        return SELECTIONS[randomIndex];
    }

    function displayGameOverMessage() {
        const winMessages = [
            "Winner! :D",
            "Congratulations! You are the champion!",
            "Victory is yours! "
        ];

        const loseMessages = [
            "Poor performance :( try again",
            "Better luck next time!",
            "I killed a man in the desert in 2013"
        ];

        const tieMessages = [
            "You're a shining example of mediocrity, tie",
            "No winners",
            "best two out of three?"
        ];

        let gameOverMessage;

        if (playerScore > computerScore) {
            gameOverMessage = winMessages[Math.floor(Math.random() * winMessages.length)];
        } else if (playerScore < computerScore) {
            gameOverMessage = loseMessages[Math.floor(Math.random() * loseMessages.length)];
        } else {
            gameOverMessage = tieMessages[Math.floor(Math.random() * tieMessages.length)];
        }

        const finalScores = `Your score: ${playerScore}, Computer's score: ${computerScore}`;
        document.getElementById('gameOverMessage').innerText = gameOverMessage;
        document.getElementById('finalScores').textContent = finalScores;

        // Show game over messages
        gameOverMessages.classList.add('show');
        // Append reset button
        gameOverMessages.appendChild(resetButton);
    }

    function resetGame() {
        // Reload the page
        location.reload();
    }
});
