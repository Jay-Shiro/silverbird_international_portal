import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI not set");

async function findUserDoc(
  db: any,
  userId?: string | null,
  email?: string | null,
) {
  const cols = await db.listCollections().toArray();
  for (const c of cols) {
    const name = c.name;
    const coll = db.collection(name);
    // Try by common id fields
    const idFilters: any[] = [];
    if (userId) {
      idFilters.push({ _id: userId });
      idFilters.push({ id: userId });
      idFilters.push({ userId: userId });
      // try ObjectId
      try {
        idFilters.push({ _id: new ObjectId(userId) });
      } catch (e) {
        // ignore
      }
    }
    if (email) {
      idFilters.push({ email });
      idFilters.push({ emailAddress: email });
    }

    for (const f of idFilters) {
      try {
        const doc = await coll.findOne(f);
        if (doc) return { doc, collection: name };
      } catch (e) {
        // ignore invalid queries for certain collections
      }
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email } = body as { userId?: string; email?: string };

    if (!userId && !email) {
      return NextResponse.json(
        { error: "userId or email required" },
        { status: 400 },
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();

    const found = await findUserDoc(db, userId ?? null, email ?? null);
    await client.close();

    if (!found) {
      return NextResponse.json({ role: null });
    }

    const role = found.doc.role ?? found.doc?.data?.role ?? null;

    return NextResponse.json({ role });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 },
    );
  }
}
