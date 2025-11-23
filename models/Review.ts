import mongoose from "mongoose";

export interface IReview extends mongoose.Document {
    name: string;
    rating: number;
    message: string;
    createdAt: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength: [60, "Name cannot be more than 60 characters"],
    },
    rating: {
        type: Number,
        required: [true, "Please provide a rating"],
        min: 1,
        max: 5,
    },
    message: {
        type: String,
        required: [true, "Please provide a message"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
