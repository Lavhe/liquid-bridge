import { sendEmail } from "../../config/sendEmail";
import { EmailType } from "../../utils/utils";

/**
 * Event that gets called when an application gets approved
 *
 * @param {any} application - The application that got approved
 */
export async function onApproveApplication(application: any) {
  await sendEmail({
    subject: `[${application.id}] Bridging Finance application APPROVED`,
    payload: application,
    replyTo: application.company.email,
    type: EmailType.APPLICATION_APPROVED_TO_US
  });

  await sendEmail({
    subject: `[${application.id}] Bridging Finance application APPROVED`,
    payload: application,
    replyTo: application.company.email,
    recipients: application.approver,
    type: EmailType.APPLICATION_APPROVED_TO_APPROVER
  });
}
