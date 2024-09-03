import Product from '../models/product.model';

class ProductRepository {
    public async findById(id: string) {
        return await Product.findById(id);
    }

    public async createProduct(productData: any) {
        const product = new Product(productData);
        return await product.save();
    }


    // Additional data access logic can go here...
}

export default new ProductRepository();
