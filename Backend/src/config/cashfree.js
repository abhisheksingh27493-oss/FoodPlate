const { Cashfree } = require('cashfree-pg');

// Configure Cashfree credentials
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_APP_SECRET;

// Set environment using string values (SDK v3+ uses direct strings)
Cashfree.XEnvironment = process.env.NODE_ENV === 'production' 
    ? 'PRODUCTION' 
    : 'SANDBOX';

module.exports = { Cashfree };