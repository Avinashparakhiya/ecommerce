export class CreateOrderDto {
    readonly userId: string;
    readonly productId: string;
    readonly quantity: number;
  }
  
  export class UpdateOrderDto {
    readonly quantity?: number;
  }
  