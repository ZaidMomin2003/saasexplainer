import DodoPayments from 'dodopayments';

let clientInstance: DodoPayments | null = null;

export const getDodoClient = () => {
    // If we're during build and don't have the key, return a dummy or throw later at runtime
    // But importantly, don't throw during module evaluation if we can help it.
    const apiKey = process.env.DODOPAYMENTS_API_KEY;
    
    if (!apiKey) {
        // Return a proxy or just throw a better message at runtime
        // During build, (e.g. Next.js), we might not have it.
        // However, if we're not currently *calling* it, we're fine.
        // Let's just return what the constructor would:
        return new DodoPayments({
            bearerToken: 'BUILD_TIME_PLACEHOLDER', // Avoid the 'missing or empty' error 
            environment: 'test_mode',
        });
    }

    if (!clientInstance) {
        clientInstance = new DodoPayments({
            bearerToken: apiKey,
            environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
        });
    }

    return clientInstance;
};
