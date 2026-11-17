const startBtn = document.getElementById("startBtn");

const home = document.getElementById("home");
const dashboard = document.getElementById("dashboard");

const securityPage = document.getElementById("securityPage");
const trackingPage = document.getElementById("trackingPage");
const lostPage = document.getElementById("lostPage");
const emergencyPage = document.getElementById("emergencyPage");
const recoveryPage = document.getElementById("recoveryPage");

const openButtons = document.querySelectorAll(".feature-card button");

// Start Protection
startBtn.addEventListener("click", function () {
    home.style.display = "none";
    dashboard.style.display = "block";
});

// Open Dashboard Features
const pages = [
    securityPage,
    trackingPage,
    lostPage,
    emergencyPage,
    recoveryPage
];

openButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
        dashboard.style.display = "none";

        pages.forEach(function (page) {
            page.style.display = "none";
        });

        pages[index].style.display = "block";

        if (index === 4) {
            showRecoveryRecords();
        }
    });
});

// Back to Dashboard
function goDashboard() {
    pages.forEach(function (page) {
        page.style.display = "none";
    });

    dashboard.style.display = "block";
}

// Security Scan
document.getElementById("scanBtn").addEventListener("click", function () {
    document.getElementById("scanResult").innerText =
        "✓ Security Scan Completed!";
});

// Device Location
document.getElementById("locationBtn").addEventListener("click", function () {

    const status = document.getElementById("trackingStatus");
    const deviceLocation = document.getElementById("deviceLocation");
    const result = document.getElementById("locationResult");

    if (!navigator.geolocation) {
        result.innerText = "Location is not supported.";
        return;
    }

    status.innerText = "Checking...";
    result.innerText = "Requesting permission...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            status.innerText = "Location Found";
            deviceLocation.innerText =
                lat.toFixed(5) + ", " + lon.toFixed(5);

            result.innerText = "✓ Location Found Successfully!";
        },
        function () {
            status.innerText = "Unavailable";
            result.innerText = "Location permission denied or unavailable.";
        }
    );
});

// Load Saved Reports
function getReports() {
    try {
        return JSON.parse(localStorage.getItem("phantomReports")) || [];
    } catch {
        return [];
    }
}

// Lost Device Report
document.getElementById("reportBtn").addEventListener("click", function () {

    const name = document.getElementById("deviceName").value.trim();
    const model = document.getElementById("deviceModel").value.trim();
    const location = document.getElementById("lastLocation").value.trim();
    const contact = document.getElementById("contactNumber").value.trim();

    const result = document.getElementById("reportResult");

    if (!name || !model || !location || !contact) {
        result.innerText = "⚠️ Please fill all details!";
        return;
    }

    const reports = getReports();

    const report = {
        id: "PG-" + Date.now().toString().slice(-6),
        name: name,
        model: model,
        location: location,
        contact: contact,
        status: "Submitted (Demo)",
        date: new Date().toLocaleString()
    };

    reports.push(report);

    try {
        localStorage.setItem("phantomReports", JSON.stringify(reports));
    } catch {
        result.innerText = "Unable to save report in this browser.";
        return;
    }

    result.innerText = "✓ Report Saved! ID: " + report.id;

    document.getElementById("deviceName").value = "";
    document.getElementById("deviceModel").value = "";
    document.getElementById("lastLocation").value = "";
    document.getElementById("contactNumber").value = "";
});

// Emergency Alert Demo
document.getElementById("sosBtn").addEventListener("click", function () {

    const contact = document.getElementById("emergencyContact").value.trim();
    const result = document.getElementById("emergencyResult");

    if (!/^[0-9]{10}$/.test(contact)) {
        result.innerText = "⚠️ Enter a valid 10-digit number.";
        return;
    }

    result.innerText =
        "✓ DEMO SOS ALERT ACTIVATED! Contact: " + contact;
});

// Show Recovery Records
function showRecoveryRecords() {

    const reports = getReports();

    const list = document.getElementById("recoveryList");
    const total = document.getElementById("totalReports");

    total.innerText = reports.length;
    list.innerHTML = "";

    if (reports.length === 0) {
        list.textContent = "No Recovery Records Found.";
        return;
    }

    reports.forEach(function (report) {

        const card = document.createElement("div");
        card.className = "recovery-item";

        const title = document.createElement("h3");
        title.textContent = report.name;

        const details = [
            "Report ID: " + report.id,
            "Device Model: " + report.model,
            "Last Location: " + report.location,
            "Contact: " + report.contact,
            "Status: " + report.status,
            "Date: " + report.date
        ];

        card.appendChild(title);

        details.forEach(function (detail) {
            const p = document.createElement("p");
            p.textContent = detail;
            card.appendChild(p);
        });

        list.appendChild(card);
    });
}

// Refresh Recovery Records
document.getElementById("refreshRecords").addEventListener("click", function () {
    showRecoveryRecords();
});