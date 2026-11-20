# STUDIO IA – MD Bujold

Premier prototype Next.js du studio créatif.

## Fonctionnalités déjà présentes
- Interface française, sombre et responsive.
- Générateur de prompt et panneau de retouche IA.
- Import local d'images.
- Aperçu avec réglages de luminosité, contraste, saturation et filtres.
- Gestion de calques simple.
- Export de l'image affichée.
- Routes serveur préparées pour brancher un fournisseur d'IA.

## Important : mode aperçu
Les boutons d'IA ne produisent pas encore de vraies images. Il faut connecter un fournisseur d'images qui autorise la génération et/ou l'édition via API. Ne mets jamais une clé secrète dans le code du navigateur. Les routes `app/api/generate` et `app/api/edit` sont prévues pour cette connexion.

## Lancer le projet
Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000.

## Déployer sur Vercel
1. Crée un dépôt GitHub et téléverse les fichiers de ce dossier.
2. Dans Vercel, choisis **Add New → Project**, puis importe le dépôt GitHub.
3. Garde les paramètres Next.js détectés automatiquement et clique **Deploy**.
4. Configure les variables d'environnement dans Project Settings → Environment Variables quand le fournisseur IA sera choisi.
5. Après chaque changement de variables, redéploie le projet.

## Prochaines étapes
1. Connecter un fournisseur d'images IA et tester la génération réelle.
2. Brancher la retouche IA avec image source.
3. Améliorer l'éditeur : sélection, déplacement, texte, recadrage, rotation et calques réels.
4. Ajouter sauvegarde de projets et historique.
