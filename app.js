let selectedCoffee = '';
let selectedMilk = '';
let selectedSyrup = '';
let coffeeList = [];

// Load the saved coffee list from localStorage when the page is loaded
window.onload = function() {
    loadCoffeeList();
    updateCoffeeList();
};

function selectOption(option, category, button) {
    // Remove 'selected' class from all buttons in the same category
    document.querySelectorAll(`.${category}`).forEach(btn => btn.classList.remove('selected'));

    // Add 'selected' class to the clicked button
    button.classList.add('selected');

    // Update selected values based on category
    if (category === 'coffee') {
        selectedCoffee = option;
    } else if (category === 'milk') {
        selectedMilk = option;
    } else if (category === 'syrup') {
        selectedSyrup = option;
    }
}

function addCoffee() {
    const coffeeDetails = {
        coffee: selectedCoffee || 'No Coffee Selected',
        milk: selectedMilk || 'Regular Milk',
        syrup: selectedSyrup || ''
    };

    coffeeList.push(coffeeDetails);
    updateCoffeeList();
    saveCoffeeList();
    resetSelections();
}

function resetSelections() {
    selectedCoffee = '';
    selectedMilk = '';
    selectedSyrup = '';

    // Remove the 'selected' class from all buttons
    document.querySelectorAll('.button').forEach(btn => btn.classList.remove('selected'));
}

function updateCoffeeList() {
    const coffeeListElement = document.getElementById('coffeeList');
    coffeeListElement.innerHTML = '';

    const recentCoffees = coffeeList.slice(-10); // show only last 10
    recentCoffees.forEach(coffee => {
        let listItemText = `${coffee.coffee}`;

        // Check if milk is present and not "Regular Milk"
        if (coffee.milk && coffee.milk !== 'Regular Milk') {
            listItemText += ` with ${coffee.milk}`;
        }

        // Check if syrup is present and not "No Syrup"
        if (coffee.syrup && coffee.syrup !== 'No Syrup') {
            listItemText += ` and ${coffee.syrup}`;
        }

        const listItem = document.createElement('li');
        listItem.textContent = listItemText;
        coffeeListElement.appendChild(listItem);
    });
}



// Save the coffee list to localStorage
function saveCoffeeList() {
    localStorage.setItem('coffeeList', JSON.stringify(coffeeList));
}

// Load the coffee list from localStorage
function loadCoffeeList() {
    const savedCoffeeList = localStorage.getItem('coffeeList');
    if (savedCoffeeList) {
        coffeeList = JSON.parse(savedCoffeeList);
    }
}

// Export data as CSV
function exportData() {
    let coffeeCount = {};
    let milkCount = {};
    let syrupCount = {};

    coffeeList.forEach(function(row) {
        coffeeCount[row.coffee] = (coffeeCount[row.coffee] || 0) + 1;
        milkCount[row.milk] = (milkCount[row.milk] || 0) + 1;
        syrupCount[row.syrup] = (syrupCount[row.syrup] || 0) + 1;
    });

    let csvContent = "data:text/csv;charset=utf-8,Coffee,Count\n";
    for (const coffee in coffeeCount) {
        csvContent += `${coffee},${coffeeCount[coffee]}\n`;
    }

    csvContent += "\nMilk,Count\n";
    for (const milk in milkCount) {
        csvContent += `${milk},${milkCount[milk]}\n`;
    }

    csvContent += "\nSyrup,Count\n";
    for (const syrup in syrupCount) {
        csvContent += `${syrup},${syrupCount[syrup]}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "coffee_log.csv");
    document.body.appendChild(link);
    link.click();
}

// Confirm and reset the day
function confirmResetDay() {
    const confirmation = confirm("Are you sure you want to reset the day? This will clear all records.");
    if (confirmation) {
        resetDay();
    }
}

// Reset the day's data
function resetDay() {
    coffeeList = [];
    updateCoffeeList();
    saveCoffeeList(); // Save the reset state
}
