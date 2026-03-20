import { MongoClient, MongoClientOptions } from "mongodb";
import Config from "../../config";

// Default connection configuration
const defaultConfig: MongoClientOptions = {
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
  retryWrites: false,
};

const MONGO_COLLECTION_NAME = "request_payloads";

let client: MongoClient | null = null;

/**
 * Connects to a MongoDB database using the provided or default configuration.
 * @param options - Optional overrides for the default client options.
 * @returns The connected MongoClient instance.
 */
async function connect(options: MongoClientOptions = {}): Promise<MongoClient> {
  if (client) {
    console.warn("Already connected to the MongoDB database.");
    return client;
  }

  const { mongoUri } = Config.getInstance();

  client = new MongoClient(mongoUri, { ...defaultConfig, ...options });

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
 * Disconnects from the MongoDB database.
 */
async function disconnect(): Promise<void> {
  if (!client) {
    console.warn("No active database connection to disconnect.");
    return;
  }

  try {
    await client.close();
    console.log("Successfully disconnected from the database.");
  } catch (error) {
    console.error("Failed to disconnect from the database:", error);
    throw error;
  } finally {
    client = null;
  }
}

function getDbName(): string {
  return Config.getInstance().mongoDbName;
}

export default { connect, disconnect, MONGO_COLLECTION_NAME, getDbName };
