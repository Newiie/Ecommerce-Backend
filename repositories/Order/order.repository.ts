export interface IOrderRepository {
    createOrder(orderData: any): Promise<any>;
    findOrderById(id: string): Promise<any>;
    updateOrderStatus(id: string, status: string): Promise<any>;
    deleteOrder(id: string): Promise<any>;
    some(): Promise<any>;
}
  