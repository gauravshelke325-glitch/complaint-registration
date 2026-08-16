import nodemailer from "nodemailer";

interface SendEmailParams {
  userName: string;
  userEmail: string;
  category: string;
  subject: string;
  description: string;
  complaintId: string;
  createdAt: Date;
}

export async function sendComplaintEmail(data: SendEmailParams) {
  const host = process.env.EMAIL_SERVER_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_SERVER_PORT || "587", 10);
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL || user;

  // Fallback dev mode logging if SMTP credentials are missing/placeholder
  if (!user || !pass || user.includes("placeholder") || user === "admin@example.com") {
    console.log("ℹ️ [Email Notification Mock Mode]");
    console.log(`To: ${adminEmail}`);
    console.log(`Subject: [NEW COMPLAINT] ${data.subject}`);
    console.log(`Body: ${data.description}`);
    return { success: true, mocked: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  const formattedDate = new Date(data.createdAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 25px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
          .content { padding: 30px; }
          .badge { display: inline-block; padding: 6px 14px; background-color: #e0e7ff; color: #3730a3; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
          .field { margin-bottom: 18px; }
          .field-label { font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .field-value { font-size: 15px; color: #1f2937; line-height: 1.5; background: #f9fafb; padding: 10px 14px; border-radius: 6px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 15px 30px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Complaint Registered</h1>
          </div>
          <div class="content">
            <span class="badge">${data.category}</span>
            
            <div class="field">
              <div class="field-label">Complaint ID</div>
              <div class="field-value">${data.complaintId}</div>
            </div>

            <div class="field">
              <div class="field-label">Submitted By</div>
              <div class="field-value"><strong>${data.userName}</strong> (&lt;${data.userEmail}&gt;)</div>
            </div>

            <div class="field">
              <div class="field-label">Subject</div>
              <div class="field-value"><strong>${data.subject}</strong></div>
            </div>

            <div class="field">
              <div class="field-label">Detailed Description</div>
              <div class="field-value" style="white-space: pre-wrap;">${data.description}</div>
            </div>

            <div class="field">
              <div class="field-label">Timestamp</div>
              <div class="field-value">${formattedDate}</div>
            </div>
          </div>
          <div class="footer">
            Automated notification from Complaint Registration System.
          </div>
        </div>
      </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: `"Complaint Portal Alert" <${user}>`,
    to: adminEmail,
    replyTo: data.userEmail,
    subject: `🚨 [${data.category}] ${data.subject} - From ${data.userName}`,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}
