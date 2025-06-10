# Règles de Programmation pour Cursor - Application Arbre Généalogique Médical

## 🎯 Objectifs Généraux
- Développer une application Next.js pour créer des arbres généalogiques médicaux
- Interface intuitive pour médecins en consultation
- Code maintenable avec TypeScript, Zustand, D3.js et shadcn/ui
- Respect des standards médicaux et de confidentialité des données
- Performance optimale pour manipulation d'arbres complexes

## 📋 Structure de Projet

### Organisation des Fichiers - Structure Projet Arbre Généalogique
```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── canvas/            # Composants canvas D3.js
│   ├── sidebar/           # Barre latérale caractéristiques
│   ├── navbar/            # Barre navigation supérieure
│   └── modals/            # Modales import/export
├── stores/                # Zustand stores
│   ├── genealogy-store.ts # Store principal arbre
│   ├── ui-store.ts        # Store état interface
│   └── selection-store.ts # Store sélection individus
├── types/
│   ├── genealogy.ts       # Types arbre généalogique
│   ├── medical.ts         # Types données médicales
│   └── canvas.ts          # Types canvas et visualisation
├── utils/
│   ├── d3-helpers.ts      # Utilitaires D3.js
│   ├── genealogy-logic.ts # Logique arbre généalogique
│   └── export-import.ts   # Fonctions import/export
├── hooks/                 # Custom hooks React
└── lib/                   # Configuration et helpers
```

### Conventions de Nommage - Spécifique Arbre Généalogique
- **Variables** : camelCase (`selectedIndividual`, `familyTree`, `medicalHistory`)
- **Fonctions** : camelCase avec verbes d'action (`addIndividual`, `updateMedicalData`, `exportTree`)
- **Classes** : PascalCase (`GenealogyTree`, `IndividualNode`, `CanvasRenderer`)
- **Constantes** : UPPER_SNAKE_CASE (`CANVAS_WIDTH`, `DEFAULT_NODE_SIZE`, `MEDICAL_CONDITIONS`)
- **Composants** : PascalCase (`FamilyTreeCanvas`, `IndividualSidebar`, `MedicalHistoryForm`)
- **Types** : PascalCase avec suffixe (`IndividualType`, `RelationshipType`, `MedicalConditionType`)

### Nommage Spécifique au Domaine Médical
- Utiliser la terminologie médicale standard
- Préfixer les types médicaux : `Medical`, `Genetic`, `Clinical`
- Suffixer les composants canvas : `Canvas`, `Node`, `Connection`

## 🧬 Standards Génétique Médicale - Symboles et Conventions

### Symboles Standardisés (Selon l'image fournie)
```typescript
// Types de symboles selon standards génétique médicale
interface GeneticSymbol {
  shape: 'square' | 'circle'           // Carré = Homme, Cercle = Femme
  fill: 'empty' | 'filled' | 'striped' // Vide = non-affecté, Plein = affecté, Rayé = affecté décédé
  status: 'alive' | 'deceased'         // Vivant ou décédé (trait diagonal si décédé)
  affected: boolean                    // Affecté par la condition étudiée
}

// Convention des couleurs et remplissages
const GENETIC_SYMBOLS = {
  MALE_UNAFFECTED: { shape: 'square', fill: 'empty', color: 'black' },
  MALE_AFFECTED: { shape: 'square', fill: 'filled', color: 'navy' },
  MALE_DECEASED_UNAFFECTED: { shape: 'square', fill: 'empty', diagonal: true },
  MALE_DECEASED_AFFECTED: { shape: 'square', fill: 'striped', diagonal: true },
  FEMALE_UNAFFECTED: { shape: 'circle', fill: 'empty', color: 'black' },
  FEMALE_AFFECTED: { shape: 'circle', fill: 'filled', color: 'navy' },
  FEMALE_DECEASED_UNAFFECTED: { shape: 'circle', fill: 'empty', diagonal: true },
  FEMALE_DECEASED_AFFECTED: { shape: 'circle', fill: 'striped', diagonal: true }
} as const
```

