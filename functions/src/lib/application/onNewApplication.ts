import { fillInPdf, PDFType } from "../../config/fillInPdf";
import { readDocument, DocumentName } from "../../config/readDocuments";
import { sendEmail } from "../../config/sendEmail";
import { EmailType } from "../../utils/utils";

/**
 * Event that gets called when a new application gets created, Not a draft
 *
 * @param {any} application - The application that got created
 */
export async function onNewApplication(application: any) {
  const attachments = [];

  try {
    attachments.push({
      filename: `Application - ${application.id}.pdf`,
      content: await fillInPdf(PDFType.NATURAL_PERSON_APPLICATION, application)
    });
    attachments.push({
      filename: `Quote - ${application.id}.pdf`,
      content: await fillInPdf(
        PDFType.BRIDGING_FINANCE_QUOTE,
        application.quote
      )
    });

    if (application.attachedProFormaStatement) {
      attachments.push({
        path: application.attachedProFormaStatement
      });
    }

    attachments.push({
      filename: DocumentName.FINANCE_TERMS_AND_CONDITIONS,
      content: await readDocument(DocumentName.FINANCE_TERMS_AND_CONDITIONS)
    });
  } catch (err) {
    console.log(
      "Error generating PDF",
      PDFType.NATURAL_PERSON_APPLICATION,
      err
    );
  }

  await sendEmail({
    subject: `[${application.id}] New application for ${application.company.name} by ${application.clientName}`,
    payload: application,
    replyTo: application.company.email,
    recipients: application.approver,
    type: EmailType.APPLICATION_SUBMITTED_TO_APPROVER,
    attachments
  });

  await sendEmail({
    subject: `[${application.id}] Bridging Finance application received`,
    payload: application,
    replyTo: application.company.email,
    recipients: application.clientEmail,
    type: EmailType.APPLICATION_SUBMITTED_TO_CLIENT,
    attachments
  });
}
