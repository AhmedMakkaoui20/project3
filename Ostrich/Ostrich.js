// Initialize variables for the puzzle
var numRows = 4;
var numColumns = 4;
var emptyCell; 
var movesCounter = 0;
var imageIndices = [];
var timerInterval;
var elapsedSeconds = 0;
var audioPlayer = new Audio("music.mp3"); 

// Event listener for the shuffle button
document.getElementById("shuffleButton").addEventListener("click", function () {
    resetPuzzle(); 
    startGameTimer();
    shuffleTilesAroundEmptyCell();
    audioPlayer.play();
});

// Event listener for the check button
document.getElementById("checkButton").addEventListener("click", function () {
    checkForCompletion();
});

// Event listener for when the window is loaded
window.onload = function () {
    initializeBoard();
};

// Function to start the game timer
function startGameTimer() {
    timerInterval = setInterval(function () {
        elapsedSeconds += 1;
        document.getElementById("timer").innerText = "Time: " + elapsedSeconds + " seconds";
    }, 1000);
}

// Function to stop the game timer
function stopGameTimer() {
    clearInterval(timerInterval);
}

// Function to reset the game timer
function resetGameTimer() {
    stopGameTimer();
    elapsedSeconds = 0;
    document.getElementById("timer").innerText = "Time: 0 seconds";
}

// Function to initialize the game board
function initializeBoard() {
    // Generate sequential order for image indices and numbers
    imageIndices = generateSequentialOrder(); 
    numbers = generateSequentialOrder(); 

    // Loop through rows and columns to create tiles on the board
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numColumns; c++) {
            // Create tile container and tile element
            let tileContainer = document.createElement("div");
            tileContainer.style.position = "relative";

            let tile = document.createElement("img");
            // Set properties for the tile
            tile.id = r.toString() + "-" + c.toString();
            tile.src = imageIndices.shift() + ".png";

            tile.style.border = "2px solid black";
            tile.style.margin = "0";
            tile.style.padding = "0";
            tile.style.boxSizing = "border-box";

            tile.addEventListener("click", tileClick);

            let numberElement = document.createElement("div");
            if (!tile.src.includes("16.png")) {
                numberElement.innerText = numbers.shift();
            }
            numberElement.style.position = "absolute";
            numberElement.style.top = "50%";
            numberElement.style.left = "50%";
            numberElement.style.transform = "translate(-50%, -50%)";
            numberElement.style.fontSize = "32px";
            numberElement.style.color = "white";

            // Add mouseover and mouseout event listeners
            tileContainer.addEventListener("mouseover", function () {
                if (isAdjacentToEmpty(tile)) {
                    tile.style.border = "2px solid red";
                    numberElement.style.textDecoration = "underline";
                    numberElement.style.color = "#006600";
                }
            });

            tileContainer.addEventListener("mouseout", function () {
                tile.style.border = "2px solid black";
                numberElement.style.textDecoration = "none";
                numberElement.style.color = "white";
            });

            if (r > 0) {
                tileContainer.style.marginTop = "-4px";
            }

            tileContainer.appendChild(tile);
            tileContainer.appendChild(numberElement);
            document.getElementById("board").append(tileContainer);

            // Set the empty cell to the tile with "16.png"
            if (tile.src.includes("16.png")) {
                emptyCell = tile;
            }
        }
    }
}

// Function to check if a tile is adjacent to the empty cell
function isAdjacentToEmpty(tile) {
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    let emptyCoords = emptyCell.id.split("-");
    let rEmpty = parseInt(emptyCoords[0]);
    let cEmpty = parseInt(emptyCoords[1]);

    return (r === rEmpty && (c === cEmpty - 1 || c === cEmpty + 1)) ||
           (c === cEmpty && (r === rEmpty - 1 || r === rEmpty + 1));
}

// Function to reset the puzzle
function resetPuzzle() {
    resetGameTimer();
    movesCounter = 0;
    document.getElementById("turns").innerText = "Moves: " + movesCounter;
    recreatePuzzle();
}

// Function to recreate the puzzle
function recreatePuzzle() {
    document.getElementById("board").innerHTML = "";
    initializeBoard();
}

// Function to check if the puzzle is completed
function checkForCompletion() {
    let correctOrder = true;
    // Check if each tile is in the correct order
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numColumns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let expectedImage = `${r * numColumns + c + 1}.png`;

            if (tile.src.includes(expectedImage)) {
                // Tile is in the correct order
            } else {
                correctOrder = false;
                break;
            }
        }
        if (!correctOrder) {
            break;
        }
    }
    // Display appropriate message based on completion status
    if (correctOrder) {
        alert("Congratulations!");
        stopGameTimer();
        // Display congratulatory image
        let congratsImage = document.createElement("img");
        congratsImage.src = "image.png";
        congratsImage.style.width = '200px';
        congratsImage.style.height = '80px';
        congratsImage.style.position = 'absolute';
        congratsImage.style.bottom = '710px';
        congratsImage.style.left = '50%';
        congratsImage.style.transform = 'translateX(-50%)';
        congratsImage.style.border = 'none';
        document.body.appendChild(congratsImage);

        saveGameResults(movesCounter, elapsedSeconds);
    } else {
        alert("Try again");
    }
}

