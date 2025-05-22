import * as fs from "fs";
import * as path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import {
  emailSubjectData,
  emailDataCharset,
} from "./constants/commonConstants.js";
import {} from "dotenv/config";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: process.env.REGION });

const createSendEmailCommand = (toAddress, fromAddress, verificationCode) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "./templates/verification.hbs"),
    { encoding: "utf-8" }
  );
  const template = handlebars.compile(emailTemplateSource);
  const emailBody = template({ verificationCode });

  return new SendEmailCommand({
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Text: {
          Data: emailBody,
          Charset: emailDataCharset,
        },
      },
      Subject: {
        Data: emailSubjectData,
        Charset: emailDataCharset,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [process.env.REPLY_TO_EMAIL],
  });
};

export const run = async (event, context, callback) => {
  console.log("Sending a mail to: ", event.body.toEmailAddresses);
  const sendEmailCommand = createSendEmailCommand(
    event.body.toEmailAddresses,
    process.env.SOURCE_EMAIL,
    event.body.verificationCode
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (e) {
    console.log("Error occurred while sending the email: ", e);
    return e;
  }
};
