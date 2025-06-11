# Sidebar Moderne - Arbre Généalogique Médical

## 🎯 Vue d'ensemble

La barre latérale a été complètement refactorisée avec des accordéons shadcn/ui pour offrir une interface moderne et organisée en trois sections principales.

## 🏗️ Architecture de la Sidebar

### Structure des Sections

```
📱 Sidebar (320px)
├── 📋 Header
│   └── Titre + Description
├── 🎛️ Accordéons (3 sections)
│   ├── 👤 Individu
│   ├── 🌳 Arbre Généalogique  
│   └── ⚙️ Configuration
└── 📄 Footer
```

## 👤 **Section 1 : Individu**

### Fonctionnalités
- **Affichage dynamique** de l'individu sélectionné
- **Carte détaillée** avec toutes les informations médicales
- **États visuels** : Badge "Cas index", couleurs statut médical
- **Bouton d'édition** pour modifier les informations

### Interface Quand Sélectionné
```
┌─────────────────────────────────┐
│ □ Jean Martin [Cas index]       │
│ Martin • 45 ans                 │
├─────────────────────────────────│
│ Genre: Masculin  │ Statut: Sain │
├─────────────────────────────────│
│ ♥ Vivant                        │
│ 📅 01/01/1978                   │ 
│ 👥 Génération 1                 │
├─────────────────────────────────│
│ [Modifier les informations]     │
└─────────────────────────────────┘
```

### Interface Quand Vide
```
┌─────────────────────────────────┐
│        👤 (icône fade)          │
│   Aucun individu sélectionné    │
│ Cliquez sur un symbole dans     │
│           l'arbre               │
└─────────────────────────────────┘
```

## 🌳 **Section 2 : Arbre Généalogique**

### Sous-sections

#### 🎯 **Arbres Prédéfinis**
- Dropdown avec modèles médicaux standards :
  - Famille simple (2+3)
  - Famille étendue (3 générations)
  - Arbre complexe
  - Maladie génétique

#### ⚡ **Actions Rapides**
- **Recalculer l'arbre** : Force nouveau calcul layout
- **Exporter SVG** : Génération fichier vectoriel
- **Importer un arbre** : Support .json, .ged, .csv

#### 📊 **Statistiques Live**
```
┌─────────────┬─────────────┐
│      5      │      2      │
│  Individus  │ Générations │
└─────────────┴─────────────┘
```

## ⚙️ **Section 3 : Configuration**

### 🖥️ **Affichage**
- **Grille de fond** : Toggle switch
- **Noms des individus** : Toggle switch  
- **Âges** : Toggle switch

### 📐 **Mise en Page**
- **Taille des symboles** : Petit / Moyen / Grand
- **Espacement** : Compact / Normal / Spacieux

### 📥 **Export Avancé**
- **Export PDF** : Pour dossiers médicaux
- **Export GEDCOM** : Standard généalogique international

## 🎨 Design System Utilisé

### Composants shadcn/ui
```typescript
// Accordéon principal
<Accordion type="multiple" defaultValue={["individual"]}>
  <AccordionItem value="individual">
    <AccordionTrigger>
      <User className="h-4 w-4" />
      Individu
    </AccordionTrigger>
    <AccordionContent>
      // Contenu...
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Composants Utilisés
- ✅ `Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent`
- ✅ `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent`
- ✅ `Button` (variants: outline, destructive)
- ✅ `Badge` (variants: secondary, destructive)
- ✅ `Select` / `SelectTrigger` / `SelectValue` / `SelectContent` / `SelectItem`
- ✅ `Switch` pour les toggles
- ✅ `Label` pour les formulaires
- ✅ `Separator` pour les divisions visuelles

### Icônes Lucide React
```typescript
import {
  User,        // Individu
  TreePine,    // Arbre généalogique
  Settings,    // Configuration
  Download,    // Export
  Upload,      // Import
  RefreshCw,   // Recalcul
  Trees,       // Header
  Users,       // Génération
  Heart,       // Statut vital
  Calendar,    // Date naissance
} from 'lucide-react'
```

## 🔄 Communication avec MainCanvas

### Props Interface
```typescript
interface AppSidebarProps {
  selectedIndividual?: Individual | null
  onUpdateLayout?: () => void
  onExportSVG?: () => void
  onImport?: (file: File) => void
  isLoading?: boolean
  layout?: TreeLayout
}
```

### État Partagé (AppLayout)
```typescript
// State géré au niveau AppLayout
const [selectedIndividual, setSelectedIndividual] = useState<Individual | null>(null)

