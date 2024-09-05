import mongoose, { Schema, Document } from "mongoose";

interface IProductVariation {
  variationName: string;  // E.g., "Size-Color" combination
  size?: string;          // Optional: Size like "S", "M", "L"
  color?: string;         // Optional: Color like "Red", "Blue"
  price: number;          // Price specific to this variation
  discountRate?: number;  // Optional discount specific to this variation
  image?: string;         // Image specific to this variation
}

interface IProduct extends Document {
  name: string;
  rating: number; 
  numOfReviews: number;
  basePrice: number;      // Base price of the product
  discountRate?: number;  // Discount at the product level (optional)
  productImage: string;
  variations: IProductVariation[]; // Product variations (e.g., size, color)
  imagesVariation?: string[];      // Additional images for variations
}

// Updated schema for product variations
const productVariationSchema = new mongoose.Schema<IProductVariation>({
  variationName: { type: String, required: true },
  size: { type: String },             // Optional size
  color: { type: String },            // Optional color
  price: { type: Number, required: true },  // Price specific to the variation
  discountRate: { type: Number },     // Optional discount at the variation level
  image: { type: String },            // Optional image specific to the variation
});

// Updated schema for the product
const productSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  numOfReviews: { type: Number, required: true, default: 0 },
  basePrice: { type: Number, required: true },    // Base price of the product
  discountRate: { type: Number },                 // Optional global discount
  productImage: { type: String, required: true }, // Main product image
  variations: [productVariationSchema],           // Array of variations
  imagesVariation: [String],                      // Array of variation images
});

// Transform output for clean JSON
productSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Create and export Product model
const Product = mongoose.model<IProduct>('Product', productSchema);
export { IProduct };
export default Product;
