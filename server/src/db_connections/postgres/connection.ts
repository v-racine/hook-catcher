import { Client, ClientConfig } from "pg";
import Config from "../../config";

let client: Client | null = null;

/**
 * Connects to a PostgreSQL database using the provided or default configuration.
 * @param config - Optional overrides for the default connection configuration.
 * @returns The connected Client instance.
 */
async function connect(config: ClientConfig = {}): Promise<Client> {
  if (client) {
    console.warn("Already connected to the PostgreSQL database.");
    return client;
  }

  const appConfig = Config.getInstance();

  const defaultConfig: ClientConfig = {
    host: appConfig.dbHost,
    port: appConfig.dbPort,
    database: appConfig.dbName,
    user: appConfig.dbUser,
    password: appConfig.dbPassword,
    connectionTimeoutMillis: 5000,
    ssl: appConfig.isProduction ? { rejectUnauthorized: false } : false,
  };

  client = new Client({ ...defaultConfig, ...config });

  try {
    await client.connect();
    console.log("Successfully connected to the database.");
    return client;
  } catch (error) {
    client = null;
    console.error("Failed to connect to the database:", error);
    throw error;
  }
}

/**
 * Disconnects from the PostgreSQL database.
 */
async function disconnect(): Promise<void> {
  if (!client) {
    console.warn("No active database connection to disconnect.");
    return;
  }

  try {
    await client.end();
    console.log("Successfully disconnected from the database.");
  } catch (error) {
    console.error("Failed to disconnect from the database:", error);
    throw error;
  } finally {
    client = null;
  }
}

export default { connect, disconnect };
