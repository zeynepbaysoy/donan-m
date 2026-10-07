import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Skor kaydetmek için giriş yapmalısınız.' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Oturum geçersiz. Lütfen tekrar giriş yapın.' }, { status: 401 });
    }

    const body = await request.json();
    const { score, total, percentage, details, aiReport } = body;

    const savedResult = await prisma.quizResult.create({
      data: {
        userId: payload.userId,
        score: Number(score) || 0,
        total: Number(total) || 0,
        percentage: Number(percentage) || 0,
        details: typeof details === 'object' ? JSON.stringify(details) : String(details || ''),
        aiReport: aiReport ? String(aiReport) : null,
      },
    });

    return NextResponse.json({ success: true, result: savedResult });
  } catch (error: any) {
    console.error('Skor kaydetme hatası:', error);
    return NextResponse.json({ error: error.message || 'Skor kaydedilemedi.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ results: [] });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ results: [] });
    }

    const results = await prisma.quizResult.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Skor listeleme hatası:', error);
    return NextResponse.json({ results: [] });
  }
}
