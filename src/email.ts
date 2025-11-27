import { Resend } from "resend";
import { getRandomTemplate, renderTemplate } from "./templates.ts";

export async function sendRejectionEmail(
  resendApiKey: string,
  email: string,
  companyName: string,
  jobTitle: string
): Promise<void> {
  const resend = new Resend(resendApiKey);
  const template = getRandomTemplate();
  const { subject, body } = renderTemplate(template, companyName, jobTitle);

  await resend.emails.send({
    from: `${companyName} <onboarding@resend.dev>`,
    to: email,
    subject,
    text: `${body}

---
This is an email from skill issue. No real company rejected you. Yet.`,
  });
}
