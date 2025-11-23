import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: reviews });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const review = await Review.create(body);
        return NextResponse.json({ success: true, data: review }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 400 });
    }
}
