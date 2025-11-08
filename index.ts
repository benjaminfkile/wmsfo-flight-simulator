import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { initDb } from "./src/db/db";
import app from "./src/app";
import { getAppSecrets } from "./src/aws/getAppSecrets";
import { IAPISecrets } from "./src/interfaces";
import { TNodeEnviromnent } from "./src/types";
import { getDBSecrets } from "./src/aws/getDBDecrets";
import { isLocal } from "./src/utils/isLocal";
import cache from "./src/cache";
import service from "./src/service";
import cleanup from "./src/cleanup";

process.on("uncaughtException", (err) => {
  console.error(err);
  console.log("Node NOT Exiting...");
});

async function start() {
  let server: http.Server | null = null;

  try {
    const dbSecrets = await getDBSecrets();
    const appSecrets: IAPISecrets = await getAppSecrets();
    // console.log(dbSecrets);
    // console.log(appSecrets);
    app.set("secrets", appSecrets);

    const environment: TNodeEnviromnent = isLocal()
      ? "local"
      : (appSecrets.node_env as TNodeEnviromnent) || "local";
    app.set("environment", environment);

    await initDb(dbSecrets, appSecrets, environment);

    service.init();

    cache.init();

    cleanup.start()

    const port = parseInt(appSecrets.port);
    server = http.createServer({}, app);

    const shutdown = async () => {
      console.log("Shutting down gracefully...");
      cache.destroy();

      if (server) {
        server.close(() => {
          console.log("Server closed");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    server.listen(port, () => {
      console.log(`🚀  Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
