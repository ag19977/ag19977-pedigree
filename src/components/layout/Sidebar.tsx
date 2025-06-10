import { Footer } from './Footer'

export function AppSidebar() {
  return (
    <div className="w-1/5 min-w-[280px] max-w-[320px] h-screen flex flex-col border-r border-border/30 bg-background/50">
      {/* Contenu principal */}
      <div className="p-8 flex-1">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-foreground">Panneau</h2>
            <p className="text-sm text-muted-foreground">Configuration de l'arbre</p>
          </div>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Contenu à développer</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
} 