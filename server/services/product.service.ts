import Product from '../models/product.model';

class ProductService {
    // Method to get a product by ID
    public async getProductById(id: string) {
        return await Product.findById(id);
    }

    // Method to create a new product
    public async createProduct(productData: any) {
        const product = new Product(productData);
        return await product.save();
    }

    // Method to update a product
    public async updateProduct(id: string, productData: any) {
        return await Product.findByIdAndUpdate(id, productData, { new: true });
    }

    // Method to delete a product
    public async deleteProduct(id: string) {
        return await Product.findByIdAndDelete(id);
    }

    // Additional business logic related to products can go here...
}

export default new ProductService();
