import { sendEmail } from "../../config/sendEmail";
import { EmailType } from "../../utils/utils";

/**
 * Event that gets called when a new user gets created, Not a draft
 *
 * @param {any} user - The user that got created
 */
export async function onNewUser(user: any) {
  return await sendEmail({
    subject: "Welcome to Liquid bridge",
    payload: user,
    replyTo: user.company.email,
    recipients: user.id,
    type: EmailType.USER_CREATED
  });
}
