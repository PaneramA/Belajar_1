// Business Overview Dashboard Charts

// Sample data
const productCategories = ['Doohickey', 'Gadget', 'Gizmo', 'Widget'];
const categoryColors = ['#90caf9', '#ab47bc', '#66bb6a', '#ffa726'];

// Initialize all charts when page loads
document.addEventListener('DOMContentLoaded', () => {
    initOrdersDonutChart();
    initRatingGaugeChart();
    initRevenueTimeChart();
    initRevenueBarChart();
    initOrdersLineChart();
    animateProgressBar();
});

// Orders by Product Category - Managed by ChartSwitcher
function initOrdersDonutChart() {
    const data = {
        labels: productCategories,
        values: [21, 27, 25, 27],
        colors: categoryColors
    };

    window.ordersChartSwitcher = new ChartSwitcher({
        containerId: 'ordersProductCategoryCard',
        canvasId: 'ordersDonutChart',
        title: 'Orders by product category',
        data: data,
        defaultType: 'doughnut'
    });
}

// Average Product Rating - Gauge Chart
function initRatingGaugeChart() {
    const ctx = document.getElementById('ratingGaugeChart');
    if (!ctx) return;

    const rating = 3.47;
    const percentage = (rating / 5) * 100;

    const data = {
        datasets: [{
            data: [percentage, 100 - percentage],
            backgroundColor: [
                createGradient(ctx, ['#f44336', '#ffa726', '#66bb6a']),
                'rgba(255, 255, 255, 0.1)'
            ],
            borderWidth: 0,
            circumference: 180,
            rotation: 270
        }]
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            cutout: '75%'
        },
        plugins: [{
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2 + 20;

                ctx.save();
                ctx.font = 'bold 36px Inter';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(rating.toFixed(2), centerX, centerY);
                ctx.restore();
            }
        }]
    });
}

// Revenue and Orders Over Time - Line Chart
function initRevenueTimeChart() {
    const ctx = document.getElementById('revenueTimeChart');
    if (!ctx) return;

    const quarters = ['Q1 2024', 'Q3 2024', 'Q1 2025', 'Q3 2025', 'Q1 2026'];

    const data = {
        labels: quarters,
        datasets: [
            {
                label: 'Orders',
                data: [2100, 2460, 2460, 2460, 2460],
                borderColor: '#ab47bc',
                backgroundColor: 'rgba(171, 71, 188, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Sum of Total',
                data: [123900, 142400, 141900, 141900, 141900],
                borderColor: '#66bb6a',
                backgroundColor: 'rgba(102, 187, 106, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#a0aec0',
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#a0aec0',
                        callback: function (value) {
                            return (value / 1000).toFixed(1) + 'k';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: '#a0aec0',
                        callback: function (value) {
                            return '$' + (value / 1000).toFixed(0) + 'k';
                        }
                    }
                }
            }
        }
    });
}

// Revenue by Product Category - Managed by ChartSwitcher
function initRevenueBarChart() {
    const data = {
        labels: ['Q1 2024', 'Q3 2024', 'Q1 2025', 'Q3 2025'],
        values: generateRevenueData(), // Simplifying for demo
        colors: categoryColors
    };

    window.revenueBarSwitcher = new ChartSwitcher({
        containerId: 'revenueProductCategoryCard',
        canvasId: 'revenueBarChart',
        title: 'Revenue by product category',
        data: data,
        defaultType: 'bar'
    });
}

// Orders Over Time - Managed by ChartSwitcher
function initOrdersLineChart() {
    const data = {
        labels: ['Q1 2024', 'Q1 2025', 'Q1 2026'],
        values: generateOrdersData(),
        colors: categoryColors
    };

    window.ordersTimeSwitcher = new ChartSwitcher({
        containerId: 'ordersTimeCard',
        canvasId: 'ordersLineChart',
        title: 'Orders over time',
        data: data,
        defaultType: 'line'
    });
}

// Helper Functions
function createGradient(ctx, colors) {
    const canvas = ctx.canvas;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
    });
    return gradient;
}

function generateRevenueData() {
    return Array.from({ length: 4 }, () => Math.random() * 15 + 8);
}

function generateOrdersData() {
    return Array.from({ length: 3 }, () => Math.random() * 200 + 300);
}

function animateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = '58%';
        }, 300);
    }
}
