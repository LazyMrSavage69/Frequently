import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

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
  console.log('Début de l\'initialisation de la base de données...');

  const hashedPassword = await hashPassword('admin123');
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@admin-info.fr' },
    update: {},
    create: {
      email: 'admin@admin-info.fr',
      password: hashedPassword,
    },
  });

  console.log('✓ Administrateur créé:', admin.email);

  const categories = [
    { name: 'État civil', slug: 'etat-civil' },
    { name: 'Carte d\'identité', slug: 'carte-identite' },
    { name: 'Passeport', slug: 'passeport' },
    { name: 'Permis de conduire', slug: 'permis-conduire' },
    { name: 'Logement', slug: 'logement' },
    { name: 'Travail', slug: 'travail' },
    { name: 'Impôts', slug: 'impots' },
    { name: 'Santé', slug: 'sante' },
    { name: 'Famille', slug: 'famille' },
    { name: 'Transport', slug: 'transport' },
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    createdCategories.push(category);
  }

  console.log('✓ Catégories créées:', createdCategories.length);

  const questions = [
    {
      title: 'Comment obtenir une carte d\'identité nationale ?',
      answer: `Pour obtenir une carte d'identité nationale, vous devez vous présenter en mairie avec :

1. **Documents requis :**
   - Acte de naissance (original ou copie intégrale)
   - Photo d'identité récente aux normes
   - Justificatif de domicile de moins de 3 mois
   - Ancienne carte d'identité (si renouvellement)

2. **Procédure :**
   - Prendre rendez-vous en mairie
   - Déposer le dossier complet
   - Attendre la fabrication (2-3 semaines)
   - Retirer la carte en personne

3. **Coût :**
   - Gratuit pour une première carte ou renouvellement
   - 25€ en cas de perte ou vol

**Important :** La démarche est obligatoire et la carte est valable 15 ans pour les majeurs, 10 ans pour les mineurs.`,
      category: 'carte-identite',
      is_published: true,
      views_count: 245
    },
    {
      title: 'Quels documents fournir pour un passeport ?',
      answer: `Pour faire une demande de passeport, vous devez fournir :

**Documents obligatoires :**
- Formulaire de demande (CERFA n°14881*02)
- Photo d'identité aux normes (fond clair, 35x45mm)
- Justificatif de nationalité française
- Justificatif de domicile de moins de 3 mois
- Timbre fiscal de 86€ (adulte) ou 42€ (mineur)

**Pour un renouvellement :**
- Ancien passeport
- Les documents ci-dessus

**Spécificités :**
- Délai : 2 à 4 semaines selon la période
- Validité : 10 ans (adulte), 5 ans (mineur)
- Retrait obligatoire en personne

**Attention :** Certaines mairies nécessitent un rendez-vous préalable.`,
      category: 'passeport',
      is_published: true,
      views_count: 189
    },
    {
      title: 'Comment déclarer un changement d\'adresse ?',
      answer: `Pour déclarer un changement d'adresse, vous devez :

**Organismes à prévenir obligatoirement :**
- Impôts (via votre espace particulier sur impots.gouv.fr)
- CAF (Caisse d'Allocations Familiales)
- CPAM (Assurance Maladie)
- Pôle Emploi (si concerné)
- Préfecture (pour la carte grise)

**Documents à mettre à jour :**
- Carte d'identité et passeport (si déménagement dans un autre département)
- Permis de conduire
- Carte grise du véhicule
- Carte électorale

**Délais :**
- 1 mois pour la carte grise
- 3 mois pour le permis de conduire
- Dès que possible pour les autres organismes

**Astuce :** Utilisez le service en ligne service-public.fr pour certaines démarches.`,
      category: 'logement',
      is_published: true,
      views_count: 156
    },
    {
      title: 'Comment obtenir un acte de naissance ?',
      answer: `Pour obtenir un acte de naissance, plusieurs options s'offrent à vous :

**En ligne (le plus rapide) :**
- Sur le site service-public.fr
- Gratuit et sécurisé
- Réception par courrier en 2-3 jours

**En mairie :**
- Mairie du lieu de naissance
- Sur place, par courrier ou par procuration
- Pièce d'identité obligatoire

**Types d'actes :**
- **Copie intégrale :** contient toutes les mentions
- **Extrait avec filiation :** indique les parents
- **Extrait sans filiation :** informations de base uniquement

**Qui peut demander :**
- La personne concernée (majeure)
- Les parents (pour enfant mineur)
- Le conjoint, ascendants, descendants
- Représentant légal

**Gratuit et sans limitation** pour les personnes autorisées.`,
      category: 'etat-civil',
      is_published: true,
      views_count: 203
    },
    {
      title: 'Comment s’inscrire sur les listes électorales ?',
      answer: `L'inscription sur les listes électorales est **automatique** pour :
- Les jeunes de 18 ans (recensement obligatoire à 16 ans)
- Les personnes qui obtiennent la nationalité française

**Inscription manuelle nécessaire en cas de :**
- Déménagement
- Première inscription après 18 ans
- Retour de l'étranger

**Comment s'inscrire :**
1. **En ligne :** service-public.fr (le plus simple)
2. **En mairie :** de votre domicile
3. **Par correspondance :** formulaire CERFA

**Documents requis :**
- Pièce d'identité valide
- Justificatif de domicile récent
- Formulaire d'inscription (si par courrier)

**Délais :**
- Jusqu'au 6e vendredi avant un scrutin
- Inscription valable dans toute la commune

**Vérification :** Consultez votre situation sur service-public.fr`,
      category: 'etat-civil',
      is_published: true,
      views_count: 134
    }
  ];

  let questionCount = 0;
  for (const questionData of questions) {
    const category = createdCategories.find(cat => cat.slug === questionData.category);
    if (category) {
      const question = await prisma.question.upsert({
        where: { slug: createSlug(questionData.title) },
        update: {},
        create: {
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
    const existingSetting = await prisma.adsSettings.findFirst({
      where: {
        provider: adSetting.provider,
        position: adSetting.position
      }
    });

    if (!existingSetting) {
      await prisma.adsSettings.create({
        data: adSetting
      });
    }
  }

  console.log('✓ Paramètres publicitaires créés');
  console.log('\n\ud83c\udf89 Initialisation terminée !\n');
  console.log('🔐 Connexion admin :');
  console.log('Email: admin@admin-info.fr');
  console.log('Mot de passe: admin123');
  console.log('\n🌍 Accès admin: http://localhost:3000/admin/login');
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