### Règles de Positionnement Générationnelles
```typescript
interface GenerationLayout {
  level: number                    // Niveau générationnel (0 = plus ancienne)
  individuals: Individual[]        // Membres de cette génération
  couples: Couple[]               // Couples de cette génération
  yPosition: number               // Position Y fixe pour toute la génération
  minWidth: number                // Largeur minimale nécessaire
  spacing: {
    individual: number            // Espacement entre individus
    couple: number               // Espacement entre couples
    generation: number           // Espacement vertical entre générations
  }
}

// Règles de connexions familiales
interface ConnectionRules {
  marriage: {
    type: 'horizontal'           // Ligne horizontale entre époux
    position: 'internal_edge'    // Au bord interne des symboles
    length: 'dynamic'            // Longueur calculée dynamiquement
  }
  parentChild: {
    fromParents: 'center_of_marriage_line'  // Depuis le centre de la ligne de mariage
    toChild: 'top_edge'                     // Vers le bord supérieur de l'enfant
    multipleChildren: 'horizontal_bridge'   // Barre horizontale pour fratrie
  }
}
```

## 🏗️ Architecture Spécifique - Stack Technique

### Next.js 14+ avec App Router
- Utiliser App Router pour la structure de routing
- Server Components par défaut, Client Components quand nécessaire
- Pages statiques quand possible pour optimiser les performances
- Metadata API pour SEO et métadonnées médicales

### Zustand - Gestion d'État
- Un store principal pour l'arbre généalogique (`genealogyStore`)
- Store séparé pour l'état de l'interface (`uiStore`)
- Store pour la sélection et navigation (`selectionStore`)
- Utiliser `immer` middleware pour l'immutabilité
- Persist middleware pour sauvegarder automatiquement

```typescript
// Structure type des stores
interface GenealogyStore {
  individuals: Individual[]
  relationships: Relationship[]
  selectedIndividual: string | null
  addIndividual: (individual: Individual) => void
  updateIndividual: (id: string, data: Partial<Individual>) => void
  deleteIndividual: (id: string) => void
}
```

### D3.js pour Canvas et Visualisation - Logique Arbre Généalogique
- **Architecture centralisée** : Toute logique arbre dans `genealogy-engine.ts`
- **Calcul séquentiel** : Positions calculées génération par génération
- **Prévention croisements** : Algorithme de détection et ajustement
- **Dimensionnement dynamique** : Élargissement automatique si manque de place
- **Performance optimisée** : Updates incrémentales, pas de re-render complet

```typescript
// Structure centrale du moteur généalogique
interface GenealogyEngine {
  // Calcul des positions
  calculateLayout(individuals: Individual[], relationships: Relationship[]): TreeLayout
  
  // Détection des conflits spatiaux
  detectCrossings(layout: TreeLayout): CrossingConflict[]
  
  // Résolution automatique des croisements
  resolveSpacing(layout: TreeLayout, conflicts: CrossingConflict[]): TreeLayout
  
  // Rendu D3.js optimisé
  renderTree(svg: d3.Selection, layout: TreeLayout): void
  
  // Mise à jour incrémentale
  updatePositions(changes: LayoutChange[]): void
}

// Algorithme de positionnement séquentiel
interface LayoutAlgorithm {
  phase1: 'calculate_generation_widths'     // Largeur nécessaire par génération
  phase2: 'position_individuals'            // Position X de chaque individu
  phase3: 'calculate_connections'           // Tracé des lignes de connexion
  phase4: 'detect_resolve_crossings'        // Détection et résolution conflits
  phase5: 'optimize_spacing'                // Optimisation finale espacement
}
```

### Logique de Connexions Familiales D3.js
```typescript
// Types de connexions selon règles génétique médicale
interface FamilyConnections {
  marriage: {
    path: (couple: Couple) => string        // Ligne horizontale interne
    length: (spacing: number) => number     // Longueur dynamique
  }
  
  parentToChildren: {
    singleChild: (parent: Position, child: Position) => string
    multipleChildren: (parents: Position, children: Position[]) => string
    siblingBridge: (children: Position[]) => string  // Barre horizontale fratrie
  }
  
  generationSpacing: {
    calculate: (generation: Individual[]) => number
    expand: (requiredWidth: number, currentWidth: number) => LayoutAdjustment
  }
}

// Prévention des croisements - Algorithme principal
interface CrossingPrevention {
  detectVerticalCrossings: (connections: Connection[]) => Crossing[]
  detectHorizontalCrossings: (generations: Generation[]) => Crossing[]
  resolveByExpansion: (crossings: Crossing[]) => LayoutAdjustment
  validateNoCrossings: (layout: TreeLayout) => boolean
}
```

