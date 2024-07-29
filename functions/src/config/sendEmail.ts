import { createTransport } from "nodemailer";
import { readFile } from "fs/promises";
import * as path from "path";
import { EmailType } from "../utils/utils";
import { render } from "mustache";
import { Attachment } from "nodemailer/lib/mailer";

const cachedFiles: Record<string, string> = {};
const {
  EMAIL_FROM,
  EMAIL_ADDRESS,
  EMAIL_BCC,
  EMAIL_TO,
  EMAIL_CLIENT_ID,
  EMAIL_PRIVATE_KEY = ""
} = process.env as { [key: string]: string };

const transporter = createTransport({
  service: "Gmail",
  secure: true,
  port: 465,
  auth: {
    type: "OAuth2",
    user: EMAIL_ADDRESS,
    serviceClient: EMAIL_CLIENT_ID,
    privateKey: EMAIL_PRIVATE_KEY.replace(/\\n/g, "\n")
  }
});

/**
 * Sends an email using an emailTemplate
 */
export async function sendEmail({
  subject,
  recipients,
  type,
  payload,
  replyTo,
  attachments
}: SendEmailProps) {
  const view = {
    ...payload,
    BASE_URL: "https://lbfacility.liquidbridgefund.co.za"
  };
  let title = "";

  switch (type) {
    case EmailType.USER_CREATED:
      title = "USER ACCOUNT";
      break;
    default:
      title = "APPLICATION STATUS";
      break;
  }
  const rawHTML = await combineHTMLLayout(type);

  const emailHTML = render(rawHTML, {
    title,
    subTitle: subject,
    ...view
  });

  return await transporter.sendMail({
    from: EMAIL_FROM,
    to: recipients || EMAIL_TO,
    replyTo,
    subject,
    html: emailHTML,
    bcc: EMAIL_BCC,
    attachments
  });
}
interface SendEmailProps {
  recipients?: string;
  replyTo?: string;
  subject: string;
  payload: Record<string, string>;
  type: EmailType;
  attachments?: Attachment[];
}
/**
 * Renders the HTML Layout given an email type
 *
 * @param {EmailType} type - The email type to render for
 */
async function combineHTMLLayout(type: EmailType) {
  const headerPath = path.join(
    __dirname,
    "emailTemplates",
    "layout",
    "_HEADER.html"
  );
  const headerHTML =
    cachedFiles[headerPath] || (await readFile(headerPath)).toString();
  cachedFiles[headerPath] = headerHTML;

  const footerPath = path.join(
    __dirname,
    "emailTemplates",
    "layout",
    "_FOOTER.html"
  );
  const footerHTML =
    cachedFiles[footerPath] || (await readFile(footerPath)).toString();
  cachedFiles[footerPath] = footerHTML;

  const filePath = path.join(
    __dirname,
    "emailTemplates",
    `${type.toString()}.html`
  );

  const html = cachedFiles[filePath] || (await readFile(filePath)).toString();
  cachedFiles[filePath] = html;

  return headerHTML.replace('___BODY___', html).replace('___FOOTER___',footerHTML);
}
