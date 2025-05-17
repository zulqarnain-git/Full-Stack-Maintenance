document.addEventListener('DOMContentLoaded', function () {
    // --- Mock Data (from React example) ---
    const summaryCardsData = [
        {
            title: "Total Maintenance Requests",
            value: 106,
            iconClass: "fa-solid fa-envelope", // Lucide Mail equivalent
            iconColorClass: "icon-mail",
            trend: { value: '12%', isPositive: true }
        },
        {
            title: "Active Contracts",
            value: 24,
            iconClass: "fa-solid fa-file-lines", // Lucide FileText equivalent
            iconColorClass: "icon-file",
            trend: { value: '5%', isPositive: true }
        },
        {
            title: "Registered Clients",
            value: 38,
            iconClass: "fa-solid fa-users", // Lucide Users equivalent
            iconColorClass: "icon-users",
        },
        {
            title: "Representatives",
            value: 15,
            iconClass: "fa-solid fa-truck-fast", // Lucide Truck equivalent
            iconColorClass: "icon-truck",
        }
    ];

    const requestsData = [
        { id: 'REQ001', client: 'ABC Corporation', vehicle: 'Toyota Land Cruiser', date: '2025-05-06', status: 'pending' },
        { id: 'REQ002', client: 'XYZ Industries', vehicle: 'Ford F-150', date: '2025-05-05', status: 'approved' },
        { id: 'REQ003', client: 'Global Logistics', vehicle: 'Mercedes Sprinter', date: '2025-05-04', status: 'in-progress' },
        { id: 'REQ004', client: 'Tech Solutions Inc', vehicle: 'Nissan Patrol', date: '2025-05-03', status: 'completed' },
        { id: 'REQ005', client: 'First National Bank', vehicle: 'Lexus LX570', date: '2025-05-02', status: 'rejected' }
    ];

    const statusItemsData = [
        { id: '1', label: 'Pending', count: 18, color: 'var(--warning-color)' }, // Matched with CSS variables
        { id: '2', label: 'Approved', count: 27, color: 'var(--primary-color)' },
        { id: '3', label: 'In Progress', count: 12, color: 'var(--accent-color)' },
        { id: '4', label: 'Completed', count: 42, color: 'var(--secondary-color)' }, // Using secondary-color for teal
        { id: '5', label: 'Rejected', count: 7, color: 'var(--danger-color)' }
    ];

    const budgetData = {
        monthly: 120000,
        used: 65840,
    };

    // --- DOM Elements ---
    const statsCardsGrid = document.querySelector('.stats-cards-grid');
    const recentRequestsTableBody = document.getElementById('recentRequestsTableBody');
    const statusOverviewContent = document.getElementById('statusOverviewContent');
    const totalRequestsCountEl = document.getElementById('totalRequestsCount');

    const monthlyBudgetEl = document.getElementById('monthlyBudget');
    const budgetUsedEl = document.getElementById('budgetUsed');
    const budgetRemainingEl = document.getElementById('budgetRemaining');
    const budgetProgressBar = document.getElementById('budgetProgressBar');
    const budgetPercentageText = document.getElementById('budgetPercentageText');

    // --- Render Functions ---

    function renderSummaryCards() {
        if (!statsCardsGrid) return;
        statsCardsGrid.innerHTML = ''; // Clear existing
        summaryCardsData.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'stat-card';
            let trendHTML = '';
            if (card.trend) {
                trendHTML = `
                    <div class="trend ${card.trend.isPositive ? 'positive' : 'negative'}">
                        <i class="fas ${card.trend.isPositive ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                        ${card.trend.value}
                    </div>
                `;
            }
            cardElement.innerHTML = `
                <div class="stat-card-icon ${card.iconColorClass}">
                    <i class="${card.iconClass}"></i>
                </div>
                <div class="stat-card-info">
                    <h4>${card.title}</h4>
                    <p class="value">${card.value.toLocaleString()}</p>
                    ${trendHTML}
                </div>
            `;
            statsCardsGrid.appendChild(cardElement);
        });
    }

    function renderRecentRequests() {
        if (!recentRequestsTableBody) return;
        recentRequestsTableBody.innerHTML = ''; // Clear existing
        requestsData.slice(0, 5).forEach(req => { // Show top 5 or all
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${req.id}</td>
                <td>${req.client}</td>
                <td>${req.vehicle}</td>
                <td>${new Date(req.date).toLocaleDateString()}</td>
                <td><span class="status-badge status-${req.status}">${req.status.replace('-', ' ')}</span></td>
            `;
            recentRequestsTableBody.appendChild(row);
        });
    }

    function renderStatusOverview() {
        if (!statusOverviewContent || !totalRequestsCountEl) return;
        
        // Clear existing items except the total count placeholder
        const existingItems = statusOverviewContent.querySelectorAll('.status-item');
        existingItems.forEach(item => item.remove());

        const totalRequests = statusItemsData.reduce((acc, item) => acc + item.count, 0);
        totalRequestsCountEl.textContent = totalRequests;

        // Find the total count div to insert before it
        const totalCountDiv = statusOverviewContent.querySelector('.total-status-count');

        statusItemsData.forEach(item => {
            const percentage = totalRequests > 0 ? (item.count / totalRequests) * 100 : 0;
            const itemElement = document.createElement('div');
            itemElement.className = 'status-item';
            itemElement.innerHTML = `
                <div class="status-label-count">
                    <span class="status-label">${item.label}</span>
                    <span class="status-count">${item.count}</span>
                </div>
                <div class="status-progress-bar-bg">
                    <div class="status-progress-bar" style="width: ${percentage}%; background-color: ${item.color};"></div>
                </div>
            `;
            // Insert before the total count div
            if (totalCountDiv) {
                statusOverviewContent.insertBefore(itemElement, totalCountDiv);
            } else {
                statusOverviewContent.appendChild(itemElement); // Fallback
            }
        });
    }

    function renderBudgetOverview() {
        if (!monthlyBudgetEl || !budgetUsedEl || !budgetRemainingEl || !budgetProgressBar || !budgetPercentageText) return;

        const remaining = budgetData.monthly - budgetData.used;
        const usedPercentage = budgetData.monthly > 0 ? (budgetData.used / budgetData.monthly) * 100 : 0;

        monthlyBudgetEl.textContent = `$${budgetData.monthly.toLocaleString()}`;
        budgetUsedEl.textContent = `$${budgetData.used.toLocaleString()}`;
        budgetRemainingEl.textContent = `$${remaining.toLocaleString()}`;
        budgetProgressBar.style.width = `${usedPercentage}%`;
        budgetPercentageText.textContent = `${Math.round(usedPercentage)}% of budget used`;
    }

    function renderRegionalPerformanceChart() {
        const ctx = document.getElementById('regionalPerformanceChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar', // or 'line', 'pie', etc.
            data: {
                labels: ['North', 'South', 'East', 'West', 'Central'],
                datasets: [{
                    label: 'Performance Index',
                    data: [65, 59, 80, 81, 56], // Mock data
                    backgroundColor: 'rgba(59, 130, 246, 0.6)', // Primary color with opacity
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)' // Lighter grid lines
                        }
                    },
                    x: {
                         grid: {
                            display: false // Hide x-axis grid lines
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    }
                }
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // --- Active Nav Link ---
    const navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // e.preventDefault(); // Remove if these are actual navigation links
            navLinks.forEach(li => li.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Close sidebar on mobile after click if it's open
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });


    // --- Initialize Dashboard ---
    renderSummaryCards();
    renderRecentRequests();
    renderStatusOverview();
    renderBudgetOverview();
    renderRegionalPerformanceChart();
});
// --- Mobile Menu Toggle ---
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');

if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Optional: Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggler = mobileMenuToggle.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnToggler && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// --- Active Nav Link (and close sidebar on mobile nav click) ---
const navLinks = document.querySelectorAll('.nav-menu li a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // If these are # links for SPA-like behavior, prevent default.
        // If they navigate to other pages, this part is fine.
        // e.preventDefault(); 
        
        navLinks.forEach(li => li.parentElement.classList.remove('active'));
        this.parentElement.classList.add('active');
        
        // Close sidebar on mobile after a nav link is clicked
        if (window.innerWidth <= 992 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
});