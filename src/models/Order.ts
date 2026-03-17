import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface IOrder extends Document {
    userId: string;
    items: IOrderItem[];
    subtotal: number;
    shipping: number;
    platformFee: number;
    gst: number;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: {
        name: string;
        phone: string;
        addressLine: string;
        city: string;
        state: string;
        pincode: string;
    };
    createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: String, required: true },
        items: [OrderItemSchema],
        subtotal: { type: Number, required: true },
        shipping: { type: Number, required: true },
        platformFee: { type: Number, required: true },
        gst: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        shippingAddress: {
            name: String,
            phone: String,
            addressLine: String,
            city: String,
            state: String,
            pincode: String,
        },
    },
    { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
