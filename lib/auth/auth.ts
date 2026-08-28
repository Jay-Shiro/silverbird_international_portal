import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

export const ROLES = ["student", "parent", "teacher"] as const;
export type Role = (typeof ROLES)[number];

const uri = process.env.MONGODB_URI!;
if (!uri) {
  throw new Error("MONGODB_URI must be set in environment");
}

declare global {
  var _mongoClient: MongoClient | undefined;
}

const options = {
  serverSelectionTimeoutMS: 5000, // Drop this to fail faster if Atlas blocks the IP
  connectTimeoutMS: 5000,
  autoSelectFamily: false, // Fixes TLS alert 80 / Node IPv6 dual-stack handshake drops
};

// Singleton Client Instance
if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri, options);
  // Trigger connection lazily in background, don't await at module level
  global._mongoClient.connect().catch((err) => {
    console.error("Failed to eagerly connect to MongoDB:", err);
  });
}

const client = global._mongoClient;
const db = client.db();

// Export the raw client and db for server-side routes that need to update user records
export const mongoClient = client;
export const mongoDb = db;

export const auth = betterAuth({
  // Pass the db and client directly. The adapter will internally handle waiting for the
  // active connection pool ready state without blocking Next.js compilation phases.
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
