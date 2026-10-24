import type { SlotId } from './media'
import { findItem } from './menu'

/**
 * Signature dishes featured on the home and menu pages. Each must exist on the
 * published menu; its photo slot is only shown once an authorized photo of
 * that exact dish has been added.
 */
export const signatures: { slot: SlotId; category: string; name: string }[] = [
  { slot: 'dish-lamb-chops', category: 'entrees', name: 'Lamb Chops' },
  { slot: 'dish-iskender', category: 'entrees', name: 'Iskender Kebab' },
  { slot: 'dish-manti', category: 'entrees', name: 'Manti' },
  { slot: 'dish-mix-meat-pide', category: 'pide', name: 'Mix Meat Pide' },
  { slot: 'dish-shashlik', category: 'entrees', name: 'Shashlik Kebab' },
  { slot: 'dish-baklava', category: 'desserts', name: 'Baklava' },
]

export const signatureDishes = () =>
  signatures.map((dish) => ({ ...dish, ...findItem(dish.category, dish.name) }))

export const isSignature = (categoryId: string, name: string) =>
  signatures.some((dish) => dish.category === categoryId && dish.name === name)
