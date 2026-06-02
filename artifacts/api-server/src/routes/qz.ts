import { Router } from "express";
import { createSign } from "node:crypto";

const router = Router();

router.get("/qz-certificate", (_req, res) => {
  const cert = process.env.QZ_CERTIFICATE;
  if (!cert) {
    res.status(503).send("QZ_CERTIFICATE not configured");
    return;
  }
  res.type("text/plain").send(cert);
});

router.post("/sign-message", async (req, res) => {
  const privateKey = process.env.QZ_PRIVATE_KEY;
  if (!privateKey) {
    res.status(503).json({ error: "QZ_PRIVATE_KEY not configured" });
    return;
  }

  const message: string =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  try {
    const signer = createSign("SHA256");
    signer.update(message);
    const signature = signer.sign(privateKey, "base64");
    res.type("text/plain").send(signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
