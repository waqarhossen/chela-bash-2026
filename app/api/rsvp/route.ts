import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, relationship, attendance, adults, children, childrenDetails } = body;

    if (!fullName || !email || !relationship || !attendance) {
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
        ${fullName}, ${email}, ${phone || null}, ${0}, ${relationship},
        ${finalAdults}, ${finalChildren}, ${childrenDetails || null}, ${token}, ${status}
      )
      RETURNING id, token
    `;

    return NextResponse.json({
      success: true,
      token: result[0].token,
      message: 'RSVP submitted successfully'
    });
  } catch (error: any) {
    console.error('RSVP error:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}
