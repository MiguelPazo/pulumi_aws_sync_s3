/**
 * Created by Miguel Pazo (https://miguelpazo.com)
 */

import * as pulumi from "@pulumi/pulumi";

const configPulumi = new pulumi.Config();

const env = pulumi.getStack();
export const generalTagName = configPulumi.get("generalTagName");
export const bucketName = configPulumi.get("bucketName");
export const cloudfrontId = configPulumi.get("cloudfrontId");
export const project = configPulumi.get("project");
