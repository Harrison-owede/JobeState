import dotenv from "dotenv";
import { connectDB } from "../src/config/db.js";
import { User } from "../src/models/User.js";

dotenv.config();

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    const admins = [
      {
        fullName: "Admin One",
        email: process.env.ADMIN1_EMAIL,
        password: process.env.ADMIN1_PASSWORD, // plain text (model will hash)
        role: "admin"
      },
      {
        fullName: "Admin Two",
        email: process.env.ADMIN2_EMAIL,
        password: process.env.ADMIN2_PASSWORD, // plain text (model will hash)
        role: "admin"
      }
    ];

    for (const admin of admins) {
      const exists = await User.findOne({ email: admin.email });
      if (!exists) {
        await User.create(admin); // pre-save hook hashes password
        console.log(`✅ Admin created: ${admin.email}`);
      } else {
        console.log(`ℹ️ Admin already exists: ${admin.email}`);
      }
    }

    console.log("🎉 Admin seeding complete");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
