require('dotenv').config();

console.log('Checking Environment Variables for Google OAuth:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Present' : 'Missing');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL ? 'Present' : 'Missing');
console.log('CLIENT_URL:', process.env.CLIENT_URL ? 'Present' : 'Missing');

// Also check if passport strategy would be loaded
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log('Conditions met to load Google Strategy.');
} else {
    console.log('WARNING: Google Strategy will NOT be loaded.');
}
