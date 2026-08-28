import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

export const ROLES = ["student", "parent", "teacher"] as const;
export type Role = (typeof ROLES)[number];

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
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
      // Always prompt account chooser so users can select the desired Google account
      // (show account picker both on sign-up and sign-in).
      prompt: "select_account",
    },
  },
  user: {
    additionalFields: {
      fullname: {
        type: "string",
        required: true,
        input: true,
      },
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
  // nextCookies must be the LAST plugin so that Server Actions can still
  // write auth cookies after the action returns.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
