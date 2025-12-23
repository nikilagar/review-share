import DodoPayments from 'dodopayments';

// Use DODO_TEST_MODE=true to force test mode even in production
const isTestMode = process.env.DODO_TEST_MODE === 'true' || process.env.NODE_ENV !== 'production';

export const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY || 'test_key', // Fallback for build
    environment: isTestMode ? 'test_mode' : 'live_mode',
});
