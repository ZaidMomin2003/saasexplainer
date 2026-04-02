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
    // The DodoPayments SDK returns an auto-paginating async iterator for .list()
    // We use a for-await loop to collect the payments we need.
    const allPayments: any[] = [];
    
    // Using for-await which is the official way to iterate through Dodo paginated responses
    const paymentsIterator = client.payments.list({
        page_size: 100,
    });

    for await (const payment of paymentsIterator) {
        // Collect up to 100 for filtering
        allPayments.push(payment);
        if (allPayments.length >= 100) break;
    }

    // 2. Filter payments for this specific user
    // We check either the customer email or the metadata.userId we passed during checkout
    const userPayments = allPayments.filter((payment: any) => {
        const isEmailMatch = payment.customer?.email === userEmail;
        const isIdMatch = payment.metadata?.userId === userId;
        return isEmailMatch || isIdMatch;
    });

    // 3. Format for our UI
    const formattedInvoices = userPayments.map((payment: any) => {
      // Handle both .amount and .total_amount just in case
      const amountVal = payment.total_amount || payment.amount || 0;
      
      return {
        id: `INV-${payment.payment_id.slice(-8).toUpperCase()}`,
        amount: `$${(amountVal / 100).toFixed(2)}`,
        status: payment.status === 'succeeded' ? 'Paid' : payment.status,
        date: new Date(payment.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        receiptUrl: payment.receipt_url || payment.invoice_url || '#',
      };
    });

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error: any) {
    console.error('Error fetching billing history:', error);
    return NextResponse.json({ error: 'Failed to fetch billing history' }, { status: 500 });
  }
}
