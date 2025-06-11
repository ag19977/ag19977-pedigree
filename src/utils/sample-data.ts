import { Individual, Couple } from '../types/genealogy'

/**
 * Données d'exemple pour tester l'arbre généalogique
 * Famille simple : 2 parents et 3 enfants
 */

// Génération des IDs uniques (pour usage futur)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateId = () => Math.random().toString(36).substr(2, 9)

// Parents (Génération 0)
const father: Individual = {
  id: 'father-001',
  firstName: 'Jean',
  lastName: 'Martin',
  age: 45,
  gender: 'male',
  medicalStatus: {
    healthStatus: 'healthy',
    lifeStatus: 'alive',
    isProband: false
  },
  layout: {
    generation: 0,
    position: { x: 0, y: 0 }, // Sera calculé automatiquement
    symbol: {
      shape: 'square',
      fill: 'empty',
      status: 'alive'
    },
    size: 40
  },
  relationships: {
    spouseId: 'mother-001',
    parentIds: [],
    childrenIds: ['child-001', 'child-002', 'child-003'],
    siblingIds: []
  }
}

const mother: Individual = {
  id: 'mother-001',
  firstName: 'Marie',
  lastName: 'Martin',
  age: 42,
  gender: 'female',
  medicalStatus: {
    healthStatus: 'affected',  // Affectée par la condition étudiée
    lifeStatus: 'alive',
    isProband: true  // Cas index - patiente qui consulte
  },
  layout: {
    generation: 0,
    position: { x: 0, y: 0 }, // Sera calculé automatiquement
    symbol: {
      shape: 'circle',
      fill: 'filled',  // Rempli car affectée
      status: 'alive'
    },
    size: 40
  },
  relationships: {
    spouseId: 'father-001',
    parentIds: [],
    childrenIds: ['child-001', 'child-002', 'child-003'],
    siblingIds: []
  }
}

// Enfants (Génération 1)
const child1: Individual = {
  id: 'child-001',
  firstName: 'Paul',
  lastName: 'Martin',
  age: 18,
  gender: 'male',
  medicalStatus: {
    healthStatus: 'healthy',
    lifeStatus: 'alive',
    isProband: false
  },
  layout: {
    generation: 1,
    position: { x: 0, y: 0 }, // Sera calculé automatiquement
    symbol: {
      shape: 'square',
      fill: 'empty',
      status: 'alive'
    },
    size: 40
  },
  relationships: {
    parentIds: ['father-001', 'mother-001'],
    childrenIds: [],
    siblingIds: ['child-002', 'child-003']
  }
}

const child2: Individual = {
  id: 'child-002',
  firstName: 'Sophie',
  lastName: 'Martin',
  age: 15,
  gender: 'female',
  medicalStatus: {
    healthStatus: 'affected',  // Affectée comme sa mère
    lifeStatus: 'alive',
    isProband: false
  },
  layout: {
    generation: 1,
    position: { x: 0, y: 0 }, // Sera calculé automatiquement
    symbol: {
      shape: 'circle',
      fill: 'filled',  // Rempli car affectée
      status: 'alive'
    },
    size: 40
  },
  relationships: {
    parentIds: ['father-001', 'mother-001'],
    childrenIds: [],
    siblingIds: ['child-001', 'child-003']
  }
}

const child3: Individual = {
  id: 'child-003',
  firstName: 'Lucas',
  lastName: 'Martin',
  age: 12,
  gender: 'male',
  medicalStatus: {
    healthStatus: 'healthy',
    lifeStatus: 'alive',
    isProband: false
  },
  layout: {
    generation: 1,
    position: { x: 0, y: 0 }, // Sera calculé automatiquement
    symbol: {
      shape: 'square',
      fill: 'empty',
      status: 'alive'
    },
    size: 40
  },
  relationships: {
    parentIds: ['father-001', 'mother-001'],
    childrenIds: [],
    siblingIds: ['child-001', 'child-002']
  }
}

