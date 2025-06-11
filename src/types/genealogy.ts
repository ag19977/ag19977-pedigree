// Types fondamentaux pour arbre généalogique médical selon standards génétique

export type Gender = 'male' | 'female' | 'unknown'
export type HealthStatus = 'healthy' | 'affected' | 'unknown'
export type LifeStatus = 'alive' | 'deceased' | 'unknown'

// Symbole génétique selon standards médicaux
export interface GeneticSymbol {
  shape: 'square' | 'circle'  // Carré = Homme, Cercle = Femme
  fill: 'empty' | 'filled'    // Vide = sain, Plein = affecté
  status: LifeStatus          // Vivant ou décédé (trait diagonal si décédé)
}

// Position 2D pour le canvas
export interface Position {
  x: number
  y: number
}

// Individu dans l'arbre généalogique
export interface Individual {
  id: string
  firstName: string
  lastName?: string
  birthDate?: Date
  age?: number
  gender: Gender
  
  // Statut médical selon standards génétique
  medicalStatus: {
    healthStatus: HealthStatus  // Affecté par condition étudiée
    lifeStatus: LifeStatus      // Statut vital
    isProband?: boolean         // Cas index (patient consultant)
  }
  
  // Position calculée par l'algorithme
  layout: {
    generation: number                  // Niveau générationnel (0 = plus ancienne)
    position: Position                  // Position absolue sur canvas
    symbol: GeneticSymbol              // Symbole à afficher
    size: number                       // Taille du symbole
  }
  
  // Relations familiales
  relationships: {
    spouseId?: string                  // Conjoint
    parentIds: string[]                // Parents (max 2)
    childrenIds: string[]              // Enfants
    siblingIds: string[]               // Fratrie
  }
}

// Couple - Unité de base pour calcul positions
export interface Couple {
  id: string
  individual1Id: string
  individual2Id: string
  marriageDate?: Date
  divorced?: boolean
  
  // Layout spécifique couple
  layout: {
    generation: number
    centerPosition: Position
    connectionLine: {
      start: Position
      end: Position
    }
    childrenConnection?: {
      dropPoint: Position              // Point de descente vers enfants
      bridgeWidth?: number             // Largeur barre fratrie si plusieurs enfants
    }
  }
  
  childrenIds: string[]                // IDs des enfants
}

// Génération - Regroupement par niveau
export interface Generation {
  level: number                        // 0 = plus ancienne génération
  individuals: Individual[]
  couples: Couple[]
  
  // Calculs de layout
  layout: {
    yPosition: number                  // Position Y fixe pour toute la génération
    totalWidth: number                 // Largeur totale nécessaire
    spacing: {
      betweenIndividuals: number
      betweenCouples: number
    }
  }
}

// Connexion familiale entre individus
export interface FamilyConnection {
  id: string
  type: 'marriage' | 'parent_child' | 'sibling_bridge'
  fromId: string
  toId: string | string[]  // string[] pour barre fratrie
  
  // Géométrie de la connexion
  path: {
    points: Position[]
    style: {
      stroke: string
      strokeWidth: number
      strokeDasharray?: string
    }
  }
}

// Layout complet de l'arbre
export interface TreeLayout {
  generations: Generation[]
  connections: FamilyConnection[]
  canvasSize: {
    width: number
    height: number
  }
  bounds: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
}

// Résultat de validation génétique
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Configuration du moteur généalogique
export interface GenealogyConfig {
  canvas: {
    width: number
    height: number
    padding: number
  }
  
  symbols: {
    size: number              // Taille des symboles (carrés/cercles)
    strokeWidth: number       // Épaisseur des bordures
    spacing: number           // Espacement minimum entre symboles
  }
  
  generations: {
    verticalSpacing: number   // Espacement vertical entre générations
    horizontalSpacing: number // Espacement horizontal dans une génération
  }
  
  connections: {
    strokeWidth: number       // Épaisseur des lignes de connexion
    marriageLineLength: number // Longueur ligne de mariage
    childConnectionOffset: number // Offset pour connexions enfants
  }
}

// Constantes par défaut
export const DEFAULT_CONFIG: GenealogyConfig = {
  canvas: {
    width: 1200,
    height: 800,
    padding: 50
  },
  
  symbols: {
    size: 40,
    strokeWidth: 2,
    spacing: 80
  },
  
  generations: {
    verticalSpacing: 120,
    horizontalSpacing: 100
  },
  
  connections: {
    strokeWidth: 2,
    marriageLineLength: 60,
    childConnectionOffset: 20
  }
} 