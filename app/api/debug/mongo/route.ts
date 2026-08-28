/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { mongoDb } from "@/lib/auth/auth";

const uri = process.env.MONGODB_URI;

async function tryConnect(uri: string) {
  try {
    const admin = mongoDb.admin();
    const ping = await admin.ping();
    return { ok: true, ping };
  } catch (err: any) {
    return { ok: false, error: String(err?.message ?? err), stack: err?.stack };
  }
}

export async function GET(request: Request) {
  if (!uri) {
    return NextResponse.json(
      { ok: false, error: "MONGODB_URI not configured" },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const email = url.searchParams.get("email");

  // Check if caller is asking whether a user exists by email
  if (action === "exists") {
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Missing email" },
        { status: 400 },
      );
    }
    try {
      const users = mongoDb.collection("users");
      const docs = await users
        .find({ email: email.toLowerCase() })
        .project({ _id: 1, createdAt: 1 })
        .toArray();
      const usersOut = docs.map((d: any) => ({
        id: String(d._id),
        createdAt: d.createdAt,
      }));
      return NextResponse.json({
        ok: true,
        count: usersOut.length,
        users: usersOut,
      });
    } catch (err: any) {
      console.error("/api/debug/mongo exists error:", err?.message ?? err);
      return NextResponse.json(
        { ok: false, error: String(err?.message ?? err) },
        { status: 500 },
      );
    }
  }

  const result = await tryConnect(uri);
  if (result.ok) {
    return NextResponse.json({ ok: true, details: result.ping });
  }
  return NextResponse.json(
    { ok: false, error: result.error, stack: result.stack },
    { status: 500 },
  );
}

// POST handler used by the Google social sign-up callback flow to set role and link providers
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.action) {
      return NextResponse.json(
        { ok: false, error: "Unsupported action" },
        { status: 400 },
      );
    }

    // Helper: resolve server session by querying the internal auth session endpoint
    const cookie = request.headers.get("cookie") || "";
    const origin = new URL(request.url).origin;
    let sessionUserEmail: string | null = null;
    try {
      const sessResp = await fetch(`${origin}/api/auth/session`, {
        headers: { cookie },
      });
      if (sessResp.ok) {
        const sessJson = await sessResp.json();
        // better-auth session shape may place user under data.user or user
        sessionUserEmail =
          sessJson?.data?.user?.email || sessJson?.user?.email || null;
      }
    } catch (e) {
      console.error("Failed to fetch internal auth session:", e);
    }

    // require an authenticated session for actions that modify current user
    if (!sessionUserEmail) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const users = mongoDb.collection("users");

    if (body.action === "set-role") {
      const { role, phone } = body;
      if (!role) {
        return NextResponse.json(
          { ok: false, error: "Missing role" },
          { status: 400 },
        );
      }
      const allowed = ["student", "parent", "teacher"];
      if (!allowed.includes(role)) {
        return NextResponse.json(
          { ok: false, error: "Invalid role" },
          { status: 400 },
        );
      }

      const update: any = { role, updatedAt: new Date() };
      if (phone) update.phone = phone;

      const result = await users.updateOne(
        { email: sessionUserEmail.toLowerCase() },
        { $set: update },
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { ok: false, error: "User not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ ok: true });
    }

    if (body.action === "link-provider") {
      const { provider, providerData } = body;
      if (!provider) {
        return NextResponse.json(
          { ok: false, error: "Missing provider" },
          { status: 400 },
        );
      }

      // Upsert provider info under providers.<provider>
      const update = {
        updatedAt: new Date(),
        [`providers.${provider}`]: providerData || {},
      } as any;

      const result = await users.updateOne(
        { email: sessionUserEmail.toLowerCase() },
        { $set: update },
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { ok: false, error: "User not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: "Unsupported action" },
      { status: 400 },
    );
  } catch (err: any) {
    console.error("debug/mongo POST error:", err?.message ?? err);
    return NextResponse.json(
      { ok: false, error: String(err?.message ?? err) },
      { status: 500 },
    );
  }
}
