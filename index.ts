/**
 * Created by Miguel Pazo (https://miguelpazo.com)
 */
import * as pulumi from "@pulumi/pulumi";
import {local} from "@pulumi/command";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import * as mime from "mime";
import * as path from "path";
import * as config from "./config";


/**
 * Getting bucket for static content and upload content
 */
const mainBucket = aws.s3.getBucket({
    bucket: config.bucketName,
});

const webContentPath = path.join(process.cwd(), 'data');
console.log("Syncing contents from local disk at", webContentPath);

let bucketLastObject;

crawlDirectory(
    webContentPath,
    (filePath: string) => {
        const relativeFilePath = filePath.replace(webContentPath + "/", "");

        bucketLastObject = new aws.s3.BucketObject(
            relativeFilePath,
            {
                key: relativeFilePath,
                acl: "public-read",
                bucket: mainBucket.then(bucket => bucket.bucket),
                contentType: mime.getType(filePath) || undefined,
                source: new pulumi.asset.FileAsset(filePath),
            });
    }
);

function crawlDirectory(dir: string, f: (_: string) => void) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = `${dir}/${file}`;
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            crawlDirectory(filePath, f);
        }

        if (stat.isFile()) {
            f(filePath);
        }
    }
}

/**
 * Invalidating CDN
 */
if (config.cloudfrontId) {
    const cInvalidate = new local.Command("invalidate", {
        create: `aws cloudfront --region ${aws.config.region} create-invalidation --distribution-id ${config.cloudfrontId} --paths /*`,
        environment: {
            objectKey: (new Date().valueOf()).toString()
        }
    }, {
        replaceOnChanges: ["environment"]
    });

    cInvalidate.stderr.apply((stderr) => {
        console.log('stderr:');
        console.log(stderr);
    });

    cInvalidate.stdout.apply((stdout) => {
        console.log('stdout:');
        console.log(stdout);
    });
}
