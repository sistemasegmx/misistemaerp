import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { filterByDateOptionsType, ItemsWidgetData } from "src/app/pages/dashboard/dashboard.component";
import { Observable } from "rxjs";

@Component({
  selector: 'app-charts-widget3',
  templateUrl: './charts-widget3.component.html',
})
export class ChartsWidget3Component implements OnInit {

  @Input() title: string;
  @Input() itemsFilteredBy: filterByDateOptionsType;
  @Input() dataLabel: string;
  @Input() anchorLink: string;
  @Input() itemsData: Observable<ItemsWidgetData>;

  totalItems: number;
  chartOptions: any = {};

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.itemsData.subscribe(itemsData => {
      this.chartOptions = getChartOptions(450, itemsData.values, this.dataLabel, itemsData.xAxys);
      this.totalItems = itemsData.values.reduce((a, b) => a + b);
    })
  }
}

function getChartOptions(height: number, items: any, dataLabel: string, categories: any) {

  const labelColor = getCSSVariableValue('--bs-gray-500');
  const borderColor = getCSSVariableValue('--bs-gray-200');
  const baseColor = getCSSVariableValue('--bs-info');
  const lightColor = getCSSVariableValue('--bs-info-light');

  return {
    series: [
      {
        name: dataLabel,
        data: items,
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        position: 'front',
        stroke: {
          color: baseColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return '' + val + '';
        },
      },
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  };
}
