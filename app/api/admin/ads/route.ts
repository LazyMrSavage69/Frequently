import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ads = await prisma.adsSettings.findMany({
      orderBy: {
        position: 'asc'
      }
    });

    return NextResponse.json(ads);
  } catch (error) {
    console.error('Erreur lors de la récupération des publicités:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des publicités' },
      { status: 500 }
    );
  }
}