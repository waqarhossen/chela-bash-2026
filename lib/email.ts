import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendInvitationEmail(
  guestEmail: string,
  guestName: string,
  token: string,
  attendanceStatus: string
) {
  try {
    console.log('Sending email to:', guestEmail);
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.EMAIL_FROM
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const invitationUrl = `${baseUrl}/invitation/${token}`;

  let subject: string;
  let htmlContent: string;

  if (attendanceStatus === 'attending') {
    subject = 'Your Personal Invitation - Birthday Celebration - Celebration of Life';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 2.5rem;">Birthday Celebration!</h1>
          <p style="margin: 10px 0 0 0; font-size: 1.2rem;">Celebration of Life for Marcela Garcia</p>
        </div>
        
        <div style="background: #fffbeb; padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
          <h2 style="color: #d97706; margin-top: 0;">Dear ${guestName},</h2>
          <p style="line-height: 1.6; color: #374151;">
            Thank you for confirming your attendance at Marcela Garcia's Celebration of Life. 
            We're thrilled you'll be joining us for this meaningful gathering.
          </p>
        </div>

        <div style="background: white; padding: 25px; border-radius: 12px; border: 2px solid #fbbf24; margin-bottom: 25px;">
          <h3 style="color: #d97706; margin-top: 0;">Event Details</h3>
          <p style="margin: 8px 0;"><strong>Date:</strong> Saturday, January 17th, 2026</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> 11:00 AM - 3:00 PM</p>
          <p style="margin: 8px 0;"><strong>Location:</strong> Epic Events Center</p>
          <p style="margin: 8px 0;">12469 Foothill Boulevard, Rancho Cucamonga, CA 91739</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationUrl}" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
            View Your Personal Invitation
          </a>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border-left: 4px solid #059669;">
          <p style="margin: 0; color: #374151; font-style: italic; line-height: 1.6;">
            This celebration honors not just Marcela, but all the powerful women who built our family's foundation. 
            Your presence helps connect our legacy to the future.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280;">
          <p>With love and gratitude,<br><strong>The García Family</strong></p>
          <p style="font-size: 12px; margin-top: 20px;">
            Made with ❤️ by <a href="https://waqarh.com" style="color: #059669; text-decoration: none;">Waqar H.</a>
            <a href="https://wa.me/8801400006016" style="color: #25D366; text-decoration: none; margin-left: 10px;">💬</a>
          </p>
        </div>
      </div>
    `;
  } else {
    subject = 'Thank You for Your Response - Birthday Celebration';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 2.5rem;">Birthday Celebration</h1>
          <p style="margin: 10px 0 0 0; font-size: 1.2rem;">Celebration of Life for Marcela Garcia</p>
        </div>
        
        <div style="background: #fffbeb; padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
          <h2 style="color: #d97706; margin-top: 0;">Dear ${guestName},</h2>
          <p style="line-height: 1.6; color: #374151;">
            Thank you for letting us know you won't be able to join us for Marcela Garcia's Celebration of Life. 
            Your response helps us with our planning, and we truly appreciate you taking the time to let us know.
          </p>
        </div>

        <div style="background: white; padding: 25px; border-radius: 12px; border: 2px solid #fbbf24; margin-bottom: 25px;">
          <h3 style="color: #d97706; margin-top: 0;">Please Save the Date</h3>
          <p style="margin: 8px 0;"><strong>Date:</strong> Saturday, January 17th, 2026</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> 11:00 AM - 3:00 PM</p>
          <p style="margin: 8px 0;">Even though you can't attend, please keep Marcela in your thoughts on this special day.</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280;">
          <p>With warm regards,<br><strong>The García Family</strong></p>
          <p style="font-size: 12px; margin-top: 20px;">
            Made with ❤️ by <a href="https://waqarh.com" style="color: #059669; text-decoration: none;">Waqar H.</a>
            <a href="https://wa.me/8801400006016" style="color: #25D366; text-decoration: none; margin-left: 10px;">💬</a>
          </p>
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Chela Bash 2026'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: guestEmail,
    subject: subject,
    html: htmlContent,
  };

  console.log('Mail options:', {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject
  });

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${guestEmail}`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error };
  }
  } catch (outerError) {
    console.error('Email function error:', outerError);
    return { success: false, error: outerError };
  }
}