### shadcn/ui - Interface Utilisateur
- Composants cohérents pour sidebar et modales
- Respect du design system médical (couleurs appropriées)
- Accessibilité WCAG 2.1 AA pour usage médical
- Thème sombre/clair adapté aux consultations

## 💻 Standards de Code - Application Médicale

### Qualité du Code Médical
- TypeScript strict mode obligatoire pour la sécurité des données
- Validation stricte des données médicales avec Zod
- Gestion d'erreurs robuste pour éviter perte de données patient
- Logging détaillé pour audit et traçabilité
- Code défensif pour toutes les opérations critiques

### Types Spécifiques au Domaine - Génétique Médicale
```typescript
// Structure Individual étendue pour génétique médicale
interface Individual {
  id: string
  firstName: string
  lastName: string
  birthDate?: Date
  gender: 'male' | 'female' | 'unknown'
  
  // Statut médical selon standards génétique
  medicalStatus: {
    affected: boolean                    // Affecté par condition étudiée
    status: 'alive' | 'deceased'        // Statut vital
    conditions: MedicalCondition[]      // Conditions médicales
    isProband?: boolean                 // Cas index (patient consultant)
  }
  
  // Position calculée par l'algorithme
  layout: {
    generation: number                  // Niveau générationnel
    position: { x: number; y: number }  // Position absolue
    symbol: GeneticSymbol              // Symbole à afficher
  }
  
  // Relations familiales
  relationships: {
    spouseId?: string                  // Conjoint
    parentIds: string[]                // Parents
    childrenIds: string[]              // Enfants
    siblingIds: string[]               // Fratrie
  }
}

// Couple - Unité de base pour calcul positions
interface Couple {
  id: string
  individual1Id: string
  individual2Id: string
  marriageDate?: Date
  divorced?: boolean
  
  // Layout spécifique couple
  layout: {
    generation: number
    centerPosition: { x: number; y: number }
    connectionLine: {
      start: { x: number; y: number }
      end: { x: number; y: number }
    }
    childrenConnection?: {
      dropPoint: { x: number; y: number }    // Point de descente vers enfants
      bridgeWidth?: number                   // Largeur barre fratrie si plusieurs enfants
    }
  }
  
  children: string[]                         // IDs des enfants
}

// Génération - Regroupement par niveau
interface Generation {
  level: number                             // 0 = plus ancienne génération
  individuals: Individual[]
  couples: Couple[]
  
  // Calculs de layout
  layout: {
    yPosition: number                       // Position Y fixe pour toute la génération
    totalWidth: number                      // Largeur totale nécessaire
    spacing: {
      betweenIndividuals: number
      betweenCouples: number
    }
  }
  
  // Connexions vers génération suivante
  connections: GenerationConnection[]
}

// Connexion entre générations
interface GenerationConnection {
  type: 'parent_to_children'
  fromCouple: string                        // ID du couple parent
  toChildren: string[]                      // IDs des enfants
  
  // Géométrie de la connexion
  path: {
    parentDropPoint: { x: number; y: number }     // Point de descente depuis parents
    childrenBridge?: {                            // Barre horizontale fratrie (si > 1 enfant)
      start: { x: number; y: number }
      end: { x: number; y: number }
      connectionPoints: { x: number; y: number }[] // Points de connexion à chaque enfant
    }
    directConnections: {                          // Connexions directes (si 1 seul enfant)
      from: { x: number; y: number }
      to: { x: number; y: number }
    }[]
  }
}
```

### Performance Canvas et D3.js
- Utiliser `requestAnimationFrame` pour les animations
- Debounce des interactions utilisateur (zoom, pan)
- Virtual scrolling pour arbres avec nombreux individus
- Lazy loading des données médicales détaillées
- Optimisation mémoire avec cleanup des listeners D3

### Formatage et Style
- Utiliser Prettier pour le formatage automatique
- Configurer ESLint avec des règles strictes
- Indentation : 2 espaces pour JS/TS, 4 pour Python
- Longueur de ligne : 80-100 caractères maximum
- Toujours utiliser des points-virgules en JavaScript/TypeScript

