import { fillInPdf, PDFType } from "../../config/fillInPdf";
import { sendEmail } from "../../config/sendEmail";
import { EmailType } from "../../utils/utils";

/**
 * Event that gets called when a new quote gets created, Not a draft
 *
 * @param {any} quote - The quote that got created
 */
export async function onNewQuote(quote: any) {
  const attachments = [];

  try {
    attachments.push({
      filename: `Quote - ${quote.id}.pdf`,
      content: await fillInPdf(PDFType.BRIDGING_FINANCE_QUOTE, quote)
    });
  } catch (err) {
    console.log("Error generating PDF", PDFType.BRIDGING_FINANCE_QUOTE, err);
  }

  await sendEmail({
    subject: `[${quote.id}] New quote for ${quote.company.name} by ${quote.clientName}`,
    payload: quote,
    replyTo: quote.company.email,
    recipients: quote.clientEmail,
    type: EmailType.QUOTE_GENERATED,
    attachments
  });
}
