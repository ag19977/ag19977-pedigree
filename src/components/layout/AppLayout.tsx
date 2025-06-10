import { AppSidebar } from './Sidebar'
import { MainCanvas } from './MainCanvas'

export function AppLayout() {
  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar - 20% de largeur avec footer intégré */}
      <AppSidebar />
      
      {/* Espace central pour le canvas - prend toute la hauteur */}
      <MainCanvas />
    </div>
  )
} 