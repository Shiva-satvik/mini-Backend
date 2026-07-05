require("dotenv").config();

const { sendImageGeneratedEmail } = require("./src/services/emailService");

(async () => {
  try {
    const testImage =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y5x4jQAAAAASUVORK5CYII=";

    await sendImageGeneratedEmail(
     " shivasatvik19@gmail.com",
      "Testing email functionality",
      testImage
    );

    console.log("✅ Email sent successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();