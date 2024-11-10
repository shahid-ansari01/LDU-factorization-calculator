// Function to generate matrix input fields based on dimension
function generateMatrixInputs() {
    const container = document.getElementById('matrix-container');
    const dimension = document.getElementById('matrix-dimension').value;

    // Clear any existing input fields
    container.innerHTML = '';

    if (dimension <= 0) {
        alert("Please enter a valid dimension greater than zero.");
        return;
    }

    // Set grid dimensions
    container.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;

    // Create input fields for matrix with labeled placeholders
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-input';
            input.id = `matrix-${i}-${j}`;
            input.placeholder = `a${i + 1}${j + 1}`; // Set placeholder as a[row][column]
            container.appendChild(input);
        }
    }

    // Show the submit button after generating inputs
    document.getElementById('submit-matrix').style.display = 'inline-block';
}

// Function to handle matrix submission and display the initial matrix
function submitMatrix() {
    const dimension = parseInt(document.getElementById('matrix-dimension').value);
    const matrix = [];

    // Gather matrix values from the input fields
    for (let i = 0; i < dimension; i++) {
        const row = [];
        for (let j = 0; j < dimension; j++) {
            const value = document.getElementById(`matrix-${i}-${j}`).value;
            row.push(Number(value));
        }
        matrix.push(row);
    }

    // Disable the submit button to prevent multiple submissions
    document.getElementById('submit-matrix').disabled = true;
    console.log("Initial Matrix:", matrix);
    displayMatrix(matrix, "Initial Matrix");
}

