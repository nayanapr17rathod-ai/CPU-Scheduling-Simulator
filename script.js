// ==========================================
// CPU SCHEDULING SIMULATOR
// ==========================================

let processes = [
    {
        pid: "P1",
        arrival: 0,
        burst: 5,
        priority: 2
    },
    {
        pid: "P2",
        arrival: 1,
        burst: 3,
        priority: 1
    },
    {
        pid: "P3",
        arrival: 2,
        burst: 4,
        priority: 3
    }
];

let selectedAlgorithm = "FCFS";

let simulationResult = [];


// ==========================================
// READ EDITABLE VALUES
// ==========================================

function readProcessesFromTable() {

    const rows = document.querySelectorAll("tbody tr");

    let updatedProcesses = [];

    rows.forEach((row, index) => {

        const cells = row.querySelectorAll("td");

        if (cells.length < 4) {
            return;
        }

        const arrivalInput =
            cells[1].querySelector("input");

        const burstInput =
            cells[2].querySelector("input");

        const priorityInput =
            cells[3].querySelector("input");

        if (!arrivalInput || !burstInput || !priorityInput) {
            return;
        }

        updatedProcesses.push({

            pid: "P" + (index + 1),

            arrival: Number(arrivalInput.value),

            burst: Number(burstInput.value),

            priority: Number(priorityInput.value)

        });

    });

    processes = updatedProcesses;

    return processes;
}


// ==========================================
// FCFS
// ==========================================

function fcfs(processList) {

    let sorted = [...processList].sort(
        (a, b) => a.arrival - b.arrival
    );

    let currentTime = 0;

    let result = [];

    sorted.forEach(process => {

        if (currentTime < process.arrival) {
            currentTime = process.arrival;
        }

        const startTime = currentTime;

        const completionTime =
            startTime + process.burst;

        const turnaroundTime =
            completionTime - process.arrival;

        const waitingTime =
            turnaroundTime - process.burst;

        const responseTime =
            startTime - process.arrival;

        result.push({

            ...process,

            start: startTime,

            completion: completionTime,

            turnaround: turnaroundTime,

            waiting: waitingTime,

            response: responseTime

        });

        currentTime = completionTime;

    });

    return result;
}


// ==========================================
// SJF
// ==========================================

function sjf(processList) {

    let remaining = [...processList];

    let result = [];

    let currentTime = 0;


    while (remaining.length > 0) {

        let available = remaining.filter(
            process => process.arrival <= currentTime
        );


        if (available.length === 0) {

            currentTime =
                Math.min(
                    ...remaining.map(
                        process => process.arrival
                    )
                );

            continue;
        }


        available.sort(
            (a, b) => {

                if (a.burst !== b.burst) {
                    return a.burst - b.burst;
                }

                return a.arrival - b.arrival;

            }
        );


        const process = available[0];

        const startTime = currentTime;

        const completionTime =
            startTime + process.burst;

        const turnaroundTime =
            completionTime - process.arrival;

        const waitingTime =
            turnaroundTime - process.burst;

        const responseTime =
            startTime - process.arrival;


        result.push({

            ...process,

            start: startTime,

            completion: completionTime,

            turnaround: turnaroundTime,

            waiting: waitingTime,

            response: responseTime

        });


        currentTime = completionTime;


        remaining =
            remaining.filter(
                p => p.pid !== process.pid
            );

    }

    return result;
}


// ==========================================
// PRIORITY
// Lower number = Higher priority
// ==========================================

function priorityScheduling(processList) {

    let remaining = [...processList];

    let result = [];

    let currentTime = 0;


    while (remaining.length > 0) {

        let available = remaining.filter(
            process => process.arrival <= currentTime
        );


        if (available.length === 0) {

            currentTime =
                Math.min(
                    ...remaining.map(
                        process => process.arrival
                    )
                );

            continue;
        }


        available.sort(
            (a, b) => {

                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }

                return a.arrival - b.arrival;

            }
        );


        const process = available[0];

        const startTime = currentTime;

        const completionTime =
            startTime + process.burst;

        const turnaroundTime =
            completionTime - process.arrival;

        const waitingTime =
            turnaroundTime - process.burst;

        const responseTime =
            startTime - process.arrival;


        result.push({

            ...process,

            start: startTime,

            completion: completionTime,

            turnaround: turnaroundTime,

            waiting: waitingTime,

            response: responseTime

        });


        currentTime = completionTime;


        remaining =
            remaining.filter(
                p => p.pid !== process.pid
            );

    }

    return result;
}


// ==========================================
// CALCULATE RESULT
// ==========================================

function calculateResults() {

    readProcessesFromTable();


    if (selectedAlgorithm === "FCFS") {

        return fcfs(processes);

    }


    if (selectedAlgorithm === "SJF") {

        return sjf(processes);

    }


    if (selectedAlgorithm === "Priority") {

        return priorityScheduling(processes);

    }


    // Round Robin fallback
    return fcfs(processes);
}


