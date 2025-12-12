const pkg = require('cashfree-pg');
console.log('Package Exports keys:', Object.keys(pkg));
if (pkg.Cashfree) {
    console.log('Cashfree static keys:', Object.keys(pkg.Cashfree));
    console.log('Cashfree prototype keys:', Object.getOwnPropertyNames(pkg.Cashfree.prototype));
}
