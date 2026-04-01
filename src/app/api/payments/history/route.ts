import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('email');
  const userId = searchParams.get('userId');

  if (!userEmail) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // 1. Fetch payments from Dodo
    // For now, we fetch the latest payments and filter by metadata or email.
    // Dodo's API allows listing payments.
    const paymentsResponse = await client.payments.list({
        page_size: 100,
    });

    // 2. Filter payments for this specific user
    // We check either the customer email or the metadata.userId we passed during checkout
    const userPayments = paymentsResponse.data.filter((payment: any) => {
        const isEmailMatch = payment.customer?.email === userEmail;
        const isIdMatch = payment.metadata?.userId === userId;
        return isEmailMatch || isIdMatch;
    });

    // 3. Format for our UI
    const formattedInvoices = userPayments.map((payment: any) => ({
      id: `INV-${payment.payment_id.slice(-8).toUpperCase()}`,
      amount: `$${(payment.amount / 100).toFixed(2)}`,
      status: payment.status === 'succeeded' ? 'Paid' : payment.status,
      date: new Date(payment.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      receiptUrl: payment.receipt_url || '#',
    }));

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error: any) {
    console.error('Error fetching billing history:', error);
    return NextResponse.json({ error: 'Failed to fetch billing history' }, { status: 500 });
  }
}