// ==========================================
// PERFORMANCE CALCULATIONS
// ==========================================

function calculatePerformance(result) {

    if (result.length === 0) {

        return {
            averageWaiting: 0,
            averageTurnaround: 0,
            averageResponse: 0
        };

    }


    let totalWaiting = 0;

    let totalTurnaround = 0;

    let totalResponse = 0;


    result.forEach(process => {

        totalWaiting += process.waiting;

        totalTurnaround += process.turnaround;

        totalResponse += process.response;

    });


    return {

        averageWaiting:
            totalWaiting / result.length,

        averageTurnaround:
            totalTurnaround / result.length,

        averageResponse:
            totalResponse / result.length

    };

}


// ==========================================
// CPU UTILIZATION
// ==========================================

function calculateCPUUtilization(result) {

    if (result.length === 0) {
        return 0;
    }


    const totalBurst =
        result.reduce(
            (total, process) =>
                total + process.burst,
            0
        );


    const firstArrival =
        Math.min(
            ...processes.map(
                process => process.arrival
            )
        );


    const lastCompletion =
        Math.max(
            ...result.map(
                process => process.completion
            )
        );


    const totalTime =
        lastCompletion - firstArrival;


    if (totalTime <= 0) {
        return 0;
    }


    return (
        totalBurst / totalTime
    ) * 100;

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard(result) {

    const cards =
        document.querySelectorAll(
            ".card .value"
        );


    const performance =
        calculatePerformance(result);


    const utilization =
        calculateCPUUtilization(result);


    if (cards.length >= 4) {

        cards[0].textContent = "IDLE";

        cards[1].textContent =
            processes.length;

        cards[2].textContent =
            selectedAlgorithm;

        cards[3].textContent =
            utilization.toFixed(2) + "%";

    }


    const simulationTime =
        document.querySelector(
            ".simulation-time strong"
        );


    if (simulationTime && result.length > 0) {

        const lastCompletion =
            Math.max(
                ...result.map(
                    process => process.completion
                )
            );

        simulationTime.textContent =
            lastCompletion + " ms";

    }


    const performanceCards =
        document.querySelectorAll(
            ".performance-card strong"
        );


    if (performanceCards.length >= 3) {

        performanceCards[0].textContent =
            performance.averageWaiting.toFixed(2)
            + " ms";


        performanceCards[1].textContent =
            performance.averageTurnaround.toFixed(2)
            + " ms";


        performanceCards[2].textContent =
            performance.averageResponse.toFixed(2)
            + " ms";

    }

}


// ==========================================
// UPDATE GANTT CHART
// ==========================================

function updateGantt(result) {

    const gantt =
        document.querySelector(".gantt");


    if (!gantt) {
        return;
    }


    gantt.innerHTML = "";


    result.forEach(process => {

        const block =
            document.createElement("div");


        block.className =
            "gantt-block";


        block.innerHTML = `

            <strong>
                ${process.pid}
            </strong>

            <span>
                ${process.start} → ${process.completion}
            </span>

        `;


        gantt.appendChild(block);

    });

}


// ==========================================
// PROCESS STATE DISPLAY
// ==========================================

function updateProcessStates(currentTime) {

    const stateBoxes =
        document.querySelectorAll(
            ".state-box"
        );


    if (stateBoxes.length < 4) {
        return;
    }


    let ready = [];

    let running = [];

    let waiting = [];

    let terminated = [];


    simulationResult.forEach(process => {

        // Process has not arrived yet
        if (process.arrival > currentTime) {

            waiting.push(process);

        }

        // Process is currently running
        else if (
            currentTime >= process.start &&
            currentTime < process.completion
        ) {

            running.push(process);

        }

        // Process has completed
        else if (
            currentTime >= process.completion
        ) {

            terminated.push(process);

        }

        // Process has arrived but has not started
        else {

            ready.push(process);

        }

    });


    // ======================================
    // READY QUEUE
    // ======================================

    let readyHTML = `
        <h4>READY QUEUE</h4>
    `;


    if (ready.length === 0) {

        readyHTML += `
            <span class="tag ready">
                Empty
            </span>
        `;

    }
    else {

        ready.forEach(process => {

            readyHTML += `
                <span class="tag ready">
                    ${process.pid}
                </span>
            `;

        });

    }


    stateBoxes[0].innerHTML =
        readyHTML;


    // ======================================
    // RUNNING
    // ======================================

    let runningHTML = `
        <h4>RUNNING</h4>
    `;


    if (running.length === 0) {

        runningHTML += `
            <span class="tag running">
                CPU Idle
            </span>
        `;

    }
    else {

        running.forEach(process => {

            runningHTML += `
                <span class="tag running">
                    ${process.pid}
                </span>
            `;

        });

    }


    stateBoxes[1].innerHTML =
        runningHTML;


    // ======================================
    // WAITING
    // ======================================

    let waitingHTML = `
        <h4>WAITING</h4>
    `;


    if (waiting.length === 0) {

        waitingHTML += `
            <span class="tag waiting">
                Empty
            </span>
        `;

    }
    else {

        waiting.forEach(process => {

            waitingHTML += `
                <span class="tag waiting">
                    ${process.pid}
                </span>
            `;

        });

    }


    stateBoxes[2].innerHTML =
        waitingHTML;


    // ======================================
    // TERMINATED
    // ======================================

    let terminatedHTML = `
        <h4>TERMINATED</h4>
    `;


    if (terminated.length === 0) {

        terminatedHTML += `
            <span class="tag terminated">
                Empty
            </span>
        `;

    }
    else {

        terminated.forEach(process => {

            terminatedHTML += `
                <span class="tag terminated">
                    ${process.pid}
                </span>
            `;

        });

    }


    stateBoxes[3].innerHTML =
        terminatedHTML;

}


// ==========================================
// SHOW FINAL STATE
// ==========================================

function showFinalState() {

    if (simulationResult.length === 0) {
        return;
    }


    const finalTime =
        Math.max(
            ...simulationResult.map(
                process => process.completion
            )
        );


    updateProcessStates(finalTime);

}


// ==========================================
// RUN SIMULATION
// ==========================================

function runSimulation() {

    // Read current values from boxes
    readProcessesFromTable();


    // Calculate algorithm
    simulationResult =
        calculateResults();


    // Save result
    console.log(
        "Simulation Result:",
        simulationResult
    );


    // Update all calculations
    updateDashboard(
        simulationResult
    );


    updateGantt(
        simulationResult
    );


    // Start at time 0
    updateProcessStates(0);


    // Animate simulation
    animateSimulation();

}


// ==========================================
// SIMULATION ANIMATION
// ==========================================

function animateSimulation() {

    if (simulationResult.length === 0) {
        return;
    }


    const finalTime =
        Math.max(
            ...simulationResult.map(
                process => process.completion
            )
        );


    let currentTime = 0;


    // Clear old timer
    if (window.simulationTimer) {

        clearInterval(
            window.simulationTimer
        );

    }


    window.simulationTimer =
        setInterval(
            function() {

                updateProcessStates(
                    currentTime
                );


                currentTime++;


                if (currentTime > finalTime) {

                    clearInterval(
                        window.simulationTimer
                    );


                    updateProcessStates(
                        finalTime
                    );

                }

            },
            500
        );

}


// ==========================================
// ALGORITHM SELECTION
// ==========================================

function setupAlgorithms() {

    const cards =
        document.querySelectorAll(
            ".algorithm-card"
        );


    cards.forEach(
        (card, index) => {

            card.addEventListener(
                "click",
                function() {


                    cards.forEach(
                        item =>
                            item.classList.remove(
                                "selected"
                            )
                    );


                    card.classList.add(
                        "selected"
                    );


                    if (index === 0) {

                        selectedAlgorithm =
                            "FCFS";

                    }

                    else if (index === 1) {

                        selectedAlgorithm =
                            "SJF";

                    }

                    else if (index === 2) {

                        selectedAlgorithm =
                            "Round Robin";

                    }

                    else if (index === 3) {

                        selectedAlgorithm =
                            "Priority";

                    }


                    console.log(
                        "Selected Algorithm:",
                        selectedAlgorithm
                    );

                }
            );

        }
    );

}


// ==========================================
// START BUTTON
// ==========================================

function setupStartButton() {

    const button =
        document.querySelector(
            ".start-btn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            runSimulation();

        }
    );

}


