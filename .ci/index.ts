import { createBucketWithUser } from "../../lib/createBucketWithUser";
import { createFargateTask } from "../../lib/createFargateTask";
import { database } from "../../lib/database";
import { env, envTLD } from "../../lib/domain";

export = async function main() {
  const db = database("builder");

  const connectionString = db.connectionString;

  const revision = "ff55a6c3c1f4ae644753c4fe71dcc0a17e64264c";
  const image = `decentraland/builder-server:${revision}`;

  const userAndBucket = createBucketWithUser(`${env}-builder`);

  const builderApi = await createFargateTask(
    `${env}-builder-api`,
    image,
    5000,
    [
      { name: "hostname", value: `${env}-builder-server` },
      { name: "name", value: `${env}-builder-server` },
      { name: "NODE_ENV", value: "production" },
      { name: "API_VERSION", value: "v1" },
      { name: "SERVER_PORT", value: "5000" },
      { name: "CORS_ORIGIN", value: "*" },
      { name: "CORS_METHOD", value: "*" },
      { name: "AWS_ACCESS_KEY", value: userAndBucket.accessKeyId },
      { name: "CONNECTION_STRING", value: db.connectionString },
      { name: "AUTH0_DOMAIN", value: "dcl-test.auth0.com" },
      { name: "DEFAULT_USER_ID", value: "email|5deab040f0099a1255a4d1bc" },
      { name: "DEFAULT_ASSET_PACK_CACHE", value: "60000" },
      { name: "BUILDER_URL", value: "https://builder.decentraland." + envTLD },
      { name: "IMAGE", value: image },
      { name: "AWS_BUCKET_NAME", value: userAndBucket.bucket },
      { name: "AWS_ACCESS_SECRET", value: userAndBucket.secretAccessKey },
      {
        name: "DEFAULT_ETH_ADDRESS",
        value: "0xdc1691F63a1c450543Dc8ba6909d8a3EfFAC51B4",
      },
      {
        name: "BUILDER_SERVER_URL",
        value: "https://builder-api.decentraland." + envTLD,
      },
      {
        name: "BUILDER_SHARE_URL",
        value: "https://share.decentraland." + envTLD,
      },
    ],
    "builder-api.decentraland." + envTLD,
    {
      healthCheckPath: "/v1/assetPacks",
    }
  );

  const publicUrl = builderApi.endpoint;

  return {
    publicUrl,
    connectionString,
    userAndBucket,
  };
};