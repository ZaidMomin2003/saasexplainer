import { NextResponse } from 'next/server';
import { executeApi } from "@/helpers/api-response";
import { z } from "zod";
import { getDodoClient } from '@/lib/dodo';

const CheckoutRequest = z.object({
  projectId: z.string(),
  userId: z.string().optional(),
});

export const POST = executeApi<any, typeof CheckoutRequest>(
  CheckoutRequest,
  async (req, body) => {
    const client = getDodoClient();
    const { projectId, userId } = body;
    
    // Create a checkout session linking this Project ID
    const session = await client.checkoutSessions.create({
      product_cart: [{
        product_id: process.env.DODO_PRODUCT_ID!,
        quantity: 1,
      }],
      customer: userId ? {
         // If we have a user, we could pass their info here if available
      } : undefined,
      metadata: {
        projectId,
        userId: userId || 'anonymous',
      },
      // Redirect back to our render state page on success
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/render/${projectId}`,
    });

    return {
      type: 'success',
      data: {
        checkout_url: session.url
      }
    };
  }
);
