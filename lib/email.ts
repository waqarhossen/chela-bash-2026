import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInvitationEmail(
  guestEmail: string,
  guestName: string,
  token: string,
  attendanceStatus: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const invitationUrl = `${baseUrl}/invitation/${token}`;

  let subject: string;
  let htmlContent: string;

  if (attendanceStatus === 'attending') {
    subject = 'Your Personal Invitation - Chela Bash 2026 Celebration of Life';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 2.5rem;">Chela Bash 2026!</h1>
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
        </div>
      </div>
    `;
  } else {
    subject = 'Thank You for Your Response - Chela Bash 2026';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 2.5rem;">Chela Bash 2026</h1>
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
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: guestEmail,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${guestEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error };
  }
}
