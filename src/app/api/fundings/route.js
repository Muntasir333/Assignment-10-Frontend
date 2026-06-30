import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { stripe } from '../../../lib/stripe'

export async function POST(request) { // 👈 Make sure to accept the request object here
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // 🌟 FIX 1: Extract variables from the request body
    const body = await request.json();
    const { amount, userId, userEmail, userName } = body;

    const userSession = await auth.api.getSession({
        headers : await headers()
    })

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "Organization Donation Support",
              // 🌟 Now ${userName} will work perfectly
              description: `Thank you for supporting our database platform, ${userName || 'Anonymous Donor'}!`,
            },
            // 🌟 Now amount will work perfectly
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

    // 🌟 FIX 2: Return a JSON response with the URL instead of an automated 303 Redirect.
    // Next.js client-side 'fetch' handles JSON responses much better.
    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Backend Error:", err.message); // Helpful debug indicator
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    )
  }
}