### Gestion des Erreurs
- Toujours gérer les erreurs explicitement
- Utiliser try-catch pour les opérations async
- Créer des classes d'erreur personnalisées si nécessaire
- Logger les erreurs avec des messages descriptifs
- Ne jamais ignorer silencieusement les erreurs

## 🔧 Bonnes Pratiques de Développement

### Fonctions et Méthodes
- Fonctions pures quand c'est possible (pas d'effets de bord)
- Paramètres par défaut plutôt que des vérifications conditionnelles
- Maximum 3-4 paramètres par fonction, utiliser des objets si plus
- Noms de fonctions explicites et auto-documentés
- Retourner early pour éviter l'imbrication excessive

### Gestion des Données
- Validation des données d'entrée avec des schémas (Zod, Joi, etc.)
- Sanitisation des données utilisateur pour éviter les injections
- Immutabilité des données quand c'est possible
- Utiliser des constantes pour les valeurs magiques

### Asynchrone
- Privilégier async/await à Promise.then()
- Gérer les timeouts et les retry pour les appels réseau
- Éviter les boucles async non contrôlées
- Utiliser Promise.all() pour les opérations parallèles

## 📚 Documentation et Commentaires

### Documentation du Code
- JSDoc pour toutes les fonctions publiques
- Commentaires pour expliquer le "pourquoi", pas le "comment"
- README.md complet avec installation, usage et exemples
- Documenter les API endpoints avec OpenAPI/Swagger

### Exemples de Documentation
```typescript
/**
 * Calcule le prix total avec taxes et remises
 * @param price - Prix de base (HT)
 * @param taxRate - Taux de taxe (0.20 pour 20%)
 * @param discount - Remise en pourcentage (0.10 pour 10%)
 * @returns Prix total TTC après remise
 */
function calculateTotalPrice(price: number, taxRate: number, discount: number = 0): number {
  // Logique de calcul...
}
```

## 🧪 Tests et Qualité

### Stratégie de Tests
- Tests unitaires pour toute logique métier
- Tests d'intégration pour les flux critiques
- Couverture de code minimum : 80%
- Tests automatisés dans la CI/CD
- Nommage des tests : "should_do_something_when_condition"

### Outils Recommandés
- **JavaScript/TypeScript** : Jest, Vitest, Testing Library
- **Python** : pytest, unittest
- **Linting** : ESLint, Pylint
- **Formatage** : Prettier, Black

## 🔒 Sécurité

## 🔒 Sécurité et Confidentialité Médicale

### Protection des Données Patient
- Chiffrement local des données sensibles
- Pas de stockage permanent côté client sans consentement
- Anonymisation automatique pour les exports de démo
- Audit trail de toutes les modifications
- Session timeout pour prévenir accès non autorisé

### Conformité Réglementaire
- Respect RGPD pour données de santé
- Préparation pour certification dispositif médical
- Traçabilité complète des actions utilisateur
- Possibilité d'effacement complet des données

### Gestion des Secrets et Config
```typescript
// Variables d'environnement attendues
interface EnvConfig {
  NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production'
  ENCRYPTION_KEY?: string // Pour chiffrement local si nécessaire
  BACKUP_ENDPOINT?: string // Endpoint sauvegarde sécurisée
}
```

## 📊 Import/Export - Formats Standards

### Formats Supportés
- **GEDCOM** : Standard généalogique international
- **JSON** : Format natif application
- **PDF** : Export visuel pour dossiers patients
- **PNG/SVG** : Export graphique haute résolution

### Structure Export JSON
```typescript
interface GenealogyExport {
  version: string
  metadata: {
    exportDate: Date
    patientId?: string // Anonymisé si nécessaire
    createdBy: string
  }
  individuals: Individual[]
  relationships: Relationship[]
  layout: {
    canvasSize: { width: number; height: number }
    zoom: number
    center: { x: number; y: number }
  }
}
```

## 🚀 Performance

### Optimisations
- Lazy loading pour les composants non critiques
- Mise en cache intelligente des données
- Optimisation des requêtes base de données
- Compression des assets statiques
- Monitoring des performances

