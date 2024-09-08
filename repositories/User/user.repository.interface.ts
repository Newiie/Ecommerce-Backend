export interface IUserRepository {
    findByUsername(username: string): Promise<any>;
    findById(userId: string): Promise<any>;
    createUser(userData: any): Promise<any>;
    findAllUsers(): Promise<any>;
    updateUser(user: any): Promise<any> 
    addOrUpdateCart(userId: string, productId: string, quantity: number): Promise<void>;
    removeFromCart(userId: string, productId: string): Promise<void>;
    clearCart(userId: string): Promise<void>;
}