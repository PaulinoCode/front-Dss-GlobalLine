import { Component, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

// Servicios
import { DashboardService } from '../../services/dashboard.service';
import { MetricService } from '../../services/metric.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private metricService = inject(MetricService);
  private cdr = inject(ChangeDetectorRef);

  // Referencias a las gráficas para poder actualizarlas
  @ViewChild('lineChart') lineChart?: BaseChartDirective;
  @ViewChild('pieChart') pieChart?: BaseChartDirective;
  @ViewChild('top3ClientsChart') top3ClientsChart?: BaseChartDirective;
  @ViewChild('barChart') barChart?: BaseChartDirective;
  @ViewChild('comparisonChart') comparisonChart?: BaseChartDirective;

  // Estados de carga (Spinners)
  isLoadingMonthly = true;
  isLoadingClients = true;
  isLoadingTopProducts = true;
  isLoadingComparison = true;

  totalRevenue: number = 0;

  // --- 1. CONFIG: TENDENCIA MENSUAL (LÍNEA) ---
  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  lineChartOptions: ChartOptions<'line'> = { responsive: true };

  // --- 2. CONFIG: CLIENTES (PASTEL) ---
  pieChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  pieChartOptions: ChartOptions<'pie'> = { responsive: true };

  // --- 3. CONFIG: RANKING TOP 3 CLIENTES (BARRAS HORIZONTALES) ---
  top3ChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  top3ChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y', // Hace que las barras sean horizontales
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Top 3 Clientes' }
    }
  };

  // --- 4. CONFIG: TOP 5 PRODUCTOS (BARRAS) ---
  barChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  barChartOptions: ChartOptions<'bar'> = { responsive: true };

  // --- 5. CONFIG: COMPARATIVA REVENUE VS ADS (BARRAS AGRUPADAS) ---
  comparisonChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  comparisonChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  ngOnInit(): void {
    this.loadKpi();
    this.loadMonthly();
    this.loadClients(); // Carga Pastel + Ranking
    this.loadTopProducts();
    this.loadComparison(); // Carga Comparativa Financiera
  }

  loadKpi() {
    this.dashboardService.getKpiTotal().subscribe(res => {
      this.totalRevenue = res.total_revenue;
    });
  }

  loadMonthly() {
    this.isLoadingMonthly = true;
    this.dashboardService.getMonthlyRevenue().subscribe(data => {
      this.lineChartData = {
        labels: data.map(d => d.date),
        datasets: [{
          data: data.map(d => d.revenue),
          label: 'Ingresos Mensuales ($)',
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.1)',
          fill: true
        }]
      };
      this.isLoadingMonthly = false;
      this.cdr.detectChanges();
    });
  }

  loadClients() {
    this.isLoadingClients = true;
    this.dashboardService.getSalesByClient().subscribe(data => {

      // A) GRÁFICA DE PASTEL (Todos)
      this.pieChartData = {
        labels: data.map(d => d.client),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
      };

      // B) GRÁFICA RANKING (Top 3)
      // 1. Ordenar de mayor a menor
      const sortedData = [...data].sort((a, b) => b.value - a.value);
      // 2. Tomar los 3 mejores
      const top3 = sortedData.slice(0, 3);

      this.top3ChartData = {
        labels: top3.map(d => d.client),
        datasets: [{
          data: top3.map(d => d.value),
          label: 'Total Comprado ($)',
          backgroundColor: '#198754', // Verde
          borderRadius: 5,
          barThickness: 25
        }]
      };

      this.isLoadingClients = false;
      this.cdr.detectChanges();
    });
  }

  loadTopProducts() {
    this.isLoadingTopProducts = true;
    this.dashboardService.getTopProducts().subscribe(data => {
      this.barChartData = {
        labels: data.map(d => d.product),
        datasets: [{
          data: data.map(d => d.sales),
          label: 'Ventas Totales ($)',
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      };
      this.isLoadingTopProducts = false;
      this.cdr.detectChanges();
    });
  }

  loadComparison() {
    this.isLoadingComparison = true;

    // Pedimos TODAS las métricas crudas para procesarlas aquí
    this.metricService.getAll().subscribe(metrics => {

      // 1. Agrupar por Mes (YYYY-MM)
      const groupedData: any = {};

      metrics.forEach(m => {
        // m.date viene como "2024-01-15", cortamos a "2024-01"
        const month = m.date.toString().substring(0, 7);

        if (!groupedData[month]) {
          groupedData[month] = { revenue: 0, adSpend: 0 };
        }

        groupedData[month].revenue += m.revenue;
        groupedData[month].adSpend += m.adSpend;
      });

      // 2. Preparar arrays para la gráfica
      const labels = Object.keys(groupedData).sort();
      const revenueData = labels.map(label => groupedData[label].revenue);
      const adSpendData = labels.map(label => groupedData[label].adSpend);

      // 3. Configurar Datos
      this.comparisonChartData = {
        labels: labels,
        datasets: [
          {
            data: revenueData,
            label: 'Ingresos (Revenue)',
            backgroundColor: '#0d6efd',
            hoverBackgroundColor: '#0b5ed7'
          },
          {
            data: adSpendData,
            label: 'Gasto en Ads',
            backgroundColor: '#dc3545',
            hoverBackgroundColor: '#bb2d3b'
          }
        ]
      };

      this.isLoadingComparison = false;
      this.cdr.detectChanges();
    });
  }
}
