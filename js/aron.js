function continuousRiverAnimation() {
    const step4Element = document.getElementById('step4Aron'); // Updated ID
    let container, pokerTable, communityCardsElement, burnPile, playerHandElement, statusText, descriptionText;

    function initializeElements() {
        const pokercanvasElement = document.getElementById('pokercanvasAron'); // Updated ID
        pokercanvasElement.innerHTML = ''; // Clear previous content
    
        // Create poker table container
        pokerTable = document.createElement('div');
        pokerTable.className = 'aron-poker-table'; // Updated class
        pokercanvasElement.appendChild(pokerTable);
    
        // Create and add community cards
        communityCardsElement = document.createElement('div');
        communityCardsElement.className = 'aron-community-cards'; // Updated class
        pokerTable.appendChild(communityCardsElement);
    
        // Create and add burn pile
        burnPile = document.createElement('div');
        burnPile.className = 'aron-burn-pile'; // Updated class
        burnPile.textContent = 'Burn';
        pokerTable.appendChild(burnPile);
    
        // Create and add player's hand
        playerHandElement = document.createElement('div');
        playerHandElement.className = 'aron-player-hand'; // Updated class
        pokerTable.appendChild(playerHandElement);
    
        // Create status text
        statusText = document.createElement('p');
        statusText.id = 'aron-status-text'; // Updated ID
        pokercanvasElement.appendChild(statusText);
    }
} 

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Function to create a deck
function createDeck() {
    return suits.flatMap(suit => values.map(value => `${value}${suit}`));
}

// Function to shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to deal cards
function dealCards(deck, numCards) {
    return deck.splice(0, numCards);
}

// Function to create a card element
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'aron-card'; // Updated class
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'aron-card-value'; // Updated class
    valueSpan.textContent = card.slice(0, -1);
    
    const suitSpan = document.createElement('span');
    suitSpan.className = 'aron-card-suit'; // Updated class
    suitSpan.textContent = card.slice(-1);
    
    if (card.slice(-1) === '♥' || card.slice(-1) === '♦') {
        cardElement.classList.add('red');
    }
    
    cardElement.appendChild(valueSpan);
    cardElement.appendChild(suitSpan);
    
    return cardElement;
}

// Initialize the game
let deck4 = createDeck();
shuffleDeck(deck4);

// Function to animate the river card continuously
function continuousRiverAnimation() {
    const step4Element = document.getElementById('step4Aron'); // Updated ID
    let pokerTable, communityCardsElement, burnPile, playerHandElement, statusText;

    function initializeElements() {
        step4Element.innerHTML = ''; // Clear previous content

        // Create poker table container
        pokerTable = document.createElement('div');
        pokerTable.className = 'aron-poker-table'; // Updated class
        step4Element.appendChild(pokerTable);

        // Create and add community cards
        communityCardsElement = document.createElement('div');
        communityCardsElement.className = 'aron-community-cards'; // Updated class
        pokerTable.appendChild(communityCardsElement);

        // Create and add burn pile
        burnPile = document.createElement('div');
        burnPile.className = 'aron-burn-pile'; // Updated class
        burnPile.textContent = 'Burn';
        pokerTable.appendChild(burnPile);

        // Create and add player's hand
        playerHandElement = document.createElement('div');
        playerHandElement.className = 'aron-player-hand'; // Updated class
        pokerTable.appendChild(playerHandElement);

        // Create status text
        statusText = document.createElement('p');
        statusText.id = 'aron-status-text'; // Updated ID
        step4Element.appendChild(statusText);
    }

    function updateStatus(message) {
        statusText.textContent = message;
    }

    function dealInitialCards() {
        communityCardsElement.innerHTML = '';
        playerHandElement.innerHTML = '';

        const communityCards = dealCards(deck4, 4);
        communityCards.forEach(card => {
            communityCardsElement.appendChild(createCardElement(card));
        });

        const playerHand = dealCards(deck4, 2);
        playerHand.forEach(card => {
            playerHandElement.appendChild(createCardElement(card));
        });
    }

    function burnAndDealRiver() {
        updateStatus('Burning card in 3 seconds...');
        burnPile.style.backgroundColor = '#ddd';
        burnPile.textContent = 'Burn';

        setTimeout(() => {
            burnPile.style.backgroundColor = '#999';
            burnPile.textContent = 'Burned';
            updateStatus('Card burned. Dealing river card...');

            setTimeout(() => {
                const riverCard = dealCards(deck4, 1)[0];
                communityCardsElement.appendChild(createCardElement(riverCard));
                updateStatus('River card dealt. Examine your hand and decide on your play.');

                // Reset after 5 seconds
                setTimeout(() => {
                    if (deck4.length < 7) {
                        deck4 = createDeck();
                        shuffleDeck(deck4);
                    }
                    dealInitialCards();
                    burnAndDealRiver();
                }, 5000);
            }, 1000);
        }, 3000);
    }

    initializeElements();
    dealInitialCards();
    burnAndDealRiver();
}

// Start the continuous animation when the page loads
window.addEventListener('load', continuousRiverAnimation);
