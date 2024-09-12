let selectedCoffee = '';
let selectedMilk = '';
let selectedSyrup = '';
let coffeeList = [];

function selectOption(option) {
    if (option.includes('Latte') || option.includes('Cappuccino') || 
        option.includes('Flat White') || option.includes('Americano') || 
        option.includes('Double Espresso') || option.includes('Single Espresso') || 
        option.includes('Matcha Latte') || option.includes('Chai Latte') || 
        option.includes('Hot Chocolate') || option.includes('Mocha') || 
        option.includes('Tea') || option.includes('Iced Latte') || 
        option.includes('Iced Americano') || option.includes('Vietnamese') || 
        option.includes('Afogatto')) {
        selectedCoffee = option;
    } else if (option.includes('Milk')) {
        selectedMilk = option;
    } else {
        selectedSyrup = option;
    }
}


function addCoffee() {
    const coffeeDetails = {
        coffee: selectedCoffee || 'No Coffee Selected',  // Defaults to "No Coffee Selected"
        milk: selectedMilk || 'Regular Milk',            // Defaults to "Regular Milk"
        syrup: selectedSyrup || 'No Syrup'               // Defaults to "No Syrup"
    };

    coffeeList.push(coffeeDetails);
    updateCoffeeList();
    resetSelections();
}

function updateCoffeeList() {
    const coffeeListElement = document.getElementById('coffeeList');
    coffeeListElement.innerHTML = '';

    const recentCoffees = coffeeList.slice(-10); // show only last 10
    recentCoffees.forEach(coffee => {
        const listItem = document.createElement('li');
        listItem.textContent = `${coffee.coffee} with ${coffee.milk} and ${coffee.syrup}`;
        coffeeListElement.appendChild(listItem);
    });
}

function resetSelections() {
    selectedCoffee = '';
    selectedMilk = '';
    selectedSyrup = '';
}

// Function to export data as CSV
function exportData() {
    let coffeeCount = {};
    let milkCount = {};
    let syrupCount = {};

    // Count occurrences of each coffee, milk, and syrup
    coffeeList.forEach(function(row) {
        // Count coffee types
        if (coffeeCount[row.coffee]) {
            coffeeCount[row.coffee]++;
        } else {
            coffeeCount[row.coffee] = 1;
        }

        // Count milk types
        if (milkCount[row.milk]) {
            milkCount[row.milk]++;
        } else {
            milkCount[row.milk] = 1;
        }

        // Count syrup types
        if (syrupCount[row.syrup]) {
            syrupCount[row.syrup]++;
        } else {
            syrupCount[row.syrup] = 1;
        }
    });

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,Coffee,Count\n";

    // Add coffee counts to CSV
    for (const coffee in coffeeCount) {
        csvContent += `${coffee},${coffeeCount[coffee]}\n`;
    }

    // Add a separator and milk counts to CSV
    csvContent += "\nMilk,Count\n";
    for (const milk in milkCount) {
        csvContent += `${milk},${milkCount[milk]}\n`;
    }

    // Add a separator and syrup counts to CSV
    csvContent += "\nSyrup,Count\n";
    for (const syrup in syrupCount) {
        csvContent += `${syrup},${syrupCount[syrup]}\n`;
    }

    // Encode CSV content and create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "coffee_log.csv");
    document.body.appendChild(link);
    link.click();
}


// Function to confirm and reset the day
function confirmResetDay() {
    const confirmation = confirm("Are you sure you want to reset the day? This will clear all records.");
    if (confirmation) {
        resetDay();
    }
}

// Function to reset the day's data
function resetDay() {
    coffeeList = [];
    updateCoffeeList();
}
