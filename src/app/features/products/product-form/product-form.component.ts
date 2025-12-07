import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// Importamos Modelos y Servicios
import { ProductModel } from '../../../models/product.model';
import { ClientModel } from '../../../models/client.model';
import { ProductService } from '../../../services/product.service'; // Asegúrate de tener este servicio creado
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  isEditMode = false;
  productId?: number;

  clients$!: Observable<ClientModel[]>;

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    // 1. Cargar la lista de clientes disponibles para el dropdown
    this.clients$ = this.clientService.getClients();

    // 2. Verificar si es edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProductData(this.productId);
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      asin: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      clientId: [null, Validators.required]
    });
  }

  loadProductData(id: number) {
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          ...product,
          clientId: product.client?.id
        });
      },
      error: (err) => console.error('Error al cargar producto:', err)
    });
  }

  save() {
    if (this.productForm.invalid) return;

    const formValue = this.productForm.value;

    // TRANSFORMACIÓN DE DATOS (El truco para la relación)
    // El backend espera un objeto { client: { id: 1 } }, no { clientId: 1 }
    const productData: ProductModel = {
      ...formValue,
      client: { id: Number(formValue.clientId) } as any
    };

    if (this.isEditMode && this.productId) {
      // ACTUALIZAR
      this.productService.update(this.productId, productData).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      // CREAR
      this.productService.create(productData).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}
