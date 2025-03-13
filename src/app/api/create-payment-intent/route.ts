import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

interface RequestBody {
  amount: number;
  type: string;
    credits: number;
    title: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { amount, type ,  credits,title } = body;

    if (!(amount >= 100)) {
      return NextResponse.json(
        { error: "Invalid amount. Amount must be at least $1." },
        { status: 400 }
      );
    }
console.log('body data comming',body,)
    const paymentIntent = await stripe.paymentIntents.create({
      metadata: {
        // Use the metadata property to pass custom data
        type: type,
        credits: credits,
        title: title,
      },
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
