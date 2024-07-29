import { sendEmail } from "../../config/sendEmail";
import { EmailType } from "../../utils/utils";

/**
 * Event that gets called when a new application gets created, Not a draft
 *
 * @param {any} application - The application that got created
 */
export async function onDeclineApplication(application: any) {
  await sendEmail({
    subject: `[${application.id}] DECLINED application for ${application.company.name}`,
    payload: application,
    replyTo: application.company.email,
    recipients: application.approver,
    type: EmailType.APPLICATION_DECLINED_TO_APPROVER
  });

  await sendEmail({
    subject: `[${application.id}] Bridging Finance application DECLINED`,
    payload: application,
    replyTo: application.company.email,
    recipients: application.clientEmail,
    type: EmailType.APPLICATION_DECLINED_TO_CLIENT
  });
}
