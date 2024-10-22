const step5 = document.getElementById("step 5");
const canvas5 = document.getElementById('pokerCanvas5Meso');
const ctx5 = canvas5.getContext('2d');

const CARD_WIDTH5 = 50;
const CARD_HEIGHT5 = 70;
const TABLE_CENTER5_X = 400;
const TABLE_CENTER5_Y = 350;
const TABLE_RADIUS5_X = 350;
const TABLE_RADIUS5_Y = 350;

function drawCard(x, y, card, faceUp = true, revealProgress = 1) {
    ctx5.save();
    ctx5.translate(x + CARD_WIDTH5 / 2, y + CARD_HEIGHT5 / 2);
    ctx5.rotate((1 - revealProgress) * Math.PI);
    ctx5.translate(-CARD_WIDTH5 / 2, -CARD_HEIGHT5 / 2);

    ctx5.fillStyle = 'white';
    ctx5.strokeStyle = 'black';
    ctx5.lineWidth = 2;
    ctx5.fillRect(0, 0, CARD_WIDTH5, CARD_HEIGHT5);
    ctx5.strokeRect(0, 0, CARD_WIDTH5, CARD_HEIGHT5);

    if (faceUp && revealProgress > 0.5) {
        ctx5.fillStyle = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
        ctx5.font = '20px Arial';
        ctx5.fillText(card.value, 5, 20);
        ctx5.fillText(card.suit, 5, 45);
    } else {
        ctx5.fillStyle = 'blue';
        ctx5.fillRect(5, 5, CARD_WIDTH5 - 10, CARD_HEIGHT5 - 10);
    }

    ctx5.restore();
}

function drawTable() {
    ctx5.fillStyle = 'green';
    ctx5.beginPath();
    ctx5.ellipse(TABLE_CENTER5_X, TABLE_CENTER5_Y, TABLE_RADIUS5_X, TABLE_RADIUS5_Y, 0, 0, Math.PI * 2);
    ctx5.fill();
    ctx5.strokeStyle = 'brown';
    ctx5.lineWidth = 10;
    ctx5.stroke();
}

function drawCommunityCards(cards) {
    cards.forEach((card, index) => {
        drawCard(TABLE_CENTER5_X - 150 + index * 60, TABLE_CENTER5_Y - 35, card);
    });
}

function drawPlayer(playerIndex, cards, angle, revealProgress) {
    const x = TABLE_CENTER5_X + Math.cos(angle) * TABLE_RADIUS5_X * 0.7;
    const y = TABLE_CENTER5_Y + Math.sin(angle) * TABLE_RADIUS5_Y * 0.7;

    drawCard(x - 30, y, cards[0], true, revealProgress);
    drawCard(x + 30, y, cards[1], true, revealProgress);

    ctx5.fillStyle = 'white';
    ctx5.font = '20px Arial';
    ctx5.textAlign = 'center';
    ctx5.fillText(`Player ${playerIndex + 1}`, x, y + 100);
}

function drawDealer() {
    const dealerX = TABLE_CENTER5_X;
    const dealerY = TABLE_CENTER5_Y - TABLE_RADIUS5_Y * 0.9;

    ctx5.fillStyle = 'white';
    ctx5.beginPath();
    ctx5.arc(dealerX, dealerY, 30, 0, Math.PI * 2);
    ctx5.fill();

    ctx5.fillStyle = 'black';
    ctx5.font = '20px Arial';
    ctx5.textAlign = 'center';
    ctx5.fillText('D', dealerX, dealerY + 7);
}

function animateShowdown() {
    const communityCards = [
        {value: 'A', suit: '♠'},
        {value: 'K', suit: '♥'},
        {value: 'Q', suit: '♦'},
        {value: 'J', suit: '♣'},
        {value: '10', suit: '♠'}
    ];

    const playerCards = [
        [{value: 'A', suit: '♥'}, {value: 'K', suit: '♠'}],
        [{value: 'Q', suit: '♣'}, {value: 'J', suit: '♦'}],
        [{value: '10', suit: '♥'}, {value: '9', suit: '♥'}],
        [{value: '2', suit: '♦'}, {value: '7', suit: '♣'}]
    ];

    let frame = 0;
    const totalFrames = 300; // 5 seconds at 60 fps
    const revealFrames = 60; // 1 second for each player's reveal

    function animate() {
        ctx5.clearRect(0, 0, canvas5.width, canvas5.height);
        drawTable();
        drawCommunityCards(communityCards);
        drawDealer();

        const playerAngles = [-Math.PI/3, Math.PI/6, Math.PI/2, 5*Math.PI/6];
        for (let i = 0; i < 4; i++) {
            const playerRevealStart = i * revealFrames;
            const playerRevealEnd = (i + 1) * revealFrames;
            let revealProgress = 0;

            if (frame >= playerRevealStart && frame < playerRevealEnd) {
                revealProgress = (frame - playerRevealStart) / revealFrames;
            } else if (frame >= playerRevealEnd) {
                revealProgress = 1;
            }

            drawPlayer(i, playerCards[i], playerAngles[i], revealProgress);
        }

        frame++;
        if (frame < totalFrames) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// Start the animation
animateShowdown();



