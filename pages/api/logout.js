export default async (req, res) => {
    res.setHeader(
      "Set-Cookie",
      `token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
    );
    res.status(200).json({ message: "Wylogowano" });
  };
  