function generateMatrix() {
    const size = parseInt(document.getElementById("matrixSize").value);
    if (isNaN(size) || size < 2) {
        alert("Please enter a valid size (minimum 2).");
        return;
    }

    let container = document.getElementById("matrixContainer");
    container.innerHTML = `<h2>Enter the Matrix (${size}x${size}):</h2>`;
    let table = "<table>";

    for (let i = 0; i < size; i++) {
        table += "<tr>";
        for (let j = 0; j < size; j++) {
            table += `<td><input type="number" id="matrix-${i}-${j}" step="any" value="0" style="width: 60px;"></td>`;
        }
        table += "</tr>";
    }
    table += "</table>";
    container.innerHTML += table;

    document.getElementById("calculateButton").style.display = "block";
}

function getMatrixFromInputs(size) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(parseFloat(document.getElementById(`matrix-${i}-${j}`).value) || 0);
        }
        matrix.push(row);
    }
    return matrix;
}

function displayMatrix(matrix, title = "") {
    let html = `<div class="matrix"><strong>${title}</strong><table>`;
    matrix.forEach(row => {
        html += "<tr>";
        row.forEach(value => {
            html += `<td>${value.toFixed(3)}</td>`;
        });
        html += "</tr>";
    });
    html += "</table></div>";
    return html;
}

function multiplyMatrices(A, B) {
    const rowsA = A.length, colsA = A[0].length, colsB = B[0].length;
    let result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function performLDU() {
    const size = parseInt(document.getElementById("matrixSize").value);
    const A = getMatrixFromInputs(size);
    const n = A.length;

    let L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
    let U = JSON.parse(JSON.stringify(A)); // Deep copy of A
    let eliminationMatrices = [];
    let output = "";

    // Perform elimination
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (U[i][i] === 0) {
                output += "<p>Error: Zero pivot encountered. LDU factorization not possible.</p>";
                document.getElementById("output").innerHTML = output;
                return;
            }
            const factor = U[j][i] / U[i][i];
            for (let k = 0; k < n; k++) {
                U[j][k] -= factor * U[i][k];
            }
            L[j][i] = factor;

            // Construct elimination matrix
            const E = Array.from({ length: n }, (_, x) => Array.from({ length: n }, (_, y) => (x === y ? 1 : 0)));
            E[j][i] = -factor;
            eliminationMatrices.push(E);
        }
    }

    // Extract D from U
    const D = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? U[i][i] : 0)));
    U = U.map((row, i) => row.map((value, j) => (i === j ? 1 : value / U[i][i])));

    // Display elimination matrices
    output += "<h2>Elimination Matrices</h2>";
    eliminationMatrices.forEach((E, index) => {
        output += displayMatrix(E, `E${index + 1}`);
    });

    // Display L, D, U matrices
    output += "<h2>Lower Triangular Matrix (L)</h2>";
    output += displayMatrix(L);
    output += "<h2>Diagonal Matrix (D)</h2>";
    output += displayMatrix(D);
    output += "<h2>Upper Triangular Matrix (U)</h2>";
    output += displayMatrix(U);

    // Verify the result (LDU reconstruction)
    const reconstructMatrix = multiplyMatrices(multiplyMatrices(L, D), U);
    output += "<h2>Reconstructed Matrix (L * D * U)</h2>";
    output += displayMatrix(reconstructMatrix);

    document.getElementById("output").innerHTML = output;
}