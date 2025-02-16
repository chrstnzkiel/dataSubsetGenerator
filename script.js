// Initialize global variables
let previousSubset = null; // Store the last generated subset to ensure uniqueness
let csvData = null; // Store parsed CSV data
let headers = null; // Store CSV headers

/**
 * Generates a random integer within the given range.
 * @param {number} lower - The lower bound.
 * @param {number} higher - The upper bound.
 * @returns {number} A random integer between lower and higher (inclusive).
 */
function rand(lower, higher) {
    return Math.floor(Math.random() * (higher - lower + 1)) + lower;
}

/**
 * Compares two arrays to check if they are identical.
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The second array.
 * @returns {boolean} True if arrays are equal, false otherwise.
 */
function arraysEqual(arr1, arr2) {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
}

// Event listener for file upload
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const result = parseCSV(event.target.result);
            csvData = result.data;
            headers = result.headers;
        };
        reader.readAsText(file);
    }
});

/**
 * Parses CSV content into an array of objects.
 * @param {string} csvText - The raw CSV data.
 * @returns {Object} An object containing headers and parsed data.
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
    }
    return { headers, data };
}

/**
 * Generates a random subset from the uploaded CSV data.
 */
function generateRandomSubset() {
    if (!csvData) {
        alert("Please upload a CSV file first!");
        return;
    }
    
    const subsetSize = parseInt(document.getElementById('subsetSize').value);
    
    if (isNaN(subsetSize) || subsetSize < 1 || subsetSize > csvData.length) {
        alert(`Please enter a valid subset size between 1 and ${csvData.length}`);
        return;
    }
    
    let subset;
    do {
        subset = [];
        const indices = new Set();
        
        // Generate unique random indices
        while (indices.size < subsetSize) {
            indices.add(rand(0, csvData.length - 1));
        }
        
        subset = Array.from(indices).map(index => csvData[index]);
    } while (arraysEqual(subset, previousSubset)); // Ensure different result from last one
    
    previousSubset = subset;
    displayResult(subset);
}

/**
 * Displays the generated subset in a table format.
 * @param {Array} subset - The subset of data to be displayed.
 */
function displayResult(subset) {
    const resultDiv = document.getElementById('resultDisplay');
    const table = document.createElement('table');
    
    // Create table header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // Create table rows for subset data
    subset.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    // Clear previous results and display new table
    resultDiv.innerHTML = '';
    resultDiv.appendChild(table);
}