// Couple parents
const parentCouple: Couple = {
  id: 'couple-001',
  individual1Id: 'father-001',
  individual2Id: 'mother-001',
  childrenIds: ['child-001', 'child-002', 'child-003'],
  layout: {
    generation: 0,
    centerPosition: { x: 0, y: 0 }, // Sera calculé automatiquement
    connectionLine: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    }
  }
}

// Export des données d'exemple
export const SAMPLE_FAMILY = {
  individuals: [father, mother, child1, child2, child3],
  couples: [parentCouple]
}

/**
 * Famille étendue avec grands-parents pour tests plus complexes
 */

// Grands-parents paternels
const paternalGrandfather: Individual = {
  id: 'pgf-001',
  firstName: 'Pierre',
  lastName: 'Martin',
  age: 75,
  gender: 'male',
  medicalStatus: {
    healthStatus: 'healthy',
    lifeStatus: 'deceased'  // Décédé
  },
  layout: {
    generation: -1,  // Génération antérieure
    position: { x: 0, y: 0 },
    symbol: {
      shape: 'square',
      fill: 'empty',
      status: 'deceased'  // Trait diagonal
    },
    size: 40
  },
  relationships: {
    spouseId: 'pgm-001',
    parentIds: [],
    childrenIds: ['father-001'],
    siblingIds: []
  }
}

const paternalGrandmother: Individual = {
  id: 'pgm-001',
  firstName: 'Jeanne',
  lastName: 'Martin',
  age: 72,
  gender: 'female',
  medicalStatus: {
    healthStatus: 'affected',
    lifeStatus: 'alive'
  },
  layout: {
    generation: -1,
    position: { x: 0, y: 0 },
    symbol: {
      shape: 'circle',
      fill: 'filled',
      status: 'alive'
    },
    size: 40
  },
  relationships: {
    spouseId: 'pgf-001',
    parentIds: [],
    childrenIds: ['father-001'],
    siblingIds: []
  }
}

// Couple grands-parents paternels
const paternalGrandparentsCouple: Couple = {
  id: 'couple-pgp-001',
  individual1Id: 'pgf-001',
  individual2Id: 'pgm-001',
  childrenIds: ['father-001'],
  layout: {
    generation: -1,
    centerPosition: { x: 0, y: 0 },
    connectionLine: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    }
  }
}

// Mise à jour du père pour inclure ses parents
const fatherExtended: Individual = {
  ...father,
  relationships: {
    ...father.relationships,
    parentIds: ['pgf-001', 'pgm-001']
  }
}

// Export de la famille étendue
export const EXTENDED_FAMILY = {
  individuals: [paternalGrandfather, paternalGrandmother, fatherExtended, mother, child1, child2, child3],
  couples: [paternalGrandparentsCouple, parentCouple]
}

// Utilitaire pour valider la cohérence des relations
export function validateFamilyData(family: { individuals: Individual[], couples: Couple[] }): string[] {
  const errors: string[] = []
  const individualIds = new Set(family.individuals.map(i => i.id))

  // Vérification des relations
  for (const individual of family.individuals) {
    // Vérification des parents
    for (const parentId of individual.relationships.parentIds) {
      if (!individualIds.has(parentId)) {
        errors.push(`Parent ${parentId} introuvable pour ${individual.firstName}`)
      }
    }

    // Vérification des enfants
    for (const childId of individual.relationships.childrenIds) {
      if (!individualIds.has(childId)) {
        errors.push(`Enfant ${childId} introuvable pour ${individual.firstName}`)
      }
    }

    // Vérification du conjoint
    if (individual.relationships.spouseId && !individualIds.has(individual.relationships.spouseId)) {
      errors.push(`Conjoint ${individual.relationships.spouseId} introuvable pour ${individual.firstName}`)
    }
  }

  // Vérification des couples
  for (const couple of family.couples) {
    if (!individualIds.has(couple.individual1Id)) {
      errors.push(`Individu 1 ${couple.individual1Id} introuvable dans le couple ${couple.id}`)
    }
    if (!individualIds.has(couple.individual2Id)) {
      errors.push(`Individu 2 ${couple.individual2Id} introuvable dans le couple ${couple.id}`)
    }
  }

  return errors
} 