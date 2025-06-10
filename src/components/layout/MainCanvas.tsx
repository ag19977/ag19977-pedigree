import { Navbar } from './Navbar'

export function MainCanvas() {
  return (
    <div className="flex-1 h-screen p-6">
      <div className="h-full bg-card border border-border shadow-sm rounded-lg relative overflow-hidden">
        {/* Grille de fond */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Navbar flottante */}
        <div className="absolute top-3 left-6 right-6 z-20">
          <Navbar />
        </div>
        
        {/* Contenu principal */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-medium text-foreground">Canvas Arbre Généalogique</h2>
            <p className="text-sm text-muted-foreground max-w-md">Zone de travail prête pour le développement</p>
          </div>
        </div>
      </div>
    </div>
  )
} 