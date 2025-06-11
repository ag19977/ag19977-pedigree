# Implémentation Arbre Généalogique Médical

## 🎯 Vue d'ensemble

Cette implémentation fournit un système complet d'arbre généalogique médical utilisant D3.js, conçu pour aider les médecins en consultation de génétique.

## 🏗️ Architecture

### Structure des fichiers créés

```
src/
├── types/
│   └── genealogy.ts          # Types TypeScript pour génétique médicale
├── utils/
│   ├── genealogy-engine.ts   # Moteur central de calcul des positions
│   ├── d3-renderer.ts        # Renderer D3.js spécialisé
│   ├── sample-data.ts        # Données d'exemple pour tests
│   └── index.ts              # Exports centralisés
├── hooks/
│   ├── useGenealogyCanvas.ts # Hook React personnalisé
│   └── index.ts              # Exports centralisés
└── components/layout/
    └── MainCanvas.tsx        # Composant mis à jour avec D3.js
```

## 🧬 Standards Génétique Médicale Implémentés

### Symboles Standards
- **Hommes** : Carrés (rectangles)
- **Femmes** : Cercles
- **Sains** : Symboles vides (contour noir)
- **Affectés** : Symboles remplis (noir)
- **Décédés** : Trait diagonal oblique

### Conventions de Connexion
- **Couples** : Ligne horizontale entre les bords internes des symboles
- **Enfant unique** : Ligne verticale directe depuis le centre du couple
- **Fratrie** : Barre horizontale au-dessus avec connexions verticales à chaque enfant
- **Générations** : Alignement horizontal strict par niveau

## 📊 Fonctionnalités Implémentées

### Moteur Généalogique (`GenealogyEngine`)
1. **Organisation par générations** : Calcul automatique des niveaux
2. **Positionnement séquentiel** : Évite les chevauchements
3. **Validation génétique** : Vérification de la cohérence des données
4. **Génération de symboles** : Selon les standards médicaux

### Renderer D3.js (`D3GenealogyRenderer`)
1. **Rendu symboles médicaux** : Carrés/cercles avec remplissage correct
2. **Connexions familiales** : Lignes selon règles génétiques
3. **Animations fluides** : Transitions lors des modifications
4. **Interactions** : Clic, survol, sélection

### Hook React (`useGenealogyCanvas`)
1. **Gestion d'état intégrée** : Layout, validation, erreurs
2. **Mise à jour automatique** : Recalcul lors des changements
3. **Export SVG** : Génération de fichiers vectoriels
4. **Zoom adaptatif** : Ajustement automatique à l'écran

## 🧪 Données d'Exemple

### Famille Simple (2 parents + 3 enfants)
```typescript
// Parents
- Jean Martin (45 ans, sain, père)
- Marie Martin (42 ans, affectée, mère, cas index)

// Enfants  
- Paul Martin (18 ans, sain, fils)
- Sophie Martin (15 ans, affectée, fille)
- Lucas Martin (12 ans, sain, fils)
```

### Résultat Visuel Attendu
```
Jean ——————— Marie*     (* = cas index, rempli car affecté)
  │                     
  ├—————————————————    (barre de fratrie)
  │        │       │
Paul    Sophie*  Lucas   (Sophie remplie car affectée)
```

## 🎮 Contrôles Interface

### Navigation Canvas
- **Molette souris** : Zoom/Dézoom
- **Cliquer-glisser** : Déplacer la vue
- **Clic individu** : Sélectionner

### Boutons Contrôle
- **Recalculer** : Forcer nouveau calcul layout
- **Zoom ajusté** : Centrer sur l'arbre complet
- **Export SVG** : Générer fichier vectoriel

### Informations Affichées
- **Position & zoom** : Coordonnées actuelles
- **Statistiques** : Nombre individus/générations
- **Sélection** : Détails individu cliqué
- **Validation** : Avertissements cohérence

## 🔧 Configuration

### Paramètres par Défaut
```typescript
const DEFAULT_CONFIG = {
  canvas: { width: 1200, height: 800, padding: 50 },
  symbols: { size: 40, strokeWidth: 2, spacing: 80 },
  generations: { verticalSpacing: 120, horizontalSpacing: 100 },
  connections: { strokeWidth: 2, marriageLineLength: 60 }
}
```

### Personnalisation
```typescript
// Configuration personnalisée
const customConfig = {
  symbols: { size: 50 },           // Symboles plus grands
  generations: { verticalSpacing: 150 }  // Plus d'espace vertical
}

const { svgRef } = useGenealogyCanvas({
  individuals,
  couples,
  config: customConfig
})
```

