import twilio from "twilio";

interface SendWhatsAppParams {
  userName: string;
  userEmail: string;
  category: string;
  subject: string;
  description: string;
}

export async function sendComplaintWhatsApp(data: SendWhatsAppParams) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  const adminWhatsApp = process.env.ADMIN_WHATSAPP_NUMBER;

  const bodyMessage = `🚨 *New Complaint Alert*\n\n` +
    `👤 *User:* ${data.userName} (${data.userEmail})\n` +
    `📌 *Category:* ${data.category}\n` +
    `📝 *Subject:* ${data.subject}\n\n` +
    `📄 *Summary:* ${data.description.substring(0, 150)}${data.description.length > 150 ? "..." : ""}\n\n` +
    `⏰ *Time:* ${new Date().toLocaleString()}`;

  // Fallback dev mode logging if Twilio credentials are missing/placeholder
  if (
    !accountSid ||
    !authToken ||
    !adminWhatsApp ||
    accountSid.includes("placeholder") ||
    authToken.includes("placeholder")
  ) {
    console.log("ℹ️ [Twilio WhatsApp Mock Mode]");
    console.log(`To: ${adminWhatsApp || "Not Configured"}`);
    console.log(`Message:\n${bodyMessage}`);
    return { success: true, mocked: true };
  }

  const client = twilio(accountSid, authToken);

  const message = await client.messages.create({
    body: bodyMessage,
    from: twilioNumber.startsWith("whatsapp:") ? twilioNumber : `whatsapp:${twilioNumber}`,
    to: adminWhatsApp.startsWith("whatsapp:") ? adminWhatsApp : `whatsapp:${adminWhatsApp}`,
  });

  return { success: true, sid: message.sid };
}
