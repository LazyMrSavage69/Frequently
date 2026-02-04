import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);
        const data = await request.json();

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Erreur lors de la modification de la catégorie:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la modification de la catégorie' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        // Vérifier si la catégorie contient des questions
        const count = await prisma.question.count({
            where: { category_id: id },
        });

        if (count > 0) {
            return NextResponse.json(
                { error: 'Impossible de supprimer une catégorie qui contient des questions' },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression de la catégorie' },
            { status: 500 }
        );
    }
}
