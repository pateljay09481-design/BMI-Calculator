
const form = document.getElementById("bmi-form");
const button = document.getElementById("calculate-button");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    errorMessage.textContent = "";
    button.disabled = true;
    button.textContent = "Calculating...";

    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);

    try {
        const response = await fetch("/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ height, weight })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Calculation failed.");
        }

        const bmi = data.bmi;
        const category = data.category;

        // Update the result panel.
        document.getElementById("bmi-value").textContent =
            bmi.toFixed(2);
        document.getElementById("result-category").textContent =
            category;
        document.getElementById("result-advice").textContent =
            data.advice;

        document.getElementById("result-height").textContent =
            `${data.height} cm`;
        document.getElementById("result-weight").textContent =
            `${data.weight} kg`;
        document.getElementById("mini-bmi").textContent =
            bmi.toFixed(2);
        document.getElementById("mini-category").textContent =
            category;

        // Update summary cards.
        document.getElementById("summary-bmi").textContent =
            bmi.toFixed(2);
        document.getElementById("summary-category").textContent =
            category;
        document.getElementById("summary-status").textContent =
            category === "Normal Weight"
                ? "Within normal adult range"
                : "See your result below";

        document.getElementById("goal-text").textContent =
            category === "Normal Weight"
                ? "Stay Healthy"
                : "Healthy Habits";

        // Animate the gauge to represent BMI.
        const gauge = document.getElementById("gauge");
        const fill = Math.min(Math.max((bmi / 40) * 100, 2), 100);

        let color = "#159b72";
        if (bmi < 18.5) color = "#239be0";
        else if (bmi >= 25 && bmi < 30) color = "#f39a35";
        else if (bmi >= 30) color = "#ee5155";

        gauge.style.setProperty("--gauge-fill", `${fill}%`);
        gauge.style.setProperty("--gauge-color", color);

        // Add the calculation to temporary page history.
        const historyBody = document.getElementById("history-body");
        if (historyBody.querySelector("td[colspan]")) {
            historyBody.innerHTML = "";
        }

        const row = document.createElement("tr");
        [bmi.toFixed(2), `${data.height} cm`,
         `${data.weight} kg`, category].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        historyBody.prepend(row);

        // Show the result.
        document.getElementById("result-status").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    } catch (error) {
        errorMessage.textContent =
            error.message || "Unable to contact the server.";
    } finally {
        button.disabled = false;
        button.textContent = "▦   Calculate BMI";
    }
});

// Highlight the sidebar link for the section being viewed.
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });
        link.classList.add("active");
    });
});
