import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const credentials = authHeader?.replace('Bearer ', '');
    const [username, password] = credentials?.split(':') || [];

    // Check database for user
    const users = await sql`
      SELECT * FROM admin_users 
      WHERE username = ${username} AND password = ${password}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const guestId = parseInt(params.id);

    if (isNaN(guestId)) {
      return NextResponse.json(
        { error: 'Invalid guest ID' },
        { status: 400 }
      );
    }

    // Delete the guest
    const result = await sql`
      DELETE FROM guests WHERE id = ${guestId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Guest deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete guest error:', error);
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    );
  }
}
