import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const result = await sql`
      SELECT * FROM guests WHERE token = ${token}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Get guest error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guest' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await request.json();
    const { status, confirmedAdults, confirmedChildren } = body;

    const result = await sql`
      UPDATE guests 
      SET 
        status = ${status},
        confirmed_adults = ${confirmedAdults},
        confirmed_children = ${confirmedChildren},
        updated_at = CURRENT_TIMESTAMP
      WHERE token = ${token}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Update guest error:', error);
    return NextResponse.json(
      { error: 'Failed to update guest' },
      { status: 500 }
    );
  }
}
