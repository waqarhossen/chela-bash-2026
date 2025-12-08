import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const credentials = authHeader?.replace('Bearer ', '');
    const [username, password] = credentials?.split(':') || [];

    // Verify current credentials
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

    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    // Update password
    await sql`
      UPDATE admin_users 
      SET password = ${newPassword}
      WHERE username = ${username}
    `;

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
