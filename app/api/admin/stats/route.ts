import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const [questionsCount, categoriesCount, publishedQuestionsCount, totalViews] = await Promise.all([
      prisma.question.count(),
      prisma.category.count(),
      prisma.question.count({ where: { is_published: true } }),
      prisma.question.aggregate({
        _sum: { views_count: true }
      })
    ]);

    const recentQuestions = await prisma.question.findMany({
      include: { category: true },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const popularQuestions = await prisma.question.findMany({
      where: { is_published: true },
      include: { category: true },
      orderBy: { views_count: 'desc' },
      take: 5
    });

    return NextResponse.json({
      questionsCount,
      categoriesCount,
      publishedQuestionsCount,
      totalViews: totalViews._sum.views_count || 0,
      recentQuestions,
      popularQuestions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}