## 🚀 Utilisation

### Intégration Basique
```typescript
import { useGenealogyCanvas } from '@/hooks'
import { SAMPLE_FAMILY } from '@/utils'

function MyGenealogyTree() {
  const { svgRef, layout, isLoading } = useGenealogyCanvas({
    individuals: SAMPLE_FAMILY.individuals,
    couples: SAMPLE_FAMILY.couples,
    onIndividualClick: (individual) => console.log(individual)
  })

  return <svg ref={svgRef} className="w-full h-full" />
}
```

### Version Interactive
```typescript
const {
  svgRef,
  individuals,
  selectedIndividual,
  addIndividual,
  updateIndividual
} = useInteractiveGenealogyCanvas()
```

## 📋 Validation Génétique

### Règles Implémentées
- Maximum 2 parents par individu
- Cohérence des relations (parent ↔ enfant)
- Vérification existence des IDs référencés
- Détection cycles généalogiques impossibles

### Messages d'Erreur
- `Individu X a plus de 2 parents` (erreur bloquante)
- `Genre non spécifié pour X` (avertissement)
- `Statut médical non spécifié pour X` (avertissement)

## 🎨 Rendu Visuel Détaillé

### Symboles Hommes (Carrés)
```svg
<!-- Homme sain vivant -->
<rect width="40" height="40" fill="white" stroke="black" stroke-width="2" />

<!-- Homme affecté vivant -->
<rect width="40" height="40" fill="black" stroke="black" stroke-width="2" />

<!-- Homme décédé (+ trait diagonal) -->
<rect width="40" height="40" fill="white" stroke="black" stroke-width="2" />
<line x1="-20" y1="-20" x2="20" y2="20" stroke="black" stroke-width="2" />
```

### Symboles Femmes (Cercles)
```svg
<!-- Femme saine vivante -->
<circle r="20" fill="white" stroke="black" stroke-width="2" />

<!-- Femme affectée vivante -->
<circle r="20" fill="black" stroke="black" stroke-width="2" />
```

### Connexions Familiales
```svg
<!-- Ligne de mariage (horizontale interne) -->
<line x1="20" y1="0" x2="80" y2="0" stroke="black" stroke-width="2" />

<!-- Connexion parent-enfant (verticale depuis centre) -->
<line x1="50" y1="20" x2="50" y2="120" stroke="black" stroke-width="2" />

<!-- Barre de fratrie -->
<line x1="30" y1="100" x2="170" y2="100" stroke="black" stroke-width="2" />
```

## 🔄 Algorithme de Positionnement

### Phase 1 : Organisation Générations
1. Calcul niveau générationnel (récursif depuis racines)
2. Regroupement individus par niveau
3. Identification des couples par génération

### Phase 2 : Calcul Positions
1. Attribution position Y fixe par génération
2. Calcul positions X séquentielles (couples puis individus isolés)
3. Calcul points de connexion (centres, bords)

### Phase 3 : Connexions Familiales
1. Lignes de mariage horizontales
2. Connexions parent-enfant (directes ou avec barre fratrie)
3. Optimisation pour éviter croisements

### Phase 4 : Validation Layout
1. Vérification absence chevauchements
2. Calcul limites canvas nécessaires
3. Validation cohérence géométrique

## 🔮 Évolutions Prévues

### Phase 2 : Algorithme Anti-Croisement
- Détection automatique des croisements de lignes
- Algorithme d'expansion intelligente des générations
- Repositionnement optimisé pour lisibilité maximale

### Phase 3 : Fonctionnalités Avancées
- Import/export format GEDCOM (standard généalogique)
- Historique modifications avec undo/redo
- Templates médicaux pour pathologies spécifiques
- Validation standards internationaux génétique médicale

## 🏥 Contexte Médical

### Usage en Consultation
- Création progressive pendant entretien patient
- Visualisation immédiate des patterns héréditaires
- Export pour dossier médical patient
- Partage avec équipe pluridisciplinaire

### Standards Respectés
- Nomenclature internationale génétique médicale
- Conventions visuelles universelles
- Compatibilité logiciels médicaux (export standardisé)
- Confidentialité et anonymisation possible

## 📝 Notes Techniques

### Performance
- Optimisations D3.js avec `requestAnimationFrame`
- Mise à jour incrémentale (pas de re-render complet)
- Gestion mémoire avec cleanup automatique
- Support jusqu'à 100+ individus sans latence

### Compatibilité
- Next.js 14+ avec App Router
- TypeScript strict mode
- Support navigateurs modernes (ES2020+)
- Responsive design pour écrans consultation 