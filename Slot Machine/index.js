// A SLOT MACHINE
// STEPS:
// 1. DEPOSIT MONEY
// 2. DETERMINE NUMBER OF LINES TO BET ON
// 3. COLLECT BET AMOUNTS
// 4. SPIN!
// 5. CHECK IF WIN/LOSE
// 6. GIVE THE RESULT
// 7. PLAY AGAIN?

// using this package to get user input
const prompt = require("prompt-sync")();

const ROWS = 3, COLS = 3;

const SYMBOL_COUNT = {
    A: 3,
    B: 5,
    C: 7,
    D: 9
}

const SYMBOL_VALUE = {
    A: 4,
    B: 3,
    C: 2,
    D: 1
}





const deposit = () => {
    while (true) {
        // Get user input amount of money
        const amount = prompt("How much money do you want to deposit?: "); // this return a string
        // convert above var to float
        const F_amount = parseFloat(amount);

        if (isNaN(F_amount) || F_amount <= 0) {
            console.log("Invalid input deposit money. Try again!");
        } else {
            return F_amount;
        }
    }
}

const getNumberOfLines = () => {
    while (true) {
        // Get user input amount of money
        const lines = prompt("Enter number of lines to bet: "); // this return a string
        // convert above var to float
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid input number of lines. Try again!");
        } else {
            return numberOfLines;
        }
    }
}

const getBetAmount = (balance, lines) => {
    while (true) {
        // Get user input amount of money
        const bet = prompt("Enter the bet per line: "); // this return a string
        // convert above var to float
        const betAmount = parseFloat(bet);

        if (isNaN(betAmount) || betAmount <= 0 || betAmount > (balance / lines)) {
            console.log("Invalid input bet amount. Try again!");
        } else {
            return betAmount;
        }
    }
}

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
        // console.log(symbol, count);
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [[], [], []];
    for (let i = 0; i < COLS; i++) {
        /*Essentially, const reelSymbol = [...symbols]; creates a new array reelSymbol with the same values 
        as the symbols array. This new array is a copy of the original array and is not a reference 
        to the same array object. -- ChatGPT.
        */
        const reelSymbol = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            // create random and push to reels.
            const randomIndex = Math.floor(Math.random() * reelSymbol.length);
            const selectedSymbol = reelSymbol[randomIndex];
            reels[i].push(selectedSymbol);
            // Remove the selected symbol from the reel symbol so that it can't be selected again.
            reelSymbol.splice(randomIndex, 1);
        }
    }
    return reels;


}

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUE[symbols[0]];
        }
    }

    return winnings;
};

const play = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBetAmount(balance, numberOfLines);
        balance -= bet * numberOfLines;
        if (balance <= 0) {
            console.log("You ran out of money! GAME OVER.");
            break;
        }
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won $" + winnings.toString());
        console.log("You have: $" + balance.toString());

        const playAgain = prompt("Do you want to play again (y/n)? ");

        if (playAgain !== "y") {
            console.log("Thanks for playing!");
            break;
        }
    };
};


play();