// ==========================================
// KEEP INPUT BOXES EDITABLE
// ==========================================

function setupInputs() {

    const inputs =
        document.querySelectorAll(
            ".process-input"
        );


    inputs.forEach(input => {

        input.addEventListener(
            "change",
            function() {

                readProcessesFromTable();

            }
        );

    });

}


// ==========================================
// ADD PROCESS
// ==========================================

function setupAddProcess() {

    const button =
        document.querySelector(
            ".add-btn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            const tableBody =
                document.querySelector(
                    "tbody"
                );


            const number =
                processes.length + 1;


            const process = {

                pid:
                    "P" + number,

                arrival:
                    number - 1,

                burst:
                    2,

                priority:
                    number

            };


            processes.push(process);


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${process.pid}
                </td>

                <td>
                    <input
                        type="number"
                        class="process-input arrival-input"
                        value="${process.arrival}"
                        min="0">
                </td>

                <td>
                    <input
                        type="number"
                        class="process-input burst-input"
                        value="${process.burst}"
                        min="1">
                </td>

                <td>
                    <input
                        type="number"
                        class="process-input priority-input"
                        value="${process.priority}"
                        min="1">
                </td>

            `;


            tableBody.appendChild(row);


            setupInputs();

        }
    );

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "CPU Scheduler Simulator Ready"
        );


        setupStartButton();

        setupAlgorithms();

        setupInputs();

        setupAddProcess();

    }
);