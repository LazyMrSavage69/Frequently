# 🏛️ Admin Info - Questions/Réponses Administratives

Une web application Next.js pour afficher des questions/réponses administratives officielles, permettant aux citoyens d'obtenir rapidement des informations sans créer de compte.

## ✨ Fonctionnalités

### 🌍 Public
- **Accès libre** sans authentification
- **Recherche** de questions
- **Filtrage** par catégorie  
- **Navigation** intuitive
- **Design responsive** mobile-first

### 🔐 Administration
- **Connexion sécurisée** pour les admins
- **CRUD** Questions et Réponses
- **CRUD** Catégories
- **Gestion** de la publication
- **Statistiques** et analytics
- **Configuration** des publicités

### 💰 Publicités
- **Emplacements** stratégiques (header, sidebar, footer, entre contenu)
- **Activation/désactivation** flexible
- **Compatible** Google AdSense
- **Optimisé** Core Web Vitals

## 🛠️ Stack Technique

- **Framework :** Next.js 16 avec App Router
- **Langage :** TypeScript
- **CSS :** Tailwind CSS
- **Base de données :** PostgreSQL  
- **ORM :** Prisma
- **Authentification :** JWT avec cookies HTTP-only
- **Icônes :** Lucide React

## 📦 Installation

### Prérequis
- Node.js 18+ 
- PostgreSQL
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd frequently
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos configurations :
# - DATABASE_URL pour PostgreSQL
# - JWT_SECRET (générez une clé sécurisée)
```

### 4. Configuration de la base de données
```bash
# Générer le client Prisma
npm run db:generate

# Créer et appliquer les migrations
npm run db:push

# Remplir la base avec des données d'exemple
npm run db:seed
```

### 5. Lancer l'application
```bash
# Mode développement
npm run dev

# L'application sera accessible sur http://localhost:3000
```

## 🎯 Utilisation

### Accès Public
- **Accueil :** `http://localhost:3000`
- **Questions :** `http://localhost:3000/questions`
- **Recherche :** Barre de recherche sur toutes les pages

### Accès Administration
- **URL :** `http://localhost:3000/admin/login`
- 

### Structure des URLs

#### 🌐 Pages Publiques
```
/                           # Page d'accueil
/questions                  # Liste des questions
/questions/[slug]          # Détail d'une question
/categories/[slug]         # Questions par catégorie
```

#### 🔐 Pages Administration
```
/admin/login               # Connexion admin
/admin/dashboard           # Tableau de bord
/admin/questions           # Gestion des questions
/admin/questions/new       # Nouvelle question
/admin/questions/edit/[id] # Modification question
/admin/categories          # Gestion des catégories
/admin/ads                 # Configuration publicités
```

## 📊 Base de Données

### Schéma Prisma
```prisma
model Admin {
  id         String   @id @default(cuid())
  email      String   @unique
  password   String
  created_at DateTime @default(now())
}

model Category {
  id         String     @id @default(cuid()) 
  name       String     @unique
  slug       String     @unique
  created_at DateTime   @default(now())
  questions  Question[]
}

model Question {
  id           String   @id @default(cuid())
  title        String
  slug         String   @unique
  answer       String   @db.Text
  category_id  String
  is_published Boolean  @default(false)
  views_count  Int      @default(0)
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
  
  category Category @relation(fields: [category_id], references: [id])
}

model AdsSettings {
  id        String  @id @default(cuid())
  provider  String  # ex: adsense
  slot_id   String?
  position  String  # header, sidebar, footer, between_content  
  is_active Boolean @default(false)
}
```

### Commandes Prisma Utiles
```bash
npm run db:studio    # Interface graphique
npm run db:migrate   # Créer une nouvelle migration
npm run db:push      # Appliquer le schéma sans migration
npm run db:seed      # Réinitialiser avec des données d'exemple
```

## 🎨 Personnalisation

### Modifier les catégories
Éditez `scripts/seed.ts` pour ajuster les catégories par défaut.

### Changer les couleurs 
Modifiez les classes Tailwind dans les composants ou ajoutez votre propre CSS dans `app/globals.css`.

### Ajouter des champs
1. Modifiez `prisma/schema.prisma`
2. Exécutez `npm run db:push`
3. Mettez à jour les types TypeScript dans `lib/types.ts`

## 🚀 Déploiement

### Préparer pour la production
```bash
# Build de l'application
npm run build

# Test du build
npm run start
```

### Variables d'environnement production
```env
DATABASE_URL="votre-postgresql-prod"
JWT_SECRET="clé-super-sécurisée-production"
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
```

### Plateformes recommandées
- **Vercel** (recommandé pour Next.js)
- **Railway** (base de données incluse)
- **DigitalOcean App Platform**
- **AWS Amplify**

## 💰 Configuration Publicités

### Google AdSense
1. Obtenez votre ID client AdSense
2. Configurez les emplacements dans `/admin/ads`
3. Ajoutez les variables d'environnement :
```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-votre-id"
```

### Emplacements disponibles
- **Header :** Bannière en haut de page
- **Sidebar :** Publicité latérale (desktop uniquement)
- **Footer :** Bannière en bas de page
- **Entre contenu :** Publicités intégrées dans les listes

## 📈 SEO et Performance

### Fonctionnalités intégrées
- ✅ **Meta tags** automatiques
- ✅ **Structured Data** (Schema.org)
- ✅ **Sitemap** automatique
- ✅ **URLs SEO-friendly** avec slugs
- ✅ **Open Graph** et Twitter Cards
- ✅ **Core Web Vitals** optimisés

## 🔒 Sécurité

### Mesures implémentées
- ✅ **Mots de passe hashés** (bcrypt)
- ✅ **JWT** avec cookies HTTP-only
- ✅ **Middleware** de protection des routes admin
- ✅ **Validation** des entrées
- ✅ **Protection CSRF** native Next.js

### Recommandations production
- [ ] Utiliser HTTPS obligatoirement
- [ ] Configurer un reverse proxy (Nginx)
- [ ] Rate limiting sur les API routes
- [ ] Logs de sécurité
- [ ] Backup automatique de la BDD

## 🐛 Résolution des problèmes

### Erreur de connexion base de données
```bash
# Vérifier que PostgreSQL fonctionne
pg_isready

# Recréer la base si nécessaire  
npm run db:push
npm run db:seed
```

### Problème d'authentification admin
```bash
# Réinitialiser les données avec le seed
npm run db:seed
```

### Build qui échoue
```bash
# Nettoyer les dépendances
rm -rf node_modules package-lock.json
npm install

# Regénérer Prisma
npm run db:generate
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -am 'Ajout fonctionnalité'`)
4. Pushez la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- **Issues :** GitHub Issues pour les bugs et demandes
- **Discussions :** GitHub Discussions pour les questions
- **Email :** admin@admin-info.fr

---

**Développé avec ❤️ pour faciliter l'accès aux informations administratives**
# Frequently
