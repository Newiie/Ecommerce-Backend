import mongoose, { Document} from "mongoose";

interface IJwtToken extends Request {
    id: string;
    token: string;
    role: string;
}

interface AuthResult {
    id?: string;
    error?: string;
    token?: string;
    role?: string;
}

interface IProductVariation {
    variationId: string; 
    variationName: string;  
    size?: string;          
    color?: string;         
    price: number;          
    discountRate?: number;  
    productImage?: Buffer;         
    stock: number;          
}
  
interface IProduct extends Document {
    name: string;
    rating: number; 
    numOfReviews: number;
    productImage: Buffer;   
    basePrice: number;
    variations: IProductVariation[];  
    imagesVariation?: Buffer[];       
    defaultVariationIndex?: number;   
    productId?: string;
  }


interface IReview extends Document {
    rating: number;
    comment: string;
    image?: string;
    location: string;
    reviewedAt: Date;
    user: mongoose.Schema.Types.ObjectId;
    product: mongoose.Schema.Types.ObjectId; 
}


interface IUser extends Document {
    username: string;
    name: string;
    passwordHash: string;
    cart: { 
      product: mongoose.Schema.Types.ObjectId, 
      quantity: number }[];
    orderHistory: { product: mongoose.Schema.Types.ObjectId, quantity: number, purchasedAt: Date }[];
    orders: mongoose.Schema.Types.ObjectId[];
    role: string;
}

interface ICartItem {
    id: string,
    productId: mongoose.Schema.Types.ObjectId,
    name: string,
    quantity: number,
    price: number,
    image: Buffer
}


export { 
    IJwtToken, 
    IProductVariation, 
    IProduct, 
    IReview, 
    IUser, 
    ICartItem, 
    AuthResult 
};