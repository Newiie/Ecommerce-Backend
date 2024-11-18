export interface IProductRepository {
    findById(id: string): Promise<any>;
    getAllProduct(): Promise<any>;
    save(productData: any): Promise<any>;
    update(id: string, productData: any): Promise<any>;
    delete(id: string): Promise<any>;
    findVariationById(id: string): Promise<any>;
}
