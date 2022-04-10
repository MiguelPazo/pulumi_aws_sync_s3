# Description

This project update objects in S3 bucket without deleting older files.

##### 1. Set enviroment variables for AWS:

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

##### 2. Create config file in %userprofile%/.aws

Check this guide:

```
https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/
```

##### 3. Set PULUMI_ACCESS_TOKEN for pulumi

```
export PULUMI_ACCESS_TOKEN=
```

Check this guides:

```
https://www.pulumi.com/docs/reference/cli/pulumi_login/
https://www.pulumi.com/docs/guides/continuous-delivery/troubleshooting-guide/#pulumi-access-token
```

##### 4. Create stack

For deploy this infrastructure, you need to init pulumi stack first with this command:

```
pulumi stack init dev
```

##### 5. Set config variables

```
pulumi config set aws:profile profile
pulumi config set aws:region us-east-1
pulumi config set generalTagName demo
pulumi config set bucketName bucket-demo
pulumi config set cloudfrontId XXXXXXXXXXXX
```

Description variables:

| Variable       | Description                |
|----------------|----------------------------|
| aws:profile    | profile created in step 2. |
| generalTagName | tag for all resoruces.     |
| bucketName     | S3 bucket to be updated    |
| cloudfrontId     | Set if want to invalidate CloudFront cache   |

##### 6. Run script

```
pulumi up 
```

If you want to run this without confirmation prompt, run this script:

```
pulumi up --yes 
```
