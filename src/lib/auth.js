import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("bloody");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  user: {
        additionalFields: {
            photoUrl: { type: "string", required: false },
            role: { type: "string", defaultValue: "donor" },
            status: { type: "string", defaultValue: "active" },
            bloodGroup: { type: "string", required: false },
            district: { type: "string", required: false },
            upazila: { type: "string", required: false },
        }
    },
   session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 30 * 60 * 60 * 24,  

    },
    },
  plugins: [
    jwt(),
  ]
});