import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const password = authHeader?.replace('Bearer ', '');

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const guests = await sql`
      SELECT * FROM guests ORDER BY created_at DESC
    `;

    const stats = {
      totalRsvps: guests.length,
      confirmed: guests.filter(g => g.status === 'confirmed').length,
      declined: guests.filter(g => g.status === 'declined').length,
      totalAdults: guests.reduce((sum, g) => sum + (g.confirmed_adults ?? g.adults), 0),
      totalChildren: guests.reduce((sum, g) => sum + (g.confirmed_children ?? g.children), 0),
      avgAge: Math.round(guests.reduce((sum, g) => sum + g.age, 0) / guests.length)
    };

    return NextResponse.json({ guests, stats });
  } catch (error: any) {
    console.error('Admin guests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}
