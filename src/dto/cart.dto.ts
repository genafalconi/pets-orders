import { SubproductDto } from './subproduct.dto';

export class CartDto {
  _id: string;
  user: string;
  subproducts: Array<SubproductDto>;
  total_price: number;
  total_products: number;
}
