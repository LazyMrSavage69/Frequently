import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    const token = await generateJWT({ adminId: admin.id.toString() });
    const cookieStore = await cookies();
    
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 heures
    });

    return NextResponse.json(
      {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}