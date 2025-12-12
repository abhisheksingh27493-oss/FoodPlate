const { Cashfree } = require('cashfree-pg');

console.log('Static methods:', Object.getOwnPropertyNames(Cashfree));

try {
    Cashfree.XClientId = 'TEST_ID';
    Cashfree.XClientSecret = 'TEST_SECRET';
    Cashfree.XEnvironment = 'SANDBOX';
    
    console.log('Trying static call...');
    if (typeof Cashfree.PGCreateOrder === 'function') {
        console.log('Cashfree.PGCreateOrder is a function');
    } else {
        console.log('Cashfree.PGCreateOrder is NOT a function');
    }

} catch(e) {
    console.log('Error:', e.message);
}
