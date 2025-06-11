import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Individual, Couple, TreeLayout, ValidationResult } from '../types/genealogy'
import { SAMPLE_FAMILY } from '../utils/sample-data'
import { GenealogyEngine } from '../utils/genealogy-engine'
import { D3GenealogyRenderer } from '../utils/d3-renderer'

// Types pour le store
interface GenealogyState {
  // ===== État principal =====
  individuals: Individual[]
  couples: Couple[]
  selectedIndividualId: string | null
  
  // ===== État de l'interface =====
  layout: TreeLayout | null
  validation: ValidationResult | null
  isLoading: boolean
  error: string | null
  
  // ===== Moteur et rendu =====
  engine: GenealogyEngine | null
  renderer: D3GenealogyRenderer | null
  svgElement: SVGSVGElement | null
  
  // ===== Auto-update =====
  autoUpdateEnabled: boolean
}

interface GenealogyActions {
  // ===== Actions de base =====
  initializeEngine: (svgElement: SVGSVGElement) => void
  resetToSampleData: () => void
  
  // ===== Gestion des individus =====
  selectIndividual: (individualId: string | null) => void
  getSelectedIndividual: () => Individual | null
  updateIndividual: (individualId: string, updates: Partial<Individual>) => void
  updateIndividualField: <K extends keyof Individual>(individualId: string, field: K, value: Individual[K]) => void
  updateIndividualMedicalStatus: <K extends keyof Individual['medicalStatus']>(individualId: string, field: K, value: Individual['medicalStatus'][K]) => void
  
  // ===== Rendu et layout =====
  updateLayout: () => void
  exportSVG: () => string
  zoomToFit: () => void
  
  // ===== Gestion d'état =====
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // ===== Utilitaires =====
  getIndividualById: (id: string) => Individual | undefined
  cleanup: () => void
}

type GenealogyStore = GenealogyState & GenealogyActions

// Store Zustand refactorisé avec auto-update
const useGenealogyStore = create<GenealogyStore>()(
  devtools(
    (set, get) => ({
      // ===== État initial =====
      individuals: SAMPLE_FAMILY.individuals,
      couples: SAMPLE_FAMILY.couples,
      selectedIndividualId: null,
      layout: null,
      validation: null,
      isLoading: false,
      error: null,
      engine: null,
      renderer: null,
      svgElement: null,
      autoUpdateEnabled: true,

      // ===== Initialisation =====
      initializeEngine: (svgElement: SVGSVGElement) => {
        try {
          const engine = new GenealogyEngine()
          const renderer = new D3GenealogyRenderer()
          
          renderer.initialize(svgElement)
          
          set({ 
            engine, 
            renderer, 
            svgElement,
            error: null 
          })
          
          get().updateLayout()
          
        } catch (error) {
          set({ error: `Erreur d'initialisation: ${error}` })
        }
      },

      resetToSampleData: () => {
        set({
          individuals: SAMPLE_FAMILY.individuals,
          couples: SAMPLE_FAMILY.couples,
          selectedIndividualId: null,
          layout: null,
          validation: null,
          error: null
        })
        get().updateLayout()
      },

      // ===== Gestion des individus =====
      selectIndividual: (individualId: string | null) => {
        set({ selectedIndividualId: individualId })
      },

      getSelectedIndividual: () => {
        const { selectedIndividualId, individuals } = get()
        if (!selectedIndividualId) return null
        return individuals.find(ind => ind.id === selectedIndividualId) || null
      },

      updateIndividual: (individualId: string, updates: Partial<Individual>) => {
        const { individuals, engine, autoUpdateEnabled } = get()
        
        const updatedIndividuals = individuals.map(individual => {
          if (individual.id === individualId) {
            const updated = { ...individual, ...updates }
            
            if (engine) {
              updated.layout = {
                ...updated.layout,
                symbol: engine.generateGeneticSymbol(updated)
              }
            }
            
            return updated
          }
          return individual
        })
        
        set({ individuals: updatedIndividuals })
        
        if (autoUpdateEnabled) {
          requestAnimationFrame(() => {
            get().updateLayout()
          })
        }
      },

      updateIndividualField: <K extends keyof Individual>(individualId: string, field: K, value: Individual[K]) => {
        get().updateIndividual(individualId, { [field]: value } as Partial<Individual>)
      },

      updateIndividualMedicalStatus: <K extends keyof Individual['medicalStatus']>(individualId: string, field: K, value: Individual['medicalStatus'][K]) => {
        const individual = get().getIndividualById(individualId)
        if (!individual) return
        
        const newMedicalStatus = {
          ...individual.medicalStatus,
          [field]: value
        }
        
        get().updateIndividual(individualId, { medicalStatus: newMedicalStatus })
      },

      // ===== Rendu et layout =====
      updateLayout: () => {
        const { engine, renderer, individuals, couples } = get()
        
        if (!engine || !renderer) return

        set({ error: null })

        try {
          const validation = engine.validateGeneticConsistency(individuals)
          
          const individualsWithSymbols = individuals.map(individual => ({
            ...individual,
            layout: {
              ...individual.layout,
              symbol: engine.generateGeneticSymbol(individual)
            }
          }))

          const layout = engine.calculateTreeLayout(individualsWithSymbols, { couples })

          renderer.render(layout, (individual: Individual) => {
            get().selectIndividual(individual.id)
          })

          set({ 
            layout, 
            validation,
            individuals: individualsWithSymbols
          })

        } catch (error) {
          set({ error: `Erreur de layout: ${error}` })
        }
      },

      exportSVG: () => {
        const { renderer } = get()
        return renderer ? renderer.exportSVG() : ''
      },

      zoomToFit: () => {
        const { renderer, layout } = get()
        if (renderer && layout) {
          renderer.zoomToRegion(layout.bounds, 20)
        }
      },

      // ===== Gestion d'état =====
      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      // ===== Utilitaires =====
      getIndividualById: (id: string) => {
        return get().individuals.find(individual => individual.id === id)
      },

      cleanup: () => {
        const { renderer } = get()
        if (renderer) {
          renderer.cleanup()
        }
        set({
          engine: null,
          renderer: null,
          svgElement: null,
          layout: null
        })
      }
    }),
    {
      name: 'genealogy-store',
      partialize: (state: GenealogyStore) => ({
        individualsCount: state.individuals.length,
        selectedIndividualId: state.selectedIndividualId,
        isLoading: state.isLoading,
        error: state.error
      })
    }
  )
)

export default useGenealogyStore