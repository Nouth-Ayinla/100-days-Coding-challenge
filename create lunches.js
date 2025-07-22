// Create lunches variable and assign it an empty array
let lunches = [];

// Function to add lunch item to the end of the array
function addLunchToEnd(arr, lunchItem) {
    arr.push(lunchItem);
    console.log(`${lunchItem} added to the end of the lunch menu.`);
    return arr;
}

// Function to add lunch item to the start of the array
function addLunchToStart(arr, lunchItem) {
    arr.unshift(lunchItem);
    console.log(`${lunchItem} added to the start of the lunch menu.`);
    return arr;
}

// Function to remove last lunch item from the array
function removeLastLunch(arr) {
    if (arr.length === 0) {
        console.log("No lunches to remove.");
    } else {
        const removedItem = arr.pop();
        console.log(`${removedItem} removed from the end of the lunch menu.`);
    }
    return arr;
}

// Function to remove first lunch item from the array
function removeFirstLunch(arr) {
    if (arr.length === 0) {
        console.log("No lunches to remove.");
    } else {
        const removedItem = arr.shift();
        console.log(`${removedItem} removed from the start of the lunch menu.`);
    }
    return arr;
}

// Function to get a random lunch item from the array
function getRandomLunch(arr) {
    if (arr.length === 0) {
        console.log("No lunches available.");
    } else {
        const randomIndex = Math.floor(Math.random() * arr.length);
        const randomLunch = arr[randomIndex];
        console.log(`Randomly selected lunch: ${randomLunch}`);
    }
}

// Function to show the lunch menu
function showLunchMenu(arr) {
    if (arr.length === 0) {
        console.log("The menu is empty.");
    } else {
        console.log(`Menu items: ${arr.join(', ')}`);
    }
}