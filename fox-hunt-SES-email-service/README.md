# AWS-SES-Serverless

### Technical Architecture:

![Architecture diagram](https://raw.githubusercontent.com/lakshmantgld/aws-ses-serverless-example/master/readmeFiles/architecture.png)

### Notes on AWS SES

- If you are in **SES sandbox**, you have to **verify both sender and receiver email addresses**. But, If you have migrated out of SES sandbox, sender mail alone must be verified.
- Best practice is to use IAM roles compared to hardcoding AWS credentials in application. For the IAM roles related to **SES**, take a look at the [sesIAMRole](https://github.com/lakshmantgld/aws-ses-serverless-example/tree/sesIAMRole) branch.

### TEST locally via serverless offline plugin:

Test the app by running `serverless offline start`

### Instructions to deploy:

- Deploy the app by running `serverless deploy --stage production`.

- Once the deployment completes, you can send mail by invoking the URL with the following parameters.

```js
{
	"verificationCode": "your_code",
	"toEmailAddresses": "****@gmail.com",
}
```

Here is the picture of similar invocation made in postman:
![Post parameters](https://raw.githubusercontent.com/lakshmantgld/aws-ses-serverless-example/master/readmeFiles/postmanScreenshot.png)
