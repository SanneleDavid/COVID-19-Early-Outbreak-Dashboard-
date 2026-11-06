# COVID-19 Early Outbreak Dashboard

A beginner-friendly HTML, CSS and JavaScript dashboard using the supplied COVID-19 JSON dataset and Chart.js.

## 1. Requirements
- Visual Studio Code
- A web browser (Chrome, Edge, Firefox, etc.)
- VS Code extension: Live Server
- Internet connection when opening the dashboard, because Chart.js is loaded from its CDN

## 2. Project files
- `index.html` - dashboard page and chart areas
- `css/style.css` - layout, colours and responsive design
- `js/app.js` - loads JSON, calculates metrics and creates charts
- `data/covid-19.json` - COVID-19 data supplied for this project

## 3. Run the dashboard in VS Code
1. Extract the project ZIP file.
2. Open VS Code.
3. Select **File > Open Folder** and choose `covid-19-early-outbreak-dashboard`.
4. In VS Code, open Extensions (the blocks icon on the left).
5. Search for **Live Server** and install it.
6. Open `index.html`.
7. Right-click inside the editor and choose **Open with Live Server**.
8. Your browser should open the dashboard.

Important: Do not open `index.html` by double-clicking it in File Explorer. The browser's `fetch()` function needs the project to run through a local web server such as Live Server.

## 4. Calculations
- Latest confirmed cases: confirmed value in the last available record within the selected date range.
- Latest deaths: deaths value in that same last record.
- Latest recoveries: recovered value in that same last record.
- Active cases: confirmed - deaths - recovered.
- New cases between reported dates: current cumulative confirmed - previous reported cumulative confirmed. For the first visible record, the first cumulative total is used as the starting increase.

## 5. Missing dates and interpretation
The dataset contains selected reporting dates, not a complete daily time series. The dashboard plots only dates supplied in the JSON. It does not fill missing dates with zero. The bar chart shows the increase between consecutive visible reports; the interval can be more than one day. If the date filter hides earlier reports, the first visible bar is the first visible cumulative total, not a change from the previous hidden report.

## 6. Basic testing checklist
- [ ] Dashboard opens without a JSON loading error.
- [ ] Dropdown contains all five countries.
- [ ] Changing country updates all four cards and both charts.
- [ ] Changing dates filters the displayed records.
- [ ] Reset dates restores the full period.
- [ ] South Africa begins with 1 confirmed case on 2020-03-05.
- [ ] South Africa ends with 1,353 confirmed cases, 5 deaths and 31 recoveries on 2020-03-31.
- [ ] Italy ends with 105,792 confirmed cases on 2020-03-31.
- [ ] United States ends with 188,172 confirmed cases on 2020-03-31.
- [ ] No JavaScript errors appear in the browser console.

## 7. Suggested screenshots for submission
Take screenshots in your browser with:
1. China selected.
2. Italy selected.
3. South Africa selected, showing the date range that includes 2020-03-05.
4. The daily-increase bar chart visible.

To take a screenshot on Windows, press `Win + Shift + S`, select the dashboard area, and save the image.

## 8. Notes about the dataset
This project displays the data exactly as provided in the project JSON file. It is a historical learning exercise. The supplied records are sparse snapshots, so the dashboard should not be interpreted as showing every calendar day's case count.