### Métriques à Surveiller
- Temps de réponse des API (< 200ms idéalement)
- Taille des bundles JavaScript
- Temps de chargement des pages
- Utilisation mémoire et CPU

## 🔄 Git et Versioning

### Commits
- Messages de commit descriptifs et en français ou anglais
- Format : `type(scope): description`
- Types : feat, fix, docs, style, refactor, test, chore
- Commits atomiques (une fonctionnalité = un commit)

### Branches
- `main/master` : code de production
- `develop` : intégration continue
- `feature/nom-fonctionnalité` : nouvelles fonctionnalités
- `hotfix/nom-correctif` : corrections urgentes

## 🤖 Instructions Spécifiques pour Cursor

## 🤖 Instructions Spécifiques pour Cursor - Arbre Généalogique

### Contexte à Toujours Fournir
```
"Je développe une application Next.js d'arbre généalogique médical avec :
- Stack : Next.js 14+, TypeScript, Zustand, D3.js, shadcn/ui
- Interface : Canvas central + sidebar gauche + navbar supérieure
- Utilisateurs : Médecins en consultation
- Phase actuelle : [Interface UI | Logique arbre | Intégration D3]"
```

### Prompts Efficaces par Composant

#### Pour le Moteur Généalogique D3.js :
```
"Crée le moteur central genealogy-engine.ts qui :
- Calcule les positions séquentiellement génération par génération
- Implémente l'algorithme de prévention des croisements de lignes
- Gère le dimensionnement dynamique (élargissement si manque de place)
- Utilise les symboles standards de génétique médicale (carré/cercle, rempli/vide)
- Respecte les règles de connexions : couples reliés horizontalement, enfants centrés
- Optimise les performances avec updates incrémentales D3.js
- Types TypeScript stricts pour Individual, Couple, Generation"
```

#### Pour l'Algorithme de Positionnement :
```
"Crée l'algorithme de layout séquentiel qui :
Phase 1: Calcule largeur nécessaire pour chaque génération
Phase 2: Positionne les individus en évitant les croisements  
Phase 3: Trace les connexions selon règles génétique médicale
Phase 4: Détecte et résout automatiquement les conflits spatiaux
Phase 5: Optimise l'espacement final pour lisibilité maximale
- Enfant seul : ligne verticale directe au centre des parents
- Fratrie : barre horizontale au-dessus, connexions verticales
- Élargissement automatique des générations supérieures si nécessaire"
```

#### Pour le Rendu D3.js des Symboles :
```
"Crée le système de rendu D3.js pour symboles génétique médicale :
- Carrés pour hommes, cercles pour femmes (dimensions standards)
- Remplissage : vide (non-affecté), plein (affecté), rayé (affecté décédé)
- Trait diagonal pour individus décédés
- Lignes de connexion : horizontales couples, verticales parents-enfants
- Animations fluides pour ajout/suppression/déplacement
- Optimisation performances : virtualisation si > 100 individus
- Respect des couleurs standards médical (noir, bleu marine)"
```

#### Pour les Stores Zustand :
```
"Crée un store Zustand pour arbre généalogique avec :
- State : individuals[], relationships[], selectedIds[]
- Actions : CRUD operations + validation Zod
- Middleware : immer pour immutabilité + persist
- Types TypeScript stricts pour données médicales
- Gestion erreurs et rollback si opération échoue"
```

#### Pour les Composants shadcn/ui :
```
"Crée un composant sidebar avec shadcn/ui pour :
- Formulaire individu avec validation temps réel
- Sections collapsibles (infos perso, médical, famille)
- Auto-sauvegarde + indicateur statut
- Responsive design pour écrans consultation
- Accessibilité WCAG 2.1 AA"
```

### Patterns de Code Attendus

