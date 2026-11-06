// 1. Find the HTML elements that JavaScript needs to update.
const countrySelect = document.getElementById("countrySelect");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const resetButton = document.getElementById("resetButton");
const statusMessage = document.getElementById("statusMessage");

let covidData = [];
let trendChart = null;
let newCasesChart = null;

// 2. Load the JSON file when the page opens.
async function loadCovidData() {
  try {
    const response = await fetch("data/covid-19.json");

    if (!response.ok) {
      throw new Error("Could not find data/covid-19.json");
    }

    const json = await response.json();
    covidData = json.countries;

    // Add each country from the JSON file to the dropdown.
    covidData.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.code;
      option.textContent = country.country;
      countrySelect.appendChild(option);
    });

    statusMessage.textContent = `Data loaded successfully. Source: ${json.source}`;
    updateDashboard();
  } catch (error) {
    statusMessage.textContent = "Error loading data. " + error.message +
      " Make sure you run this project with Live Server.";
    console.error(error);
  }
}

// 3. Get the selected country's records and apply the date filter.
function getFilteredRecords() {
  const selectedCountry = covidData.find(
    (country) => country.code === countrySelect.value
  );

  if (!selectedCountry) return [];

  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  return selectedCountry.data
    .filter((record) => record.date >= startDate && record.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// 4. Calculate the difference between consecutive cumulative totals.
function addNewCases(records) {
  return records.map((record, index) => {
    const previousConfirmed = index === 0 ? 0 : records[index - 1].confirmed;
    return {
      ...record,
      newCases: record.confirmed - previousConfirmed
    };
  });
}

// 5. Format large numbers with commas, for example 105,792.
function formatNumber(number) {
  return number.toLocaleString("en-US");
}

// 6. Update the four metric cards.
function updateMetrics(records) {
  const latest = records[records.length - 1];

  if (!latest) {
    document.getElementById("confirmedMetric").textContent = "—";
    document.getElementById("deathsMetric").textContent = "—";
    document.getElementById("recoveredMetric").textContent = "—";
    document.getElementById("activeMetric").textContent = "—";
    return;
  }

  const activeCases = latest.confirmed - latest.deaths - latest.recovered;

  document.getElementById("confirmedMetric").textContent = formatNumber(latest.confirmed);
  document.getElementById("deathsMetric").textContent = formatNumber(latest.deaths);
  document.getElementById("recoveredMetric").textContent = formatNumber(latest.recovered);
  document.getElementById("activeMetric").textContent = formatNumber(activeCases);
}

// 7. Draw or refresh the cumulative line chart.
function updateTrendChart(records) {
  const context = document.getElementById("trendChart");

  if (trendChart) trendChart.destroy();

  trendChart = new Chart(context, {
    type: "line",
    data: {
      labels: records.map((record) => record.date),
      datasets: [
        { label: "Confirmed", data: records.map((r) => r.confirmed),
          borderColor: "#2878c8", backgroundColor: "#2878c8", tension: 0.25 },
        { label: "Deaths", data: records.map((r) => r.deaths),
          borderColor: "#df6262", backgroundColor: "#df6262", tension: 0.25 },
        { label: "Recoveries", data: records.map((r) => r.recovered),
          borderColor: "#35a47a", backgroundColor: "#35a47a", tension: 0.25 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: { y: { beginAtZero: true, ticks: { callback: (value) => value.toLocaleString() } } }
    }
  });
}

// 8. Draw or refresh the bar chart for increases between reported dates.
function updateNewCasesChart(records) {
  const recordsWithNewCases = addNewCases(records);
  const context = document.getElementById("newCasesChart");

  if (newCasesChart) newCasesChart.destroy();

  newCasesChart = new Chart(context, {
    type: "bar",
    data: {
      labels: recordsWithNewCases.map((record) => record.date),
      datasets: [{
        label: "New confirmed cases since previous reported date",
        data: recordsWithNewCases.map((record) => record.newCases),
        backgroundColor: "#6b9ed6",
        borderRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, ticks: { callback: (value) => value.toLocaleString() } } }
    }
  });
}

// 9. Show a short, simple insight for the selected country.
function updateInsight(records) {
  const selectedCountry = covidData.find((country) => country.code === countrySelect.value);
  const insightText = document.getElementById("insightText");

  if (!records.length) {
    insightText.textContent = "There are no records for this country in the selected date range. Try changing the dates.";
    return;
  }

  const first = records[0];
  const last = records[records.length - 1];
  const increase = last.confirmed - first.confirmed;

  insightText.textContent =
    `${selectedCountry.country} had ${formatNumber(last.confirmed)} confirmed cases by ${last.date}. ` +
    `Compared with the first visible report (${first.date}), confirmed cases increased by ` +
    `${formatNumber(increase)}. These figures are cumulative reported totals.`;
}

// 10. Refresh all dashboard sections after a user changes a control.
function updateDashboard() {
  const records = getFilteredRecords();

  updateMetrics(records);
  updateTrendChart(records);
  updateNewCasesChart(records);
  updateInsight(records);
}

// 11. Listen for changes to the dropdown and date inputs.
countrySelect.addEventListener("change", updateDashboard);
startDateInput.addEventListener("change", updateDashboard);
endDateInput.addEventListener("change", updateDashboard);

resetButton.addEventListener("click", () => {
  startDateInput.value = "2020-02-01";
  endDateInput.value = "2020-03-31";
  updateDashboard();
});

// Start the application.
loadCovidData();
