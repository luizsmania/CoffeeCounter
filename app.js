let selectedCoffee = '';
let selectedMilk = '';
let selectedSyrup = '';
let coffeeList = [];

// Load the saved coffee list from localStorage when the page is loaded
window.onload = function() {
    loadCoffeeList();
    updateCoffeeList();
};

function selectOption(option, category, buttonElement) {
    // Toggle the 'selected' class on the clicked button
    if (buttonElement.classList.contains('selected')) {
        buttonElement.classList.remove('selected');
        
        // Unselect the option by setting the category variable to an empty string
        if (category === 'coffee') {
            selectedCoffee = '';
        } else if (category === 'milk') {
            selectedMilk = '';
        } else if (category === 'syrup') {
            selectedSyrup = '';
        }
    } else {
        // Deselect any previously selected buttons in the same category
        document.querySelectorAll(`.button.${category}`).forEach(btn => btn.classList.remove('selected'));
        
        // Select the clicked button and update the selected option
        buttonElement.classList.add('selected');
        if (category === 'coffee') {
            selectedCoffee = option;
        } else if (category === 'milk') {
            selectedMilk = option;
        } else if (category === 'syrup') {
            selectedSyrup = option;
        }
    }
}

function addCoffee() {
    const coffeeDetails = {
        coffee: selectedCoffee || 'No Coffee Selected',
        milk: selectedMilk || 'Regular Milk',
        syrup: selectedSyrup || 'No Syrup',
        time: new Date().toLocaleTimeString() // Get the current time in HH:MM:SS format
    };

    coffeeList.push(coffeeDetails);
    updateCoffeeList();
    saveCoffeeList();
    resetSelections();
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function removeCoffee(index) {
    // Show a confirmation dialog before deleting
    const confirmDelete = confirm("Are you sure you want to delete this coffee?");
    
    if (confirmDelete) {
        // Remove the coffee from the array
        coffeeList.splice(index, 1);

        // Update the coffee list display
        updateCoffeeList();

        // Optionally save the updated coffee list if persistence is needed
        saveCoffeeList();
    }
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
    const coffeeCountElement = document.getElementById('coffeeCount');
    coffeeListElement.innerHTML = '';

    // Update the <h2> element with the count of total coffees made
    coffeeCountElement.textContent = `Recent Coffees - Total: ${coffeeList.length}`;

    // Slice the last 10 coffees and reverse them to show the most recent at the top
    const recentCoffees = coffeeList.slice(-10).reverse();

    recentCoffees.forEach((coffee, index) => {
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
        listItem.innerHTML = `
            ${listItemText}
            <span style="font-size: 0.7em; color: rgba(0, 0, 0, 0.6); display: block; margin-top: 1px;">
                at ${coffee.time}
            </span>
            <button onclick="removeCoffee(${coffeeList.length - 1 - index})" style="font-family: Serif; font-size: 0.65em; margin-left: 0px; padding: 4px 8px; background-color: rgba(255, 0, 0, 0.5); color: black; border: 0px solid; border-radius: 3px; cursor: pointer;">Delete</button>
        `;

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

function exportData() {
    let coffeeCount = {};
    let milkCount = {};
    let syrupCount = {};

    coffeeList.forEach(function(row) {
        if (row.coffee !== 'No Coffee Selected') {
            coffeeCount[row.coffee]=(coffeeCount[row.coffee] || 0) + 1;
        }
        if (row.milk !== 'Regular Milk') {
            milkCount[row.milk]=(milkCount[row.milk] || 0) + 1;
        }
        if (row.syrup !== 'No Syrup') {
            syrupCount[row.syrup]=(syrupCount[row.syrup] || 0) + 1;
        }
    });

    let csvContent = "data:text/csv;charset=utf-8,Coffee - Count\n";
    for (const coffee in coffeeCount) {
        csvContent += `${coffee}=${coffeeCount[coffee]}\n`;
    }

    csvContent += "\nMilk - Count\n";
    for (const milk in milkCount) {
        csvContent += `${milk}=${milkCount[milk]}\n`;
    }

    csvContent += "\nSyrup - Count\n";
    for (const syrup in syrupCount) {
        csvContent += `${syrup}=${syrupCount[syrup]}\n`;
    }

    // Generate the current date in format DD/MM/YYYY
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    // Create the filename with the formatted date
    const filename = `${formattedDate} Coffee Log.csv`;

    // Encode CSV content and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename); // Use the generated filename
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
