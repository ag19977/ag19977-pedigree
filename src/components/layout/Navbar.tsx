export function Navbar() {
  return (
    <nav className="h-12 border border-border/30 bg-background/90 backdrop-blur-md rounded-2xl shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo/Titre épuré */}
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-sm font-medium text-foreground tracking-wide">
            Arbre Généalogique
          </h1>
        </div>

        {/* Espace pour les boutons de fonctionnalités */}
        <div className="flex items-center space-x-3">
          {/* Espace pour futurs boutons */}
        </div>
      </div>
    </nav>
  )
} 