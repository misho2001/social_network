
import { connect } from "@tidbcloud/serverless";
import bcrypt from "bcryptjs";

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
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      password.length < 12 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email and a password of 12–72 bytes."
      });
    }

    const conn = connect({ url: process.env.DATABASE_URL });
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await conn.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );

    if (existing.rows?.length) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await conn.execute(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful."
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Registration failed."
    });
  }
}
