import { connect } from "@tidbcloud/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim() ||
      !process.env.DATABASE_URL
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in both fields."
      });
    }

    const conn = connect({ url: process.env.DATABASE_URL });

    // აღარანაირი შემოწმება (SELECT) და შედარება — მხოლოდ პირდაპირი შენახვა
    await conn.execute(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email.trim().toLowerCase(), password]
    );

    return res.status(200).json({
      success: true,
      message: "Login successful."
    });
  } catch (error) {
    console.error("Database error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Database error."
    });
  }
}