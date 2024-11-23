"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbProductRepository = void 0;
const product_model_1 = __importDefault(require("../../models/product.model"));
class MongoDbProductRepository {
    async findById(id) {
        return await product_model_1.default.findById(id).lean().exec();
    }
    async findVariationById(variationId) {
        const product = await product_model_1.default.findOne({ "variations._id": variationId }, { "variations.$": 1 }).lean().exec();
        return product ? product.variations[0] : null;
    }
    async getAllProduct() {
        return await product_model_1.default.find({});
    }
    async save(productData) {
        const product = new product_model_1.default(productData);
        return await product.save();
    }
    async update(id, productData) {
        return await product_model_1.default.findByIdAndUpdate(id, productData, { new: true });
    }
    async delete(id) {
        return await product_model_1.default.findByIdAndDelete(id);
    }
}
exports.MongoDbProductRepository = MongoDbProductRepository;