// Hook généalogique centralisé
const { svgRef, layout, updateLayout, exportSVG, zoomToFit } = useGenealogyCanvas({
  onIndividualClick: setSelectedIndividual
})

// Props passées aux composants
<AppSidebar 
  selectedIndividual={selectedIndividual}
  onUpdateLayout={updateLayout}
  onExportSVG={handleExportSVG}
  layout={layout}
/>

<MainCanvas 
  svgRef={svgRef}
  layout={layout}
  zoomToFit={zoomToFit}
/>
```

## 🎯 Amélioration UX

### ✅ **Réalisé**
- Interface moderne avec accordéons collapsables
- Section Individu ouverte par défaut  
- Badges visuels pour statuts médicaux
- Statistiques en temps réel
- Actions centralisées dans sidebar
- Design cohérent avec shadcn/ui

### ✅ **Fonctionnalités Transférées**
- ✅ Informations individu sélectionné (MainCanvas → Sidebar)
- ✅ Boutons d'action (MainCanvas → Sidebar)
- ✅ Statistiques arbres (MainCanvas → Sidebar)
- ✅ Contrôles export/import (MainCanvas → Sidebar)

### ✅ **Conservé dans MainCanvas**
- ✅ Nombre d'individus et générations (coin bas-gauche)
- ✅ Coordonnées et zoom (coin bas-droite)
- ✅ Bouton "Zoom ajusté" simplifié (coin haut-droite)
- ✅ Instructions navigation (molette, clic-glisser)

## 📱 Responsive Design

### Largeur Fixe Optimisée
- **Min-width** : 280px (mobile)
- **Max-width** : 320px (desktop)
- **Default** : 20% de l'écran
- **Overflow** : Scroll vertical automatique

### Adaptation Mobile Future
```css
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
```

## 🚀 Évolutions Futures

### Phase 1 : Fonctionnalités Core
- ✅ Interface accordéon moderne
- ✅ Communication MainCanvas ↔ Sidebar
- ✅ Actions centralisées

### Phase 2 : Interactivité Avancée
- 🔄 Édition inline des individus
- 🔄 Glisser-déposer pour réorganiser
- 🔄 Validation temps réel
- 🔄 Undo/Redo avec historique

### Phase 3 : Features Médicales
- 🔄 Templates pathologies génétiques
- 🔄 Import/Export GEDCOM fonctionnel
- 🔄 Export PDF avec mise en page médicale
- 🔄 Configurations sauvegardées

## 💡 Code Exemple d'Usage

### Utilisation de la Sidebar
```typescript
// Dans AppLayout.tsx
<AppSidebar 
  selectedIndividual={selectedIndividual}
  onUpdateLayout={() => {
    // Recalcul de l'arbre
    updateLayout()
  }}
  onExportSVG={() => {
    // Export SVG avec téléchargement
    const svg = exportSVG()
    downloadFile(svg, 'arbre-genealogique.svg')
  }}
  onImport={(file) => {
    // Import de fichier .json/.ged/.csv
    parseGenealogyFile(file).then(setFamilyData)
  }}
  isLoading={isCalculating}
  layout={currentLayout}
/>
```

### Personnalisation Thème
```typescript
// Variables CSS custom pour adapter au thème médical
:root {
  --sidebar-bg: hsl(210 40% 98%);
  --sidebar-border: hsl(214.3 31.8% 91.4%);
  --medical-affected: hsl(0 72% 51%);
  --medical-healthy: hsl(142 71% 45%);
}
```

La sidebar est maintenant moderne, fonctionnelle et prête pour l'usage médical ! 🏥✨ 