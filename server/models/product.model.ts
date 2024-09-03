import mongoose, { Schema, Document } from "mongoose";

interface IProductVariation {
  variationName: string;
  price: number;
  discountRate?: number;
  image?: string;
}

interface IProduct extends Document {
  name: string;
  rating: number;
  numOfReviews: number;
  price: number;
  discountRate?: number;
  productImage: string;
  variations: IProductVariation[];
  imagesVariation?: string[];
}

const productVariationSchema = new mongoose.Schema<IProductVariation>({
  variationName: { type: String, required: true },
  price: { type: Number, required: true },
  discountRate: { type: Number },
  image: { type: String }
});

const productSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  numOfReviews: { type: Number, required: true },
  price: { type: Number, required: true },
  discountRate: { type: Number },
  productImage: { type: String, required: true },
  variations: [productVariationSchema],
  imagesVariation: [String],
});

productSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
