
import { connect } from "@tidbcloud/serverless";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { email, password } = req.body ?? {};
    const secret = process.env.AUTH_SECRET;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !secret ||
      !process.env.DATABASE_URL
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request."
      });
    }

    const conn = connect({ url: process.env.DATABASE_URL });

    const result = await conn.execute(
      "SELECT id, email, password FROM users WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );

    const user = result.rows?.[0];

    if (
      !user ||
      typeof user.password !== "string" ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const key = new TextEncoder().encode(secret);

    const token = await new SignJWT({
      email: user.email
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(String(user.id))
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(key);

    res.setHeader(
      "Set-Cookie",
      `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=7200`
    );

    return res.status(200).json({
      success: true,
      message: "Login successful."
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed."
    });
  }
}
