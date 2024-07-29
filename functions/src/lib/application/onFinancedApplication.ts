import { sendEmail } from "../../config/sendEmail";
import { EmailType } from "../../utils/utils";

/**
 * Event that gets called when an application gets financed
 *
 * @param {any} application - The application that got financed
 */
export async function onFinancedApplication(application: any) {
  await sendEmail({
    subject: `[${application.id}] Bridging Finance application FINANCED`,
    payload: application,
    replyTo: application.company.email,
    recipients: application.clientEmail,
    type: EmailType.APPLICATION_FINANCED_TO_CLIENT
  });
}
