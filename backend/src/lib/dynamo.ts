import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import type {
  CreateTableCommandInput,
  DynamoDBClientConfig,
} from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import type { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';

const isLocalEnv =
  process.env.AWS_STAGE === 'local' || Boolean(process.env.IS_OFFLINE);
const usesLocalDynamo = Boolean(process.env.DYNAMODB_ENDPOINT) || isLocalEnv;

const dynamoOptions: DynamoDBClientConfig = {
  region: process.env.AWS_REGION ?? 'us-east-1',
};

if (usesLocalDynamo) {
  dynamoOptions.endpoint =
    process.env.DYNAMODB_ENDPOINT ?? 'http://dynamodb:8000';
  dynamoOptions.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'LOCAL',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'LOCAL',
  };
}

const client = new DynamoDBClient(dynamoOptions);
export const docClient = DynamoDBDocumentClient.from(client);

if (!process.env.TODO_TABLE) {
  throw new Error('TODO_TABLE environment variable is required');
}

export const TABLE_NAME = process.env.TODO_TABLE;

const ensureTablePromise: Promise<void> = ensureTableExists();

function isResourceNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: string }).name === 'ResourceNotFoundException'
  );
}

async function ensureTableExists(): Promise<void> {
  if (!usesLocalDynamo) {
    return;
  }

  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    return;
  } catch (error) {
    if (!isResourceNotFound(error)) {
      throw error;
    }
  }

  const createTableInput: CreateTableCommandInput = {
    TableName: TABLE_NAME,
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  };

  await client.send(new CreateTableCommand(createTableInput));
}

type Item = Record<string, NativeAttributeValue>;

export async function putItem(item: Item): Promise<void> {
  await ensureTablePromise;
  await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
}

export async function getItemById<T extends Item>(
  id: string
): Promise<T | null> {
  await ensureTablePromise;
  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { id } })
  );
  return (Item as T) ?? null;
}

export async function scanAll<T extends Item>(): Promise<T[]> {
  await ensureTablePromise;
  const result = await docClient.send(
    new ScanCommand({ TableName: TABLE_NAME })
  );
  return (result.Items as T[]) ?? [];
}

export async function updateById(
  id: string,
  updateExpression: string,
  expressionValues: Record<string, NativeAttributeValue>,
  expressionNames?: Record<string, string>
): Promise<void> {
  await ensureTablePromise;
  const names = { '#id': 'id', ...(expressionNames ?? {}) };
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionValues,
      ExpressionAttributeNames: names,
      ConditionExpression: 'attribute_exists(#id)',
    })
  );
}

export async function deleteById(id: string): Promise<void> {
  await ensureTablePromise;
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
    })
  );
}
