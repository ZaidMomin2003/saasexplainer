import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { executeApi } from "@/helpers/api-response";
import { z } from "zod";

const CheckoutRequest = z.object({
  projectId: z.string(),
  userId: z.string().optional(),
});

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
});

export const POST = executeApi<any, typeof CheckoutRequest>(
  CheckoutRequest,
  async (req, body) => {
    const { projectId, userId } = body;
    
    // Create a checkout session linking this Project ID
    const session = await client.checkoutSessions.create({
      product_cart: [{
        product_id: process.env.DODO_PRODUCT_ID!,
        quantity: 1,
      }],
      metadata: {
        projectId,
        userId: userId || 'anonymous',
      },
      // Redirect back to our render state page on success
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/render/${projectId}`,
    });

    return session;
  }
);
