import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Options: S3ClientConfig = {
  region: process.env.AWS_REGION ?? 'us-east-1'
};

if (process.env.S3_LOCAL_ENDPOINT) {
  s3Options.forcePathStyle = true;
  s3Options.endpoint = process.env.S3_LOCAL_ENDPOINT;
  s3Options.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'LOCAL',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'LOCAL'
  };
}

const client = new S3Client(s3Options);

if (!process.env.TODO_BUCKET) {
  throw new Error('TODO_BUCKET environment variable is required');
}

const BUCKET = process.env.TODO_BUCKET;

export async function createUploadUrl(key: string, contentType = 'image/png'): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType
  });

  return getSignedUrl(client, command, { expiresIn: 60 * 5 });
}
