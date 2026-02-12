// Chart Renderers for Different Chart Types
// Supports: Bar, Line, Pie, Doughnut, Pictogram, Venn, Flowchart, Mind Map

class ChartRenderers {

    // Render Bar Chart
    static renderBar(canvas, data, options = {}) {
        return new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: options.label || 'Data',
                    data: data.values,
                    backgroundColor: data.colors || this.getDefaultColors(data.values.length),
                    borderColor: data.borderColors || this.getDefaultBorderColors(data.values.length),
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: options.showLegend !== false,
                        labels: { color: '#fff', font: { size: 12 } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    }

    // Render Line Chart
    static renderLine(canvas, data, options = {}) {
        return new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: options.label || 'Data',
                    data: data.values,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: options.showLegend !== false,
                        labels: { color: '#fff', font: { size: 12 } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    }

    // Render Pie Chart
    static renderPie(canvas, data, options = {}) {
        return new Chart(canvas, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: data.colors || this.getDefaultColors(data.values.length),
                    borderColor: '#1e1e2e',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: options.showLegend !== false,
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1
                    }
                }
            }
        });
    }

    // Render Doughnut Chart
    static renderDoughnut(canvas, data, options = {}) {
        return new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: data.colors || this.getDefaultColors(data.values.length),
                    borderColor: '#1e1e2e',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: options.showLegend !== false,
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1
                    }
                }
            }
        });
    }

    // Render Pictogram
    static renderPictogram(container, data, options = {}) {
        const icons = options.icons || ['📦', '🎁', '📊', '💼'];
        const scale = options.scale || 100; // Each icon represents X units

        let html = '<div class="pictogram-container">';

        data.labels.forEach((label, index) => {
            const count = Math.ceil(data.values[index] / scale);
            const icon = icons[index % icons.length];

            for (let i = 0; i < count; i++) {
                html += `<div class="pictogram-item" title="${label}: ${data.values[index]}">${icon}</div>`;
            }
        });

        html += '</div>';

        // Add legend
        html += '<div class="pictogram-legend">';
        data.labels.forEach((label, index) => {
            html += `
                <div class="pictogram-legend-item">
                    <span class="pictogram-legend-icon">${icons[index % icons.length]}</span>
                    <span>${label}: ${data.values[index]}</span>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    // Render Venn Diagram (Simple 2-3 circle implementation)
    static renderVenn(container, data, options = {}) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '300');
        svg.setAttribute('viewBox', '0 0 400 300');

        const colors = data.colors || this.getDefaultColors(data.values.length);

        // Simple 3-circle Venn
        if (data.labels.length >= 3) {
            this.createVennCircle(svg, 150, 120, 80, colors[0], data.labels[0], data.values[0]);
            this.createVennCircle(svg, 250, 120, 80, colors[1], data.labels[1], data.values[1]);
            this.createVennCircle(svg, 200, 200, 80, colors[2], data.labels[2], data.values[2]);
        } else if (data.labels.length === 2) {
            this.createVennCircle(svg, 150, 150, 80, colors[0], data.labels[0], data.values[0]);
            this.createVennCircle(svg, 250, 150, 80, colors[1], data.labels[1], data.values[1]);
        }

        container.innerHTML = '';
        container.appendChild(svg);
    }

    static createVennCircle(svg, cx, cy, r, color, label, value) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', color);
        circle.setAttribute('fill-opacity', '0.5');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', '2');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.textContent = `${label}\n${value}`;

        svg.appendChild(circle);
        svg.appendChild(text);
    }

    // Render Flowchart using Mermaid
    static async renderFlowchart(container, data, options = {}) {
        const mermaidCode = `
flowchart TD
    Start[Product Categories] --> A[${data.labels[0]}: ${data.values[0]}]
    Start --> B[${data.labels[1]}: ${data.values[1]}]
    ${data.labels[2] ? `Start --> C[${data.labels[2]}: ${data.values[2]}]` : ''}
    ${data.labels[3] ? `Start --> D[${data.labels[3]}: ${data.values[3]}]` : ''}
    
    style Start fill:#667eea,stroke:#fff,stroke-width:2px,color:#fff
    style A fill:#f093fb,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#4facfe,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#43e97b,stroke:#fff,stroke-width:2px,color:#fff
    style D fill:#fa709a,stroke:#fff,stroke-width:2px,color:#fff
        `;

        container.innerHTML = `<div class="mermaid-container"><div class="mermaid">${mermaidCode}</div></div>`;

        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                theme: 'dark',
                startOnLoad: false,
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true
                }
            });
            await mermaid.run({ querySelector: '.mermaid' });
        }
    }

    // Render Mind Map using Mermaid
    static async renderMindMap(container, data, options = {}) {
        const mermaidCode = `
mindmap
  root((Product Categories))
    ${data.labels[0]}
      ${data.values[0]} orders
    ${data.labels[1]}
      ${data.values[1]} orders
    ${data.labels[2] ? `${data.labels[2]}\n      ${data.values[2]} orders` : ''}
    ${data.labels[3] ? `${data.labels[3]}\n      ${data.values[3]} orders` : ''}
        `;

        container.innerHTML = `<div class="mermaid-container"><div class="mermaid">${mermaidCode}</div></div>`;

        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                theme: 'dark',
                startOnLoad: false
            });
            await mermaid.run({ querySelector: '.mermaid' });
        }
    }

    // Helper: Get default colors
    static getDefaultColors(count) {
        const colors = [
            'rgba(102, 126, 234, 0.8)',  // Purple
            'rgba(240, 147, 251, 0.8)',  // Pink
            'rgba(79, 172, 254, 0.8)',   // Blue
            'rgba(67, 233, 123, 0.8)',   // Green
            'rgba(250, 112, 154, 0.8)',  // Red
            'rgba(254, 215, 102, 0.8)'   // Yellow
        ];
        return colors.slice(0, count);
    }

    static getDefaultBorderColors(count) {
        const colors = [
            'rgba(102, 126, 234, 1)',
            'rgba(240, 147, 251, 1)',
            'rgba(79, 172, 254, 1)',
            'rgba(67, 233, 123, 1)',
            'rgba(250, 112, 154, 1)',
            'rgba(254, 215, 102, 1)'
        ];
        return colors.slice(0, count);
    }
}
