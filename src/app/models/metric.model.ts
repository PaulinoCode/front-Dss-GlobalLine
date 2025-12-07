import { ProductModel } from "./product.model";

export interface MetricModel {
  id?: number;
  date: string;
  salesUnits: number;
  adSpend: number;
  revenue: number;

  product?: ProductModel;
  productId?: number;
}
