# 🏛️ Guide d'administration - Admin Info

## 📍 Accès à l'interface d'administration

### URL secrète d'accès
L'interface d'administration est accessible uniquement via cette URL spéciale :
```
http://localhost:3000/management/login
```

⚠️ **Important** : Cette URL n'est visible nulle part sur le site public pour des raisons de sécurité.

### Identifiants de connexion
- **Email** : `admin@admin-info.fr`
- **Mot de passe** : `admin123`

## 🎯 Fonctionnalités disponibles

### 1. Tableau de bord (`/management/dashboard`)
- Vue d'ensemble des statistiques
- Nombre total de questions
- Nombre de catégories
- Questions récentes
- Accès rapide aux fonctionnalités

### 2. Gestion des questions
**Actuellement en développement** - Les pages suivantes seront créées :
- `/management/questions` - Liste de toutes les questions
- `/management/questions/new` - Ajouter une nouvelle question
- `/management/questions/edit/[id]` - Modifier une question existante

### 3. Gestion des catégories
**Actuellement en développement** - Les pages suivantes seront créées :
- `/management/categories` - Liste de toutes les catégories
- `/management/categories/new` - Ajouter une nouvelle catégorie
- `/management/categories/edit/[id]` - Modifier une catégorie existante

### 4. Gestion des publicités
**Actuellement en développement** - Configuration des espaces publicitaires :
- `/management/ads` - Paramètres des publicités

## 💾 Comment ajouter du contenu ?

### Option 1 : Interface d'administration (Recommandée)
Une fois les pages de gestion développées, vous pourrez :
1. Vous connecter à `/management/login`
2. Naviguer vers "Questions" ou "Catégories"
3. Cliquer sur "Ajouter" pour créer du nouveau contenu
4. Remplir les formulaires et sauvegarder

### Option 2 : Directement en base de données
En attendant le développement complet, vous pouvez ajouter du contenu directement :

#### Ajouter une catégorie
```sql
INSERT INTO Category (name, description, slug, icon) 
VALUES ('Nom de la catégorie', 'Description détaillée', 'slug-url-friendly', '📋');
```

#### Ajouter une question
```sql
INSERT INTO Question (title, content, categoryId, isHighlighted, viewCount, createdAt, updatedAt) 
VALUES (
  'Titre de la question',
  'Contenu détaillé de la réponse en HTML...',
  1, -- ID de la catégorie
  false,
  0,
  NOW(),
  NOW()
);
```

### Option 3 : Script de données
Vous pouvez modifier le fichier `scripts/seed-simple.ts` pour ajouter vos propres données, puis exécuter :
```bash
npm run seed
```

## 🔧 Structure des données

### Modèle Category
- `id` : Identifiant unique
- `name` : Nom de la catégorie (ex: "État Civil")
- `description` : Description détaillée
- `slug` : URL-friendly (ex: "etat-civil")
- `icon` : Emoji ou icône
- `_count.questions` : Nombre de questions liées

### Modèle Question
- `id` : Identifiant unique
- `title` : Titre de la question
- `content` : Contenu HTML de la réponse
- `categoryId` : Lien vers la catégorie
- `isHighlighted` : Question mise en avant
- `viewCount` : Nombre de vues
- `createdAt` / `updatedAt` : Dates

### Modèle Admin
- `id` : Identifiant unique
- `email` : Email de connexion
- `password` : Mot de passe chiffré (bcrypt)
- `name` : Nom d'affichage

## 🛡️ Sécurité

### Middleware de protection
Toutes les routes `/management/*` sont protégées par :
- Vérification du token JWT dans les cookies
- Redirection automatique vers `/management/login` si non connecté
- Session persistante avec cookies HTTP-only

### Recommandations
1. **Changez le mot de passe par défaut** en production
2. **Utilisez HTTPS** en production
3. **Limitez l'accès IP** si possible
4. **Sauvegardez régulièrement** la base de données

## 🚀 Prochaines étapes de développement

### Pages à créer
1. **Gestion des questions**
   - Liste avec pagination et recherche
   - Formulaire d'ajout/modification avec éditeur WYSIWYG
   - Suppression avec confirmation

2. **Gestion des catégories**
   - CRUD complet des catégories
   - Réorganisation de l'ordre d'affichage
   - Gestion des icônes

3. **Gestion des publicités**
   - Configuration des emplacements publicitaires
   - Upload d'images
   - Statistiques de clics

4. **Tableau de bord avancé**
   - Graphiques de statistiques
   - Questions les plus vues
   - Activité récente

5. **Paramètres du site**
   - Configuration générale
   - Métadonnées SEO
   - Apparence du site

## 📞 Support technique

Pour toute question sur l'utilisation ou le développement :
1. Consultez d'abord ce guide
2. Vérifiez les logs de l'application
3. Inspectez la console du navigateur pour les erreurs
4. Vérifiez la connexion à la base de données MySQL

---

**Note** : Ce guide sera mis à jour au fur et à mesure du développement des nouvelles fonctionnalités.