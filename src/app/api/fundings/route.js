import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { stripe } from '../../../lib/stripe'

export async function POST(request) { 
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const body = await request.json();
    const { amount, userId, userEmail, userName } = body;

    const userSession = await auth.api.getSession({
        headers : await headers()
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "Organization Donation Support",
              description: `Thank you for supporting our database platform, ${userName || 'Anonymous Donor'}!`,
            },
            unit_amount: Math.round(amount * 100), 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: userId || 'guest',
        userEmail: userEmail || 'anonymous@test.com',
        userName: userName || 'Anonymous Donor',
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/funding`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Backend Error:", err.message);
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    )
  }
}