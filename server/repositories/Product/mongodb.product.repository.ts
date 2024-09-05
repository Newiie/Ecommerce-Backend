// repositories/mongodb.product.repository.ts

import { IProductRepository } from './product.repository';
import Product, { IProduct } from '../../models/product.model';

export class MongoDbProductRepository implements IProductRepository {
    public async findById(id: string): Promise<IProduct | null> { 
        return await Product.findById(id);
    }

    public async getAllProduct() : Promise<IProduct[] | void> {
        return await Product.find({});
    }

    public async save(productData: IProduct): Promise<IProduct> {
        const product = new Product(productData);
        return await product.save();
    }

    public async update(id: string, productData: IProduct): Promise<IProduct | null> {
        return await Product.findByIdAndUpdate(id, productData, { new: true });
    }

    public async delete(id: string): Promise<IProduct | null> {
        return await Product.findByIdAndDelete(id);
    }
}
