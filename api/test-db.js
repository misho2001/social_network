
import { connect } from "@tidbcloud/serverless";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new Error("DATABASE_URL is not configured");
    }

    const conn = connect({ url });

    const result = await conn.execute(
      "SELECT DATABASE() AS database_name"
    );

    return res.status(200).json({
      success: true,
      message: "TiDB connection successful",
      database: result.rows?.[0]?.database_name ?? "Connected"
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Database connection failed. Check server logs."
    });
  }
}
