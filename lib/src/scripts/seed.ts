import "reflect-metadata";
import * as bcrypt from "bcryptjs";
import { Logger } from "@nestjs/common";
import { connect, disconnect, model } from "mongoose";
import {
  Category,
  CategorySchema,
} from "../categories/schemas/category.schema";
import { User, UserRole, UserSchema } from "../users/schemas/user.schema";

const logger = new Logger("Initialisation");

const DEFAULT_MONGODB_URI = "mongodb://localhost:27017/task-manager";
const DEFAULT_ADMIN_NAME = "Administrateur";
const DEFAULT_ADMIN_EMAIL = "admin@taskmanager.local";
const DEFAULT_ADMIN_PASSWORD = "Admin1234!";
const DEFAULT_CATEGORIES = ["dev", "orga", "test"];

async function seed() {
  const mongoUri = process.env.MONGODB_URI ?? DEFAULT_MONGODB_URI;

  await connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  logger.log(`Connecté à ${mongoUri}`);

  const UserModel = model(User.name, UserSchema);
  const CategoryModel = model(Category.name, CategorySchema);

  const adminName = process.env.SEED_ADMIN_NAME ?? DEFAULT_ADMIN_NAME;
  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL
  ).toLowerCase();
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await UserModel.findOneAndUpdate(
    { email: adminEmail },
    {
      $setOnInsert: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  logger.log(`Administrateur prêt : ${adminUser.email}`);

  for (const categoryName of DEFAULT_CATEGORIES) {
    await CategoryModel.updateOne(
      {
        authorId: adminUser._id,
        normalizedName: categoryName.toLowerCase(),
      },
      {
        $setOnInsert: {
          authorId: adminUser._id,
          name: categoryName,
          normalizedName: categoryName.toLowerCase(),
        },
      },
      { upsert: true },
    );
  }

  logger.log(`Catégories par défaut prêtes : ${DEFAULT_CATEGORIES.join(", ")}`);
}

seed()
  .then(async () => {
    await disconnect();
    logger.log("Initialisation terminée");
  })
  .catch(async (error: unknown) => {
    logger.error(
      `Échec de l'initialisation : ${error instanceof Error ? error.message : String(error)}`,
    );
    await disconnect();
    process.exit(1);
  });
