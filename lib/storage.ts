import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 credentials are not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY."
    );
  }

  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return client;
}

function bucketName(): string {
  return process.env.R2_BUCKET_NAME ?? "peesmile";
}

export async function uploadFile(
  key: string,
  body: Uint8Array,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName(),
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await getClient().send(command);
  return getPublicUrl(key);
}

export function getPublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base) {
    throw new Error(
      "R2_PUBLIC_BASE_URL is not set. Configure a public domain or r2.dev URL for the bucket."
    );
  }
  return `${base.replace(/\/$/, "")}/${key}`;
}

export function getSignedDownloadUrl(
  key: string,
  expiresInSec = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName(),
    Key: key,
  });
  return s3GetSignedUrl(getClient(), command, { expiresIn: expiresInSec });
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName(),
    Key: key,
  });
  await getClient().send(command);
}