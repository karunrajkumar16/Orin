import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    category: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    image: string;
    images: string[];
    description: string;
    materials: string[];
    colors: string[];
    sizes: string[];
    stock: number;
    model3d?: string;
    createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, required: true, min: 0 },
        discountPercentage: { type: Number, default: 0 },
        image: { type: String, required: true },
        images: [{ type: String }],
        description: { type: String, required: true },
        materials: [{ type: String }],
        colors: [{ type: String }],
        sizes: [{ type: String }],
        stock: { type: Number, required: true, default: 0 },
        model3d: { type: String },
    },
    { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
