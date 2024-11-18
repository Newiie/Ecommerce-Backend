import { IProductRepository } from './product.repository';
import Product, { IProduct } from '../../models/product.model';
import { IProductVariation } from '../../utils/types';

export class MongoDbProductRepository implements IProductRepository {

    public async findById(id: string): Promise<any> { 
        return await Product.findById(id).lean().exec();
    }

    public async findVariationById(variationId: string): Promise<any> {
        const product = await Product.findOne(
            { "variations._id": variationId },
            { "variations.$": 1 } 
        ).lean().exec();
    
        return product ? product.variations[0] : null;
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
