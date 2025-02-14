import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { HoneyProductionApiary } from '../../../queries/honey-prod.queries';
import * as echarts from 'echarts';
import {
  SelectComponent,
  SelectOptionModel,
} from '../../../shared/components/select/select.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-apiary-chart',
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule],
  templateUrl: './apiary-chart.component.html',
  styleUrl: './apiary-chart.component.scss',
})
export class ApiaryChartComponent implements OnInit {
  @Input({ required: true })
  public dataChart!: HoneyProductionApiary;

  protected chart!: echarts.EChartsType;

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly form = new FormControl<string>('week');
  protected readonly options: SelectOptionModel<string>[] = [
    { label: 'Minutes', value: 'minutes' },
    { label: 'Heure', value: 'hour' },
    { label: 'Semaine', value: 'week' },
    { label: 'Mois', value: 'month' },
  ];

  public ngOnInit(): void {
    this.initChart();
    this.filterData();
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filterData());
  }

  protected initChart(): void {
    const chartDom = document.getElementById('chart')!;
    this.chart = echarts.init(chartDom);
  }

  public filterData(): void {
    const filter = this.form.value || 'hour';
    const now = new Date();

    let filteredData = this.dataChart.honey_production.filter((item) => {
      const createdAt = new Date(item.created_at);
      if (filter === 'hour') {
        return now.getTime() - createdAt.getTime() <= 60 * 60 * 1000;
      } else if (filter === 'minutes') {
        return now.getTime() - createdAt.getTime() <= 60 * 1000;
      } else if (filter === 'week') {
        return now.getTime() - createdAt.getTime() <= 7 * 24 * 60 * 60 * 1000;
      } else if (filter === 'month') {
        return now.getTime() - createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000;
      }
      return false;
    });

    const chartData = filteredData.map((item) => ({
      name: this.formatDate(new Date(item.created_at), filter),
      value: item.value,
    }));

    this.updateChart(chartData);
  }

  protected formatDate(date: Date, filter: string): string {
    if (filter === 'minutes') {
      return date.toLocaleTimeString('fr-FR', {
        minute: '2-digit',
        second: '2-digit',
      });
    } else if (filter === 'hour') {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (filter === 'week') {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });
    } else if (filter === 'month') {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
      });
    }
    return date.toLocaleString();
  }

  protected updateChart(data: { name: string; value: number }[]): void {
    const option = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.name),
        axisLabel: { rotate: 45, fontSize: 8 },
      },
      yAxis: {
        type: 'value',
        name: 'Production',
      },
      series: [
        {
          name: 'Production',
          type: 'bar',
          data: data.map((d) => d.value),
          color: '#EC7F20',
          barWidth: '50%',
        },
      ],
    };

    this.chart.setOption(option);
  }
}
