/**
 * ChartSwitcher - Handles the logic for switching between different chart types
 * and managing the dropdown UI for chart cards.
 */
class ChartSwitcher {
    constructor(config) {
        this.containerId = config.containerId;
        this.canvasId = config.canvasId;
        this.chartData = config.data;
        this.title = config.title;
        this.currentType = localStorage.getItem(`chart_type_${this.containerId}`) || config.defaultType || 'doughnut';
        this.chartInstance = null;
        this.onTypeChange = config.onTypeChange || null;

        this.init();
    }

    init() {
        this.renderMenu();
        this.renderChart();
        this.setupEventListeners();
    }

    renderMenu() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Ensure container has relative positioning for dropdown
        container.style.position = 'relative';

        // Add header if it doesn't exist
        let header = container.querySelector('.chart-header');
        if (!header) {
            header = document.createElement('div');
            header.className = 'chart-header';
            header.innerHTML = `
                <h3 class="chart-title">${this.title}</h3>
                <button class="chart-menu-btn" title="Ganti tipe chart">⋮</button>
                <div class="chart-type-dropdown">
                    <div class="chart-type-item" data-type="bar" title="Diagram Batang">
                        <span class="chart-type-icon">📊</span>
                        <span class="chart-type-name">Bar Chart</span>
                    </div>
                    <div class="chart-type-item" data-type="line" title="Diagram Garis">
                        <span class="chart-type-icon">📈</span>
                        <span class="chart-type-name">Line Chart</span>
                    </div>
                    <div class="chart-type-item" data-type="pie" title="Diagram Lingkaran">
                        <span class="chart-type-icon">🥧</span>
                        <span class="chart-type-name">Pie Chart</span>
                    </div>
                    <div class="chart-type-item" data-type="doughnut" title="Diagram Donat">
                        <span class="chart-type-icon">🍩</span>
                        <span class="chart-type-name">Doughnut Chart</span>
                    </div>
                    <div class="chart-type-item" data-type="pictogram" title="Piktogram">
                        <span class="chart-type-icon">🎭</span>
                        <span class="chart-type-name">Pictogram</span>
                    </div>
                    <div class="chart-type-item" data-type="venn" title="Diagram Venn">
                        <span class="chart-type-icon">⭕</span>
                        <span class="chart-type-name">Venn Diagram</span>
                    </div>
                    <div class="chart-type-item" data-type="flowchart" title="Alir (Flowchart)">
                        <span class="chart-type-icon">🔀</span>
                        <span class="chart-type-name">Flowchart</span>
                    </div>
                    <div class="chart-type-item" data-type="mindmap" title="Peta Pikiran">
                        <span class="chart-type-icon">🧠</span>
                        <span class="chart-type-name">Mind Map</span>
                    </div>
                </div>
            `;
            container.prepend(header);
        }

        this.updateActiveItem();
    }

    setupEventListeners() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const menuBtn = container.querySelector('.chart-menu-btn');
        const dropdown = container.querySelector('.chart-type-dropdown');
        const items = container.querySelectorAll('.chart-type-item');

        // Toggle dropdown
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });

        // Handle item selection
        items.forEach(item => {
            item.addEventListener('click', () => {
                const newType = item.getAttribute('data-type');
                if (newType !== this.currentType) {
                    this.switchType(newType);
                }
                dropdown.classList.remove('active');
            });
        });
    }

    updateActiveItem() {
        const container = document.getElementById(this.containerId);
        const items = container.querySelectorAll('.chart-type-item');
        items.forEach(item => {
            if (item.getAttribute('data-type') === this.currentType) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    async renderChart() {
        const container = document.getElementById(this.containerId);
        let chartBody = container.querySelector('.chart-body');

        if (!chartBody) {
            chartBody = document.createElement('div');
            chartBody.className = 'chart-body';
            container.appendChild(chartBody);
        }

        // Clear existing content
        chartBody.innerHTML = '';
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }

        // Add transition class
        chartBody.classList.add('chart-transition');

        const canvasId = `${this.canvasId}_${Date.now()}`;

        try {
            switch (this.currentType) {
                case 'bar':
                    chartBody.innerHTML = `<div class="chart-container"><canvas id="${canvasId}"></canvas></div>`;
                    this.chartInstance = ChartRenderers.renderBar(document.getElementById(canvasId), this.chartData, { label: this.title });
                    break;
                case 'line':
                    chartBody.innerHTML = `<div class="chart-container"><canvas id="${canvasId}"></canvas></div>`;
                    this.chartInstance = ChartRenderers.renderLine(document.getElementById(canvasId), this.chartData, { label: this.title });
                    break;
                case 'pie':
                    chartBody.innerHTML = `<div class="chart-container"><canvas id="${canvasId}"></canvas></div>`;
                    this.chartInstance = ChartRenderers.renderPie(document.getElementById(canvasId), this.chartData);
                    break;
                case 'doughnut':
                    chartBody.innerHTML = `<div class="chart-container"><canvas id="${canvasId}"></canvas></div>`;
                    this.chartInstance = ChartRenderers.renderDoughnut(document.getElementById(canvasId), this.chartData);
                    break;
                case 'pictogram':
                    ChartRenderers.renderPictogram(chartBody, this.chartData);
                    break;
                case 'venn':
                    ChartRenderers.renderVenn(chartBody, this.chartData);
                    break;
                case 'flowchart':
                    await ChartRenderers.renderFlowchart(chartBody, this.chartData);
                    break;
                case 'mindmap':
                    await ChartRenderers.renderMindMap(chartBody, this.chartData);
                    break;
            }
        } catch (error) {
            console.error(`Error rendering ${this.currentType}:`, error);
            chartBody.innerHTML = `<div class="chart-error">Error rendering chart: ${error.message}</div>`;
        }

        // Remove transition class after animation
        setTimeout(() => {
            chartBody.classList.remove('chart-transition');
        }, 300);
    }

    switchType(newType) {
        this.currentType = newType;
        localStorage.setItem(`chart_type_${this.containerId}`, newType);
        this.updateActiveItem();
        this.renderChart();

        if (this.onTypeChange) {
            this.onTypeChange(newType);
        }
    }

    updateData(newData) {
        this.chartData = newData;
        this.renderChart();
    }
}
