import { useCallback, useState } from 'react'
import { AppSidebar } from './Sidebar'
import { MainCanvas } from './MainCanvas'
import { useGenealogyCanvas } from '../../hooks/useGenealogyCanvas'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    svgRef,
    layout,
    exportSVG,
    zoomToFit
  } = useGenealogyCanvas()

  const handleImport = useCallback((file: File) => {
    console.log('Import de fichier:', file.name)
    // TODO: Implémenter l'import de fichier
  }, [])

  const handleExportSVG = useCallback(() => {
    const svg = exportSVG()
    if (svg) {
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'arbre-genealogique.svg'
      link.click()
      URL.revokeObjectURL(url)
    }
  }, [exportSVG])

  return (
    <div className="h-screen flex bg-background relative">
      {/* Bouton menu mobile */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        inset-y-0 left-0
        z-50 lg:z-auto
        transform lg:transform-none
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AppSidebar 
          onExportSVG={handleExportSVG}
          onImport={handleImport}
        />
      </div>
      
      {/* Canvas principal */}
      <div className="flex-1 lg:ml-0">
        <MainCanvas 
          svgRef={svgRef}
          layout={layout}
          zoomToFit={zoomToFit}
        />
      </div>
    </div>
  )
} 