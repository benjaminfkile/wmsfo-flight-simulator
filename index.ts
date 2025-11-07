import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./src/app";

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

async function start() {
  try {

    const server = http.createServer({}, app);

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3004

    process.on("SIGINT", () => {
      server?.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGTERM", () => {
      server?.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    server.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
