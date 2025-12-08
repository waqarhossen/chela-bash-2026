import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const credentials = authHeader?.replace('Bearer ', '');
    const [username, password] = credentials?.split(':') || [];

    // Check if requester is super admin
    const users = await sql`
      SELECT * FROM admin_users 
      WHERE username = ${username} AND password = ${password} AND role = 'super_admin'
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Unauthorized. Only super admins can add users.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username: newUsername, password: newPassword, role } = body;

    if (!newUsername || !newPassword || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existing = await sql`
      SELECT * FROM admin_users WHERE username = ${newUsername}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Insert new admin user
    await sql`
      INSERT INTO admin_users (username, password, role)
      VALUES (${newUsername}, ${newPassword}, ${role})
    `;

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully'
    });
  } catch (error: any) {
    console.error('Add admin error:', error);
    return NextResponse.json(
      { error: 'Failed to add admin user' },
      { status: 500 }
    );
  }
}
