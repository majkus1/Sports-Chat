import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDb from "../../lib/db";

export default async (req, res) => {
  try {
    await connectToDb();
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).send("Nieprawidłowy username lub hasło");
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`
    );

    res.status(200).json({ token, userId: user.id, username: user.username });
  } catch (error) {
    console.error("Błąd podczas logowania:", error);
    res.status(500).send("Wewnętrzny błąd serwera");
  }
};
