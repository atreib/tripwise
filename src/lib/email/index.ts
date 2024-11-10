import "server-only";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(props: {
  to: string;
  subject: string;
  content: React.ReactElement;
}) {
  const { data, error } = await resend.emails.send({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: [props.to],
    subject: props.subject,
    react: props.content,
  });
  if (error) {
    console.error(
      `Could not send email ${props.subject}"" to ${props.to} because: `,
      error
    );
    throw new Error(error.message);
  }
  return data;
}

export { sendEmail };
