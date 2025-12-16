import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { nanoid } from 'nanoid';
import { sendInvitationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, relationship, attendance, adults, children, childrenDetails } = body;

    if (!fullName || !email || !attendance) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const token = nanoid(16);
    const status = attendance === 'attending' ? 'reserved' : 'declined';
    const finalAdults = attendance === 'attending' ? parseInt(adults) : 0;
    const finalChildren = attendance === 'attending' ? parseInt(children) : 0;

    const result = await sql`
      INSERT INTO guests (
        full_name, email, phone, age, relationship, 
        adults, children, notes, token, status
      ) VALUES (
        ${fullName}, ${email}, ${phone || null}, ${0}, ${relationship || 'Not specified'},
        ${finalAdults}, ${finalChildren}, ${childrenDetails || null}, ${token}, ${status}
      )
      RETURNING id, token
    `;

    // Send email invitation
    console.log('Attempting to send email to:', email);
    let emailSent = false;
    try {
      const emailResult = await sendInvitationEmail(email, fullName, token, attendance);
      console.log('Email result:', emailResult);
      
      if (emailResult.success) {
        emailSent = true;
        console.log('Email sent successfully');
      } else {
        console.error('Email sending failed but RSVP saved:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Email sending failed with exception:', emailError);
      // Don't fail the RSVP if email fails - user can still get invitation link manually
    }

    return NextResponse.json({
      success: true,
      token: result[0].token,
      message: emailSent ? 'RSVP submitted successfully! Check your email for invitation details.' : 'RSVP submitted successfully! Email delivery may be delayed.',
      emailSent
    });
  } catch (error: any) {
    console.error('RSVP error:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}