// Function to save game results in a table
function saveGameResults(moves, time) {
    let tableBody = document.querySelector("#resultsTable tbody");
    let newRow = tableBody.insertRow();
    let movesCell = newRow.insertCell(0);
    let timeCell = newRow.insertCell(1);
    movesCell.textContent = moves;
    timeCell.textContent = time + " seconds";
}

// Function to generate a sequential order for numbers
function generateSequentialOrder() {
    var order = [];
    for (let i = 1; i <= numRows * numColumns; i++) {
        order.push(i.toString());
    }
    return order;
}

// Function to generate a random order for numbers
function generateRandomOrder() {
    var order = [];
    for (let i = 1; i <= numRows * numColumns; i++) {
        order.push(i.toString());
    }
    // Shuffle the order randomly
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

// Function to shuffle tiles randomly
function shuffleTiles() {
    resetGameTimer();
    movesCounter = 0;
    document.getElementById("turns").innerText = "Moves: " + movesCounter;
    imageIndices = generateRandomOrder();
    initializeBoard();
}

// Function to shuffle tiles around the empty cell
function shuffleTilesAroundEmptyCell() {
    const directions = [
        { row: -1, col: 0 }, 
        { row: 1, col: 0 },  
        { row: 0, col: -1 }, 
        { row: 0, col: 1 },  
    ];
    // Randomize the directions
    directions.sort(() => Math.random() - 0.5);
    // Get coordinates of the empty cell
    let emptyCoords = emptyCell.id.split("-");
    let rEmpty = parseInt(emptyCoords[0]);
    let cEmpty = parseInt(emptyCoords[1]);
    // Move the empty cell to the bottom-right corner if not already there
    if (rEmpty !== numRows - 1 || cEmpty !== numColumns - 1) {
        let targetTile = document.getElementById(`${numRows - 1}-${numColumns - 1}`);
        swapPuzzleTiles(emptyCell, targetTile);
        emptyCell = targetTile;
    }
    // Move tiles around the empty cell in random directions
    for (let dir of directions) {
        let newRow = rEmpty + dir.row;
        let newCol = cEmpty + dir.col;
        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numColumns) {
            let targetTile = document.getElementById(`${newRow}-${newCol}`);
            swapPuzzleTiles(emptyCell, targetTile);
            emptyCell = targetTile; 
            rEmpty = newRow;
            cEmpty = newCol;
        }
    }
}

// Function to handle tile click
function tileClick() {
    let currentTile = this;
    let currentCoords = currentTile.id.split("-");
    let r = parseInt(currentCoords[0]);
    let c = parseInt(currentCoords[1]);
    let emptyCoords = emptyCell.id.split("-");
    let rEmpty = parseInt(emptyCoords[0]);
    let cEmpty = parseInt(emptyCoords[1]);
    // Check if the clicked tile is adjacent to the empty cell
    let moveLeft = r === rEmpty && cEmpty === c - 1;
    let moveRight = r === rEmpty && cEmpty === c + 1;
    let moveUp = c === cEmpty && rEmpty === r - 1;
    let moveDown = c === cEmpty && rEmpty === r + 1;
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
    // If adjacent, swap the tiles and update moves counter
    if (isAdjacent) {
        swapPuzzleTiles(currentTile, emptyCell);
        movesCounter += 1;
        document.getElementById("turns").innerText = "Moves: " + movesCounter;
        emptyCell = currentTile;
    }
}

// Function to swap two puzzle tiles
function swapPuzzleTiles(tile1, tile2) {
    let tempSrc = tile1.src;
    tile1.src = tile2.src;
    tile2.src = tempSrc;
    let tempNumber = tile1.nextSibling.innerText;
    tile1.nextSibling.innerText = tile2.nextSibling.innerText;
    tile2.nextSibling.innerText = tempNumber;
}

// Event listener for dynamically inserted tiles
document.getElementById("board").addEventListener("DOMNodeInserted", function (event) {
    let newTile = event.target;
    if (newTile.tagName === "IMG") {
        let coords = newTile.id.split("-");
        newTile.row = parseInt(coords[0]);
        newTile.col = parseInt(coords[1]);
    }
});
