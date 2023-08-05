import { Component, OnInit, ViewChild } from '@angular/core';
// eslint-disable-next-line max-len
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexDataLabels, ApexYAxis, ApexTitleSubtitle, ApexLegend, ChartComponent } from 'ng-apexcharts';
import { series } from './datos-ejemplo';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chart-ejemplo',
  templateUrl: './chart-ejemplo.component.html',
  styleUrls: ['./chart-ejemplo.component.scss'],
})
export class ChartEjemploComponent implements OnInit {
  @ViewChild('chartEnTiempoReal') chart: ChartComponent;

  chartOptions: ChartOptions;


  constructor() {
  }

  ngOnInit() {
    this.chartOptions = {
      series: [
        {
          name: 'STOCK ABC',
          data: series.monthDataSeries1.prices
        }
      ],
      chart: {
        type: 'area',
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },

      title: {
        text: 'Fundamental Analysis of Stocks',
        align: 'left'
      },
      subtitle: {
        text: 'Price Movements',
        align: 'left'
      },
      labels: series.monthDataSeries1.dates,
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: 'left'
      }
    };

    //  Llama al evento "resize", actualizando el chart.
    setTimeout(() => (window as any).dispatchEvent(new Event('resize')), 1);

    //  Obtener nuevos datos
    const newPrices = [...series.monthDataSeries1.prices];
    const newDates = [...series.monthDataSeries1.dates];
    let newDate = new Date(2017, 11, 8);

    setInterval(() => {
      const nuevoDato = newPrices[newPrices.length - 1] * (0.5 + Math.random());
      newPrices.shift();
      newPrices.push(nuevoDato);

      newDate = new Date(newDate.getTime() + 1000 * 60 * 60 * 24);
      newDates.shift();
      newDates.push(newDate.toISOString());

      this.chart.updateOptions({
        labels: [...newDates]
      });

      this.chart.updateSeries([{
        data: [...newPrices]
      }], true);
    }, 1000);
  }
}
