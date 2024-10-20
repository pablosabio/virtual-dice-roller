const chalk = require('chalk');

const prompt = require('prompt-sync')({ sigint: true });

console.clear();

const name = prompt(chalk.blue('What is your name? '));
console.log(chalk.blue(`Let's play, ${name}!`));

// Function to roll a dice with a given number of sides
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

let keepRolling = true;
const rollHistory = []; // Roll array history

while (keepRolling) {
    // Ask how many types of dice the user wants to roll
    let numTypesOfDice = parseInt(prompt(chalk.blue('How many types of dice do you want to roll? ')), 10);
    if (isNaN(numTypesOfDice) || numTypesOfDice <= 0) {
        console.log(chalk.red('Please enter a valid number of dice types.'));
        continue;  // Ask again for the number of dice types if the input is invalid
    }

    const diceCombinations = []; // Store the types of dice
    for (let i = 0; i < numTypesOfDice; i++) {
        let sides = parseInt(prompt(chalk.yellow(`Enter the number of sides for die type ${i + 1}: `)), 10);
        let numberOfDice = parseInt(prompt(chalk.yellow(`How many ${sides}-sided dice do you want to roll? `)), 10);
        if (isNaN(sides) || sides <= 0 || isNaN(numberOfDice) || numberOfDice <= 0) {
            console.log(chalk.red('Please enter valid numbers for sides and number of dice.'));
            continue;  // Ask again if the input is invalid
        }
        // Ask for the modifier for this roll
        let modifier = parseInt(prompt(chalk.magenta(`Enter a modifier for this roll (it can be positive or negative): `)), 10);
        diceCombinations.push({ sides, numberOfDice, modifier });
    }

    // Roll all the dice
    let grandTotal = 0;  // This will hold the total after all rolls and modifiers
    diceCombinations.forEach((dice, idx) => {
        let diceTotal = 0;  // Holds the total for this specific dice combination
        const results = [];
        console.log(chalk.blue(`Rolling combination ${idx + 1}:`));  // Highlight the start of a new combination
        for (let i = 0; i < dice.numberOfDice; i++) {
            let result = rollDice(dice.sides);
            console.log(chalk.yellow(`Die ${i + 1} with ${dice.sides} sides rolled: ${result}`));
            diceTotal += result;
            results.push(result);
        }
        // Apply the modifier to the total of this roll
        let modifiedTotal = diceTotal + dice.modifier;
        console.log(chalk.magenta(`Modifier applied: ${dice.modifier}. Modified total for this roll: ${modifiedTotal}`));

        
        grandTotal += modifiedTotal;

        // Save the results for each combination of dice in the history
        rollHistory.push({
            numberOfDice: dice.numberOfDice,
            sides: dice.sides,
            results,
            total: modifiedTotal
        });
    });

    console.log(chalk.green(`Grand total of all rolls: ${grandTotal}`));

    // Ask if the user wants to roll again
    let response;
    do {
        response = prompt(chalk.cyan('Do you want to roll again? (yes/no) ')).toLowerCase();

        if (response === 'yes') {
            keepRolling = true;
            console.clear();
            console.log(chalk.green('Great! Let\'s roll again!'));
        } else if (response === 'no') {
            keepRolling = false;
            console.log(chalk.green('Thank you for playing! Here\'s your roll history:'));
            rollHistory.forEach((entry, index) => {
                console.log(chalk.blue(`Roll ${index + 1}: ${entry.numberOfDice} ${entry.sides}-sided dice -> Results: ${entry.results.join(', ')} | Total: ${entry.total}`));
            });
        } else {
            console.clear();
            console.log(chalk.red('Invalid response. Please type "yes" or "no".'));
        }

    } while (response !== 'yes' && response !== 'no');
}

console.log(chalk.green('Grand total of all rolls: '), chalk.yellow(rollHistory.reduce((acc, entry) => acc + entry.total, 0)));

console.log(chalk.bgRed('Game over.'));
