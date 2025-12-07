import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, age, relationship, adults, children, notes } = body;

    if (!fullName || !email || !age || !relationship || !adults) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const token = nanoid(16);

    const result = await sql`
      INSERT INTO guests (
        full_name, email, phone, age, relationship, 
        adults, children, notes, token
      ) VALUES (
        ${fullName}, ${email}, ${phone || null}, ${parseInt(age)}, ${relationship},
        ${parseInt(adults)}, ${parseInt(children)}, ${notes || null}, ${token}
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
