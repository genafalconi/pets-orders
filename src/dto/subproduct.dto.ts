export class SubproductDto {
  id: string;
  idProduct: string;
  productName: string;
  price: number;
  size: number;
  quantity: number;
  isActive: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
}


export enum Payment_Type {
  CASH = 'CASH',
  MP = 'MP',
  TRANSFERENCIA = 'TRANSFERENCIA'
}