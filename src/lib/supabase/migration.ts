import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from "./db";

console.log("🟠 Migrating client");
migrate(db, { migrationsFolder: "migrations" })
  .then(() => {
    console.log("🟢 Successfully Migrated");
  })
  .catch((error) => {
    console.log("🔴 Error Migrating client", error);
  })
  .finally(() => {
    console.log("exiting");
  });
