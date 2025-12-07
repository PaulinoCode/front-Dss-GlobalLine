import {Component, inject, OnInit} from '@angular/core';
import {MetricModel} from '../../../models/metric.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {ProductModel} from '../../../models/product.model';
import {MetricService} from '../../../services/metric.service';
import {PredictionService} from '../../../services/prediction.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-metric-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './metric-form.component.html',
  styleUrl: './metric-form.component.scss',
})
export class MetricFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  metricId?: number;

  products$!: Observable<ProductModel[]>;

  private fb = inject(FormBuilder);
  private metricService = inject(MetricService);
  private predictionService = inject(PredictionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    // 1. Cargar productos para el dropdown
    this.products$ = this.predictionService.getProducts();

    // 2. Verificar si es edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.metricId = Number(id);
      this.loadMetricData(this.metricId);
    }
  }

  initForm() {
    this.form = this.fb.group({
      date: ['', Validators.required],
      productId: [null, Validators.required], // Usamos tu campo auxiliar
      salesUnits: [0, [Validators.required, Validators.min(0)]],
      revenue: [0, [Validators.required, Validators.min(0)]],
      adSpend: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadMetricData(id: number) {
    this.metricService.getById(id).subscribe({
      next: (metric) => {
        this.form.patchValue({
          ...metric,
          productId: metric.product?.id
        });
      },
      error: (err) => console.error('Error al cargar métrica:', err)
    });
  }

  save() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const metricData: MetricModel = {
      ...formValue,
      product: { id: Number(formValue.productId) } as any
    };

    if (this.isEditMode && this.metricId) {
      this.metricService.update(this.metricId, metricData).subscribe(() => {
        this.router.navigate(['/metrics']);
      });
    } else {
      this.metricService.create(metricData).subscribe(() => {
        this.router.navigate(['/metrics']);
      });
    }
  }
}
