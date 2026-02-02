import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

// Configuration simple pour MySQL via DATABASE_URL
const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

function createSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'fr'
  });
}

async function main() {
  console.log('💫 Début de l\'initialisation de la base de données...');

  try {
    // Vérifier la connexion
    await prisma.$connect();
    console.log('✅ Connexion à MySQL établie');

    // Nettoyer les données existantes
    await prisma.question.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.admin.deleteMany({});
    console.log('🧹 Données existantes supprimées');

    // Créer l'administrateur par défaut
    const hashedPassword = await hashPassword('admin123');
    
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@admin-info.fr',
        password: hashedPassword,
      },
    });

    console.log('✓ Administrateur créé:', admin.email);

    // Créer les catégories
    const categories = [
      { name: 'État civil', slug: 'etat-civil' },
      { name: 'Carte d\'identité', slug: 'carte-identite' },
      { name: 'Passeport', slug: 'passeport' },
      { name: 'Permis de conduire', slug: 'permis-conduire' },
      { name: 'Logement', slug: 'logement' },
      { name: 'Travail', slug: 'travail' },
      { name: 'Impôts', slug: 'impots' },
      { name: 'Santé', slug: 'sante' },
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: categoryData,
      });
      createdCategories.push(category);
    }

    console.log('✓ Catégories créées:', createdCategories.length);

    // Créer des questions d'exemple
    const questions = [
      {
        title: 'Comment obtenir une carte d\'identité nationale ?',
        answer: `Pour obtenir une carte d'identité nationale, vous devez vous présenter en mairie avec :\n\n1. **Documents requis :**\n   - Acte de naissance (original ou copie intégrale)\n   - Photo d'identité récente aux normes\n   - Justificatif de domicile de moins de 3 mois\n   - Ancienne carte d'identité (si renouvellement)\n\n2. **Procédure :**\n   - Prendre rendez-vous en mairie\n   - Déposer le dossier complet\n   - Attendre la fabrication (2-3 semaines)\n   - Retirer la carte en personne\n\n3. **Coût :**\n   - Gratuit pour une première carte ou renouvellement\n   - 25€ en cas de perte ou vol\n\n**Important :** La démarche est obligatoire et la carte est valable 15 ans pour les majeurs, 10 ans pour les mineurs.`,
        category: 'carte-identite',
        is_published: true,
        views_count: 245
      },
      {
        title: 'Comment obtenir un acte de naissance ?',
        answer: `Pour obtenir un acte de naissance, plusieurs options s'offrent à vous :\n\n**En ligne (le plus rapide) :**\n- Sur le site service-public.fr\n- Gratuit et sécurisé\n- Réception par courrier en 2-3 jours\n\n**En mairie :**\n- Mairie du lieu de naissance\n- Sur place, par courrier ou par procuration\n- Pièce d'identité obligatoire\n\n**Types d'actes :**\n- **Copie intégrale :** contient toutes les mentions\n- **Extrait avec filiation :** indique les parents\n- **Extrait sans filiation :** informations de base uniquement\n\n**Qui peut demander :**\n- La personne concernée (majeure)\n- Les parents (pour enfant mineur)\n- Le conjoint, ascendants, descendants\n- Représentant légal\n\n**Gratuit et sans limitation** pour les personnes autorisées.`,
        category: 'etat-civil',
        is_published: true,
        views_count: 203
      },
      {
        title: 'Comment déclarer un changement d\'adresse ?',
        answer: `Pour déclarer un changement d'adresse, vous devez :\n\n**Organismes à prévenir obligatoirement :**\n- Impôts (via votre espace particulier sur impots.gouv.fr)\n- CAF (Caisse d'Allocations Familiales)\n- CPAM (Assurance Maladie)\n- Pôle Emploi (si concerné)\n- Préfecture (pour la carte grise)\n\n**Documents à mettre à jour :**\n- Carte d'identité et passeport (si déménagement dans un autre département)\n- Permis de conduire\n- Carte grise du véhicule\n- Carte électorale\n\n**Délais :**\n- 1 mois pour la carte grise\n- 3 mois pour le permis de conduire\n- Dès que possible pour les autres organismes\n\n**Astuce :** Utilisez le service en ligne service-public.fr pour certaines démarches.`,
        category: 'logement',
        is_published: true,
        views_count: 156
      }
    ];

    let questionCount = 0;
    for (const questionData of questions) {
      const category = createdCategories.find(cat => cat.slug === questionData.category);
      if (category) {
        await prisma.question.create({
          data: {
            title: questionData.title,
            slug: createSlug(questionData.title),
            answer: questionData.answer,
            category_id: category.id,
            is_published: questionData.is_published,
            views_count: questionData.views_count,
          },
        });
        questionCount++;
      }
    }

    console.log('✓ Questions d\'exemple créées:', questionCount);

    // Créer des paramètres de publicité par défaut
    const adsSettings = [
      { provider: 'adsense', position: 'header', is_active: false },
      { provider: 'adsense', position: 'sidebar', is_active: false },
      { provider: 'adsense', position: 'footer', is_active: false },
      { provider: 'adsense', position: 'between_content', is_active: false },
    ];

    for (const adSetting of adsSettings) {
      await prisma.adsSettings.create({
        data: adSetting
      });
    }

    console.log('✓ Paramètres publicitaires créés');
    console.log('\n🎉 Initialisation terminée !\n');
    console.log('🔐 Connexion admin :');
    console.log('Email: admin@admin-info.fr');
    console.log('Mot de passe: admin123');
    console.log('\n🌍 Accès admin: http://localhost:3000/management/login');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });