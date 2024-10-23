const canvas = document.getElementById('pokerCanvasTurn');
const ctx = canvas.getContext('2d');
const CARD_WIDTH = 50;
const CARD_HEIGHT = 70;
const TABLE_CENTER_X = 400;
const TABLE_CENTER_Y = 300;
const PLAYER_POSITIONS = [
    { x: TABLE_CENTER_X - 250, y: TABLE_CENTER_Y + 100 }, // Player 1
    { x: TABLE_CENTER_X - 100, y: TABLE_CENTER_Y + 100 }, // Player 2
    { x: TABLE_CENTER_X + 100, y: TABLE_CENTER_Y + 100 }, // Player 3
    { x: TABLE_CENTER_X + 250, y: TABLE_CENTER_Y + 100 }  // Player 4
];
const ANIMATION_DURATION = 500; 
let deck = [];
let dealingInProgress = false;
const players = [[], [], [], []];
const communityCards = []; // Holds community cards

function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard(x, y, card) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.fillStyle = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
    ctx.font = '20px Arial';
    ctx.fillText(card.value, x + 10, y + 25);
    ctx.fillText(card.suit, x + 10, y + 50);
}

function drawPlayerIndicators() {
    PLAYER_POSITIONS.forEach((pos, index) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 50, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Player ${index + 1}`, pos.x, pos.y + 5);
    });
}

function drawDealerIndicator() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(TABLE_CENTER_X, TABLE_CENTER_Y - 100, 30, 0, Math.PI * 2); // Dealer position
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText("Dealer", TABLE_CENTER_X, TABLE_CENTER_Y - 95); // Dealer label
}

function drawStaticTable() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.ellipse(TABLE_CENTER_X, TABLE_CENTER_Y, 350, 250, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 10;
    ctx.stroke();
    drawPlayerIndicators(); // Draw player positions
    drawDealerIndicator(); // Draw dealer
    drawCommunityCards();
    drawPlayerCards();
}

function drawPlayerCards() {
    players.forEach((playerCards, pIndex) => {
        const { x, y } = PLAYER_POSITIONS[pIndex];
        playerCards.forEach((card, cIndex) => {
            drawCard(x + (cIndex * 60) - (CARD_WIDTH / 2), y + 40, card); // Center cards below player
        });
    });
}

function drawCommunityCards() {
    const startX = TABLE_CENTER_X - 75; // Adjust for three cards
    const startY = TABLE_CENTER_Y - 40;
    communityCards.forEach((card, index) => {
        drawCard(startX + index * 60, startY, card);
    });

    // Draw the turn card, offset slightly to cover only one card
    if (communityCards.length > 3) {
        const turnCard = communityCards[3];
        drawCard(startX + 60, startY, turnCard); // Offset for the turn card
    }
}

function animateCard(startX, startY, endX, endY) {
    return new Promise(resolve => {
        const startTime = performance.now();
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            drawStaticTable();
            drawCard(currentX, currentY, { value: '', suit: '' }); // Draw temporary card
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }
        requestAnimationFrame(animate);
    });
}

async function animateTurnStep() {
    // Burn the top card
    const burnedCard = deck.pop(); // Remove the top card without using it
    console.log('Burned card:', burnedCard); // Log the burned card

    // Animate the burn pile
    await animateCard(TABLE_CENTER_X, TABLE_CENTER_Y - 70, TABLE_CENTER_X + 150, TABLE_CENTER_Y - 100); // Position for burn pile

    // Deal the turn card
    const turnCard = deck.pop();
    communityCards.push(turnCard);
    await animateCard(TABLE_CENTER_X, TABLE_CENTER_Y - 70, TABLE_CENTER_X + 15, TABLE_CENTER_Y - 40); // Position for turn card

    // Show possible player actions after turn card is revealed
    showPlayerActions();
}

// Function to show player actions
function showPlayerActions() {
    const actions = ["Bet", "Call", "Fold"];
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action-container');

    // Clear any existing action buttons
    const existingContainer = document.querySelector('.action-container');
    if (existingContainer) {
        existingContainer.remove(); // Remove previous actions
    }

    actions.forEach(action => {
        const actionButton = document.createElement('button');
        actionButton.textContent = action;
        actionButton.classList.add('action-button');
        actionButton.onclick = () => handleAction(action); // Handle action based on user click
        actionContainer.appendChild(actionButton);
    });

    document.body.appendChild(actionContainer); // Append action buttons to the body
}

// Handle player action
function handleAction(action) {
    console.log('Player chose to:', action);
    // Reset the game or handle specific logic based on the action chosen
    resetGame();
}

async function resetGame() {
    // Clear player hands and community cards
    players.forEach(player => player.length = 0);
    communityCards.length = 0;
    drawStaticTable();
    
    // Delay to show the reset, then start the next round
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove action buttons after use
    const existingContainer = document.querySelector('.action-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    await dealCards(); // Start the next round
}

async function dealCards() {
    if (dealingInProgress) return;
    dealingInProgress = true;
    createDeck();

    // Deal 2 cards to each player
    for (let round = 0; round < 2; round++) {
        for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
            const card = deck.pop();
            players[playerIndex].push(card);
            const startX = TABLE_CENTER_X;
            const startY = TABLE_CENTER_Y - 70; // Dealer position
            const endX = PLAYER_POSITIONS[playerIndex].x + (round * 60); // Adjust for each player's card
            const endY = PLAYER_POSITIONS[playerIndex].y; // Players' card position
            await animateCard(startX, startY, endX, endY); // Animate dealing
        }
    }

    // Deal the flop
    for (let i = 0; i < 3; i++) {
        const card = deck.pop();
        communityCards.push(card);
        await animateCard(TABLE_CENTER_X, TABLE_CENTER_Y - 70, TABLE_CENTER_X - 75 + i * 60, TABLE_CENTER_Y - 40); // Position for flop cards
    }

    // Proceed to the turn step animation
    await animateTurnStep();
}

// Start the game by dealing cards
dealCards();

