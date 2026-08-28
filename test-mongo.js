// test-mongo.js
// Run: node test-mongo.js
// If you use a .env file, add dotenv to your project or run with MONGODB_URI in the environment.

(async () => {
  // Try to load dotenv if present
  try {
    // eslint-disable-next-line no-undef
    require("dotenv").config();
  } catch (e) {
    // dotenv not installed, that's fine
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "MONGODB_URI not found in environment. Set MONGODB_URI or install dotenv and add a .env file.",
    );
    process.exit(2);
  }

  console.log("Using MONGODB_URI (masked):", maskUri(uri));

  const { MongoClient } = require("mongodb");

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    const admin = client.db().admin();
    const info = await admin.serverStatus().catch(() => admin.ping());
    console.log("Connected successfully. Server info (partial):");
    console.log(info);
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error("Connection failed. Error message:");
    console.error(err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    // helpful hints
    console.error("\nHints to check:");
    console.error(
      "- Ensure MONGODB_URI is the full connection string and includes username, password, and database name.",
    );
    console.error(
      "- Use the SRV format: mongodb+srv://USER:PASS@cluster0.example.net/DBNAME?retryWrites=true&w=majority",
    );
    console.error(
      "- If running locally and using Atlas, in Atlas -> Network Access add 0.0.0.0/0 temporarily to test.",
    );
    console.error(
      "- If password contains special characters, URL-encode them (e.g., @ -> %40).",
    );
    console.error("- Ensure your Node version is 18+ (node -v).");
    process.exit(1);
  }

  function maskUri(u) {
    try {
      // mask password if present
      const url = new URL(u.replace(/^mongodb\+srv:/, "https:"));
      if (url.password) {
        url.password = "***";
      }
      // convert back preserving scheme
      return u.replace(
        url.origin,
        url.protocol === "https:" ? "mongodb+srv://" + url.host : url.origin,
      );
    } catch (e) {
      // fallback
      return u.slice(0, 40) + "...";
    }
  }
})();
