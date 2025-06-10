# Arbre Généalogique Médical

Application web moderne pour la création et la gestion d'arbres généalogiques médicaux, conçue spécifiquement pour les professionnels de santé.

## 🎯 Fonctionnalités

- Interface moderne et épurée inspirée d'Anthropic/Claude
- Création d'arbres généalogiques avec symboles médicaux standards
- Visualisation SVG interactive avec D3.js
- Gestion des données médicales familiales
- Export/Import des données

## 🛠️ Technologies

- **Frontend** : Next.js 14+, TypeScript, Tailwind CSS
- **UI Components** : shadcn/ui
- **Visualisation** : D3.js
- **State Management** : Zustand
- **Styling** : Tailwind CSS

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 📝 Structure du Projet

```
src/
├── components/
│   ├── layout/       # Composants de mise en page
│   └── ui/          # Composants UI réutilisables
├── hooks/           # Custom React hooks
├── lib/            # Utilitaires et configurations
├── pages/          # Pages Next.js
└── styles/         # Styles globaux
```

## 🎨 Design

L'interface est conçue avec une approche minimaliste et professionnelle :
- Sidebar de configuration (20% de largeur)
- Canvas central pour la visualisation
- Navbar flottante avec contrôles
- Design adaptatif et moderne

## 📄 License

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