#### Structure Moteur Généalogique
```typescript
// Architecture centralisée du moteur généalogique
class GenealogyEngine {
  // Méthode principale : calcul complet du layout
  calculateTreeLayout(
    individuals: Individual[],
    relationships: Relationship[]
  ): TreeLayout {
    const generations = this.organizeByGenerations(individuals, relationships)
    const layoutPlan = this.calculateSequentialLayout(generations)
    const optimizedLayout = this.resolveSpacingConflicts(layoutPlan)
    return this.validateAndFinalize(optimizedLayout)
  }
  
  // Phase 1: Organisation par générations
  private organizeByGenerations(
    individuals: Individual[],
    relationships: Relationship[]
  ): Generation[] {
    // Logique de regroupement générationnel
    // Identification des couples, fratries, lignées
  }
  
  // Phase 2: Calcul séquentiel des positions
  private calculateSequentialLayout(generations: Generation[]): LayoutPlan {
    // Calcul largeur nécessaire par génération
    // Positionnement des individus et couples
    // Calcul des points de connexion
  }
  
  // Phase 3: Résolution des conflits spatiaux
  private resolveSpacingConflicts(layout: LayoutPlan): LayoutPlan {
    // Détection des croisements de lignes
    // Élargissement des générations si nécessaire
    // Optimisation finale de l'espacement
  }
}

// Utilitaires de calcul géométrique
class GeometryCalculator {
  // Calcul connexions couples (lignes horizontales internes)
  calculateMarriageLine(couple: Couple): ConnectionPath
  
  // Calcul connexions parent-enfant selon nombre d'enfants
  calculateParentChildConnections(
    couple: Couple,
    children: Individual[]
  ): ConnectionPath[]
  
  // Détection des croisements de lignes
  detectLineCrossings(connections: ConnectionPath[]): CrossingConflict[]
  
  // Calcul de l'espacement optimal pour éviter croisements
  calculateOptimalSpacing(
    generation: Generation,
    conflicts: CrossingConflict[]
  ): SpacingAdjustment
}
```

#### Patterns D3.js Spécialisés
```typescript
// Hook personnalisé pour rendu arbre généalogique
function useGenealogyCanvas(
  svgRef: RefObject<SVGSVGElement>,
  treeLayout: TreeLayout,
  onSelectionChange: (ids: string[]) => void
) {
  useEffect(() => {
    if (!svgRef.current || !treeLayout) return
    
    const svg = d3.select(svgRef.current)
    
    // Rendu des symboles génétique médicale
    renderGeneticSymbols(svg, treeLayout.individuals)
    
    // Rendu des connexions familiales
    renderFamilyConnections(svg, treeLayout.connections)
    
    // Gestion des interactions
    setupInteractions(svg, onSelectionChange)
    
    return () => {
      // Cleanup des listeners D3
      svg.selectAll('*').remove()
    }
  }, [treeLayout])
}

// Fonctions de rendu spécialisées
function renderGeneticSymbols(
  svg: d3.Selection,
  individuals: Individual[]
): void {
  const symbols = svg.selectAll('.individual')
    .data(individuals, d => d.id)
  
  // Enter: nouveaux individus
  const symbolsEnter = symbols.enter()
    .append('g')
    .attr('class', 'individual')
    .attr('transform', d => `translate(${d.layout.position.x}, ${d.layout.position.y})`)
  
  // Ajout des formes selon genre et statut médical
  symbolsEnter.each(function(d) {
    const group = d3.select(this)
    
    if (d.gender === 'male') {
      group.append('rect')
        .attr('width', SYMBOL_SIZE)
        .attr('height', SYMBOL_SIZE)
        .attr('fill', d.medicalStatus.affected ? 'navy' : 'white')
        .attr('stroke', 'black')
    } else {
      group.append('circle')
        .attr('r', SYMBOL_SIZE / 2)
        .attr('fill', d.medicalStatus.affected ? 'navy' : 'white')
        .attr('stroke', 'black')
    }
    
    // Trait diagonal si décédé
    if (d.medicalStatus.status === 'deceased') {
      group.append('line')
        .attr('x1', -SYMBOL_SIZE/2)
        .attr('y1', -SYMBOL_SIZE/2)
        .attr('x2', SYMBOL_SIZE/2)
        .attr('y2', SYMBOL_SIZE/2)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
    }
  })
  
  // Update: positions existantes
  symbols.transition()
    .duration(500)
    .attr('transform', d => `translate(${d.layout.position.x}, ${d.layout.position.y})`)
  
  // Exit: suppression
  symbols.exit().remove()
}
```

