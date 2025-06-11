import { useCallback } from 'react'
import { AppSidebar } from './Sidebar'
import { MainCanvas } from './MainCanvas'
import { useGenealogyCanvas } from '../../hooks/useGenealogyCanvas'

export function AppLayout() {
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
    <div className="h-screen flex bg-background">
      <AppSidebar 
        onExportSVG={handleExportSVG}
        onImport={handleImport}
      />
      
      <MainCanvas 
        svgRef={svgRef}
        layout={layout}
        zoomToFit={zoomToFit}
      />
    </div>
  )
} 