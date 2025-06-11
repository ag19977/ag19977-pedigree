# Arbre Généalogique Médical

Application web moderne pour la création et la gestion d'arbres généalogiques médicaux, conçue selon les standards génétiques.

## 🏗️ Architecture Optimisée

### **Store Zustand Centralisé** 
- **État global unique** : Toutes les données et actions centralisées
- **Mise à jour automatique** : Les modifications apparaissent instantanément
- **Code propre** : Plus de logs de debug, code simplifié

### **Composants Minimalistes**
- **AppLayout** : Layout principal épuré
- **Sidebar** : Interface de modification optimisée
- **MainCanvas** : Affichage fluide de l'arbre
- **Hook minimal** : `useGenealogyCanvas` ultra-simplifié

## 🚀 Fonctionnalités

### ✅ **Fonctionnalités Opérationnelles**
- 🎯 **Sélection d'individus** : Clic sur l'arbre pour sélectionner
- ⚡ **Modification temps réel** : Les changements apparaissent instantanément sur l'arbre
- 🔄 **Mise à jour automatique** : Plus besoin de cliquer sur "Mettre à jour" !
- 💾 **Sauvegarde automatique** : Les modifications sont persistées en temps réel
- 🎨 **Rendu fluide** : Utilise requestAnimationFrame pour des animations fluides
- 📊 **Symboles génétiques** : Respect des standards médicaux avec mise à jour automatique
- 📤 **Export SVG** : Téléchargement de l'arbre en format vectoriel

### 🎨 **Interface Utilisateur**
- Interface moderne avec shadcn/ui
- Thème sombre/clair adaptatif
- Interactions fluides (zoom, pan, sélection)
- Feedback visuel lors des modifications

## 🛠️ Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Zustand** - Gestion d'état moderne
- **D3.js** - Rendu des graphiques
- **Tailwind CSS** - Styling moderne
- **shadcn/ui** - Composants UI

## 📁 Structure du Projet

```
src/
├── stores/
│   └── genealogy-store.ts      # Store Zustand centralisé
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx       # Layout principal
│   │   ├── Sidebar.tsx         # Interface de modification
│   │   └── MainCanvas.tsx      # Canvas d'affichage
│   └── ui/                     # Composants UI réutilisables
├── hooks/
│   └── useGenealogyCanvas.ts   # Hook simplifié
├── types/
│   └── genealogy.ts           # Types TypeScript
├── utils/
│   ├── genealogy-engine.ts    # Moteur de calcul
│   ├── d3-renderer.ts         # Rendu D3.js
│   └── sample-data.ts         # Données d'exemple
└── pages/
    └── index.tsx              # Page principale
```

## 🔧 Développement

```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 🎯 Problèmes Résolus

### ✅ **Avant la Refactorisation**
- ❌ Modifications non sauvegardées
- ❌ Arbre non mis à jour après modifications  
- ❌ Perte des données lors du changement de sélection
- ❌ Architecture complexe et difficile à maintenir

### ✅ **Après la Refactorisation**
- ✅ **Sauvegarde automatique** : Toutes les modifications sont persistées
- ✅ **Synchronisation temps réel** : L'arbre se met à jour instantanément
- ✅ **Persistance des données** : Les modifications restent même après changement de sélection
- ✅ **Architecture propre** : Store centralisé, composants simplifiés
- ✅ **Code maintenable** : Logique centralisée, séparation des responsabilités

## 📚 Usage

1. **Sélection** : Cliquez sur un individu dans l'arbre
2. **Modification** : Utilisez la sidebar pour modifier les caractéristiques  
3. **Visualisation** : ⚡ **L'arbre se met à jour automatiquement** pendant que vous tapez !
4. **Export** : Téléchargez l'arbre en SVG
5. **Réinitialisation** : Bouton pour revenir aux données d'exemple

### 🎯 **Plus Besoin de Cliquer "Mettre à Jour" !**
- Tapez un nom → **Changement immédiat**
- Modifiez l'âge → **Mise à jour instantanée**  
- Changez un statut → **Arbre actualisé en temps réel**

## 🧬 Standards Génétiques

- **Carrés** : Individus masculins
- **Cercles** : Individus féminins  
- **Rempli** : Individu affecté par la condition
- **Vide** : Individu sain
- **Trait diagonal** : Individu décédé
- **Flèche** : Cas index (proband)