#### Composants Canvas
```typescript
// Structure attendue pour composants canvas
interface CanvasProps {
  width: number
  height: number
  individuals: Individual[]
  relationships: Relationship[]
  onSelectionChange: (ids: string[]) => void
  onIndividualUpdate: (id: string, position: Position) => void
}
```

### Tests Spécifiques - Arbre Généalogique Médical
- **Tests algorithme positionnement** : Vérification positions sans croisements
- **Tests symboles génétique médicale** : Rendu correct selon genre/statut
- **Tests performance** : Layout de 100+ individus < 500ms
- **Tests validation** : Cohérence données généalogiques
- **Tests interactions D3.js** : Sélection, zoom, pan avec jest-environment-jsdom
- **Tests cas limites** : Arbres complexes, générations déséquilibrées
- **Tests export** : Formats GEDCOM, SVG, PDF conformes standards médicaux

### Validation Génétique Médicale
```typescript
// Règles de validation pour cohérence génétique
interface GeneticValidation {
  // Validation structure familiale
  validateFamilyStructure: (tree: GenealogyTree) => ValidationResult[]
  
  // Vérification cohérence âges/dates
  validateChronology: (individuals: Individual[]) => ValidationResult[]
  
  // Contrôle conformité standards médicaux
  validateMedicalStandards: (tree: GenealogyTree) => ValidationResult[]
  
  // Détection anomalies génétiques impossibles
  detectGeneticInconsistencies: (tree: GenealogyTree) => ValidationResult[]
}

// Exemples de validations critiques
const GENETIC_VALIDATIONS = {
  MAX_CHILDREN: 20,                    // Limite réaliste nombre d'enfants
  MIN_PARENT_AGE: 12,                  // Âge minimum biologique parent
  MAX_GENERATION_GAP: 60,              // Écart générationnel maximum
  REQUIRED_FIELDS: ['gender', 'medicalStatus'], // Champs obligatoires
  SYMBOL_CONSISTENCY: true             // Cohérence symboles/données
} as const
```

## 🎨 Spécificités par Technologie

## 🎨 Spécificités Interface Utilisateur

### Layout Principal - 3 Sections
```typescript
// Structure layout attendue
interface AppLayout {
  navbar: {
    height: '64px'
    tools: ['add', 'delete', 'undo', 'redo', 'save', 'settings']
    position: 'top'
  }
  sidebar: {
    width: '320px'
    position: 'left'
    collapsible: true
    sections: ['individual-details', 'medical-history', 'import-export']
  }
  canvas: {
    position: 'remaining-space'
    features: ['grid', 'zoom', 'pan', 'selection']
    background: 'grid-pattern'
  }
}
```

### Canvas D3.js - Spécifications
- Grille de fond avec snapping optionnel
- Zoom : facteur 0.1x à 5x
- Pan : limites intelligentes basées sur contenu
- Sélection multiple avec Ctrl/Cmd + clic
- Drag & drop pour repositionnement individus
- Connexions automatiques selon relations

### Sidebar - Panneau de Propriétés
- Formulaires dynamiques selon type d'individu sélectionné
- Validation en temps réel des données médicales
- Auto-sauvegarde toutes les 30 secondes
- Historique des modifications (undo/redo)

### Navbar - Barre d'Outils
- Icônes intuitives pour médecins non-techniques
- Raccourcis clavier pour actions fréquentes
- État visuel des outils (actif/inactif)
- Tooltips explicatifs pour chaque action

### Node.js/Express
- Middleware pour la validation
- Séparation routes/controllers/services
- Gestion centralisée des erreurs
- Configuration via variables d'environnement

### Python/Django
- PEP 8 pour le style de code
- Type hints pour tous les paramètres
- Serializers pour les API REST
- Migrations pour les changements DB

## 📊 Métriques et Monitoring

### Indicateurs de Qualité
- Complexité cyclomatique < 10
- Couverture de tests > 80%
- Temps de build < 2 minutes
- Zéro vulnérabilité critique

### Outils de Monitoring
- Sentry pour le tracking d'erreurs
- Lighthouse pour les performances web
- SonarQube pour la qualité du code
- Dependabot pour les dépendances

---

## 📝 Checklist Avant Chaque Commit - Application Médicale

