// app.js

// Fetching the data from dados.json
fetch('dados.json')
    .then(response => response.json())
    .then(data => {
        // Populate dashboard with operations data
        populateDashboard(data);
    })
    .catch(error => console.error('Error loading the JSON data:', error));

// Function to populate dashboard
function populateDashboard(data) {
    const dashboard = document.getElementById('dashboard');
    // Clear previous content
    dashboard.innerHTML = '';

    data.forEach(operation => {
        const operationDiv = document.createElement('div');
        operationDiv.className = 'operation';
        operationDiv.innerText = `Operation: ${operation.name}, Month: ${operation.month}`;
        dashboard.appendChild(operationDiv);
    });
}

// Handling filters for operation and month selection
const operationFilter = document.getElementById('operation-filter');
const monthFilter = document.getElementById('month-filter');

operationFilter.addEventListener('change', filterData);
monthFilter.addEventListener('change', filterData);

function filterData() {
    const selectedOperation = operationFilter.value;
    const selectedMonth = monthFilter.value;

    fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(operation => {
                return (selectedOperation === 'all' || operation.name === selectedOperation) &&
                       (selectedMonth === 'all' || operation.month === selectedMonth);
            });
            populateDashboard(filteredData);
        })
        .catch(error => console.error('Error loading the JSON data:', error));
}