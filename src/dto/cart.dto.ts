import { SubproductDto } from './subproduct.dto';

export class CartDto {
  id: string;
  user: string;
  products: Array<SubproductDto>;
  totalPrice: number;
  totalProducts: number;
  created_at: string;
  updated_at: string;
}
