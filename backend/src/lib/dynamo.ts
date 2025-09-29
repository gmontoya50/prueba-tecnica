import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import type {
  CreateTableCommandInput,
  DynamoDBClientConfig
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * ¿Estamos en entorno local?
 * - AWS_STAGE=local o IS_OFFLINE=true
 * - O si viene DYNAMODB_ENDPOINT (por docker compose)
 */
const isLocalEnv =
  process.env.AWS_STAGE === "local" || Boolean(process.env.IS_OFFLINE);
const usesLocalDynamo = Boolean(process.env.DYNAMODB_ENDPOINT) || isLocalEnv;

const dynamoOptions: DynamoDBClientConfig = {
  region: process.env.AWS_REGION ?? "us-east-1"
};

if (usesLocalDynamo) {
  // En docker compose, el servicio suele llamarse "dynamodb"
  dynamoOptions.endpoint =
    process.env.DYNAMODB_ENDPOINT ?? "http://dynamodb:8000";
  // Credenciales dummy para local
  dynamoOptions.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "LOCAL",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "LOCAL"
  };
}

const client = new DynamoDBClient(dynamoOptions);

// DocumentClient con opciones seguras
export const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false
  },
  unmarshallOptions: {
    wrapNumbers: false
  }
});

if (!process.env.TODO_TABLE) {
  throw new Error("TODO_TABLE environment variable is required");
}
const TABLE_NAME = process.env.TODO_TABLE!;
export const TODO_TABLE = TABLE_NAME;

/** Asegura que la tabla exista en local (DescribeTable → CreateTable si no está) */
async function ensureTableExists(): Promise<void> {
  if (!usesLocalDynamo) return;

  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    return; // ya existe
  } catch (error: any) {
    if (error?.name !== "ResourceNotFoundException") {
      throw error; // otro error real
    }
  }

  const createTableInput: CreateTableCommandInput = {
    TableName: TABLE_NAME,
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    BillingMode: "PAY_PER_REQUEST"
  };

  await client.send(new CreateTableCommand(createTableInput));
}

// Lanzamos la verificación una vez y exportamos un helper para await
const ensureTablePromise: Promise<void> = ensureTableExists();

/** Llama esto al inicio de handlers si quieres garantizar la tabla en local */
export async function ensureTableReady(): Promise<void> {
  await ensureTablePromise;
}
