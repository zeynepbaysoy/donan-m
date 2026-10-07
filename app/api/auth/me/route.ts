import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    // Kullanıcının güncel durumunu veritabanından doğrula
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      const response = NextResponse.json({ user: null });
      response.cookies.delete('auth_token');
      return response;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Kullanıcı doğrulama hatası:', error);
    return NextResponse.json({ user: null });
  }
}
