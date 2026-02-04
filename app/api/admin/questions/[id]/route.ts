import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const data = await request.json();

        const question = await prisma.question.update({
            where: { id },
            data: {
                title: data.title,
                slug: data.slug,
                answer: data.answer,
                category_id: data.category_id ? parseInt(data.category_id) : undefined,
                is_published: data.is_published,
                drive_link: data.drive_link,
            },
        });

        return NextResponse.json(question);
    } catch (error) {
        console.error('Erreur lors de la modification de la question:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la modification de la question' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        await prisma.question.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression de la question:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression de la question' },
            { status: 500 }
        );
    }
}
