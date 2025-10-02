import { CreateTableCommand, DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { CreateTableCommandInput, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import type {
  NativeAttributeValue,
  UpdateCommandInput,
  GetCommandInput,
  PutCommandInput,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';

const isLocalEnv = process.env.AWS_STAGE === 'local' || Boolean(process.env.IS_OFFLINE);
const usesLocalDynamo = Boolean(process.env.DYNAMODB_ENDPOINT) || isLocalEnv;

const dynamoOptions: DynamoDBClientConfig = {
  region: process.env.AWS_REGION ?? 'us-east-1',
};

if (usesLocalDynamo) {
  dynamoOptions.endpoint = process.env.DYNAMODB_ENDPOINT ?? 'http://dynamodb:8000';
  dynamoOptions.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'LOCAL',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'LOCAL',
  };
}

const client = new DynamoDBClient(dynamoOptions);
const docClient = DynamoDBDocumentClient.from(client);
const dynamoDelete = (input: UpdateCommandInput) => new DeleteCommand(input);
const dynamoGet = (input: GetCommandInput) => new GetCommand(input);
const dynamoPut = (input: PutCommandInput) => new PutCommand(input);
const dynamoScan = (input: ScanCommandInput) => new ScanCommand(input);
const dynamoUpdate = (input: UpdateCommandInput) => new UpdateCommand(input);

if (!process.env.TODO_TABLE) {
  throw new Error('TODO_TABLE environment variable is required');
}

const TABLE_NAME = process.env.TODO_TABLE;

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

export {
  docClient,
  TABLE_NAME,
  ensureTablePromise,
  dynamoDelete,
  dynamoGet,
  dynamoPut,
  dynamoScan,
  dynamoUpdate,
};
