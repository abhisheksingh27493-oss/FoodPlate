const pkg = require('cashfree-pg');

function findKey(obj, target, path = '') {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
        if (key === target) {
            console.log(`Found ${target} at ${path}.${key}`);
        }
        // shallow search for now to avoid loops
    }
}

console.log('Searching for PGCreateOrder...');
findKey(pkg, 'PGCreateOrder', 'pkg');
if (pkg.Cashfree) {
    findKey(pkg.Cashfree, 'PGCreateOrder', 'pkg.Cashfree');
    if (pkg.Cashfree.prototype) {
        findKey(pkg.Cashfree.prototype, 'PGCreateOrder', 'pkg.Cashfree.prototype');
    }
}