### Code Quality & Sécurité
- [ ] TypeScript strict mode sans erreurs ni `any`
- [ ] Validation Zod pour toutes les données médicales
- [ ] Gestion d'erreurs explicite avec try-catch
- [ ] Pas de données sensibles dans les logs
- [ ] Code formaté avec Prettier
- [ ] Aucune erreur ESLint

### Performance & UX - Arbre Généalogique
- [ ] **Moteur généalogique** : Calcul layout < 200ms pour 50 individus
- [ ] **Rendu D3.js** : 60fps maintenu avec animations fluides
- [ ] **Algorithme positionnement** : Aucun croisement de lignes détecté
- [ ] **Dimensionnement dynamique** : Élargissement automatique fonctionne
- [ ] **Interactions** : Sélection/déplacement responsive < 50ms
- [ ] **Mémoire** : Pas de fuites avec cleanup D3 listeners

### Standards Génétique Médicale
- [ ] **Symboles conformes** : Carré/cercle, rempli/vide selon standards
- [ ] **Connexions correctes** : Couples horizontales internes, enfants centrés
- [ ] **Générations alignées** : Même niveau Y pour chaque génération  
- [ ] **Espacement optimal** : Pas de chevauchement, lisibilité maximale
- [ ] **Validation génétique** : Cohérence âges, relations, chronologie
- [ ] **Légende visible** : Symboles expliqués selon image de référence

### Logique Centralisée
- [ ] **Architecture moteur** : Toute logique dans genealogy-engine.ts
- [ ] **Calcul séquentiel** : 5 phases distinctes et documentées
- [ ] **Types stricts** : Individual, Couple, Generation typés
- [ ] **Algorithme scalable** : Performance linéaire O(n) si possible
- [ ] **Code lisible** : Commentaires expliquant logique médicale
- [ ] **Modularité** : Fonctions spécialisées réutilisables

### Fonctionnalités Spécifiques
- [ ] Import/export formats testés
- [ ] Validation données généalogiques cohérentes
- [ ] Undo/redo opérationnel
- [ ] Zoom/pan avec limites respectées
- [ ] Sélection multiple fonctionnelle

### Tests & Documentation
- [ ] Tests unitaires composants critiques
- [ ] Tests interactions D3.js
- [ ] JSDoc pour fonctions publiques
- [ ] Types TypeScript documentés
- [ ] README à jour avec captures d'écran

### Déploiement
- [ ] Build Next.js sans warnings
- [ ] Pas de console.log en production
- [ ] Variables d'environnement configurées
- [ ] Performance Lighthouse > 90

---

## 🎯 Roadmap Développement - 3 Phases

### Phase 1 : Interface Utilisateur (Actuelle)
**Objectif** : Layout fonctionnel avec standards génétique médicale
- ✅ Structure Next.js + TypeScript
- 🔄 Layout 3 sections (navbar, sidebar, canvas)
- 🔄 Canvas D3.js avec grille et zoom/pan
- 🔄 **Moteur généalogique centralisé** : genealogy-engine.ts
- 🔄 **Rendu symboles médicaux** : carrés/cercles selon standards
- 🔄 **Algorithme positionnement** : calcul séquentiel sans croisements
- 🔄 Sidebar avec formulaires shadcn/ui
- 🔄 Navigation et sélection de base

### Phase 2 : Logique Arbre Généalogique  
**Objectif** : Génération d'arbres conformes standards médicaux
- ⏳ **Algorithme anti-croisement** : détection et résolution automatique
- ⏳ **Dimensionnement dynamique** : élargissement générations supérieures
- ⏳ **Connexions familiales** : couples horizontales, enfants centrés
- ⏳ **Validation génétique** : cohérence chronologique et biologique
- ⏳ Stores Zustand avec persistence
- ⏳ Import/export formats standards (GEDCOM)
- ⏳ Historique modifications (undo/redo)

### Phase 3 : Intégration et Optimisation
**Objectif** : Application production-ready médicale
- ⏳ **Performance optimisée** : >100 individus sans latence
- ⏳ **Conformité médicale** : Standards génétique internationale
- ⏳ **Accessibilité** : Usage consultation médicale
- ⏳ Tests complets moteur généalogique
- ⏳ Sécurité et confidentialité patient
- ⏳ Documentation standards médicaux
- ⏳ Déploiement et monitoring