import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe'; // Your stripe initialization file
// import { db } from '@/lib/db'; // Your database client connection

export async function POST(request) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    // Verify that the event actually came from Stripe
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the successful checkout event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extract user tracking details passed from your metadata earlier
    const { amount, userId, userEmail, userName } = session.metadata;

    try {
      // 🌟 INSERT INTO YOUR DATABASE HERE 🌟
      // Example matching your dashboard layout variables:
      // await db.funding.create({
      //   data: {
      //     amount: parseFloat(amount),
      //     userId,
      //     userEmail,
      //     userName,
      //     createdAt: new Date()
      //   }
      // });
      
      console.log(`Successfully logged ৳${amount} BDT from ${userName}`);
    } catch (dbError) {
      console.error("Database logging failed:", dbError);
      return NextResponse.json({ error: "Failed to log records" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}