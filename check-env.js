// check-env.js
import 'dotenv/config';

console.log("Raw MONGODB_URI value from .env:");
console.log(process.env.MONGODB_URI);

console.log("\nDebug view (JSON stringified, to catch hidden quotes/spaces):");
console.log(JSON.stringify(process.env.MONGODB_URI));
