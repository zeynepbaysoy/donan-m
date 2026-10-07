import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { login, password } = body; // login can be email or username

    if (!login || !password) {
      return NextResponse.json(
        { error: 'Lütfen kullanıcı adı / e-posta ve şifrenizi giriniz.' },
        { status: 400 }
      );
    }

    const cleanLogin = login.trim().toLowerCase();

    // Kullanıcıyı e-posta veya kullanıcı adına göre bul
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanLogin },
          { username: login.trim() }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı. Lütfen bilgilerinizi kontrol ediniz.' },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyiniz.' },
        { status: 401 }
      );
    }

    // JWT Token oluştur
    const token = await signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      message: 'Giriş başarılı!',
    });

    // Cookie set et
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Giriş hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Giriş işlemi sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
