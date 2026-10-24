/**
 * Sofra Turkish Grill — menu.
 *
 * Source: the restaurant's published food and drink menus
 *   https://sofratg.com/kent-sofra-turkish-grill-food-menu
 *   https://sofratg.com/kent-sofra-turkish-grill-drink-menu
 *
 * Names and prices are transcribed as published. No descriptions,
 * ingredients or dietary labels have been added — add them here only once the
 * owner supplies them (`description` is rendered automatically when present).
 * Delivery-app prices differ from the restaurant's own menu; confirm current
 * pricing with the owner before launch.
 */

export interface MenuVariant {
  label: string
  price: number
}

export interface MenuItem {
  name: string
  price?: number
  variants?: MenuVariant[]
  /** Short factual note, e.g. the options included. */
  note?: string
  /** Owner-approved description. Leave undefined rather than guessing. */
  description?: string
}

export interface MenuGroup {
  title?: string
  items: MenuItem[]
}

export interface MenuCategory {
  id: string
  title: string
  /** Turkish name of the course, shown as a subtitle. */
  turkish: string
  groups: MenuGroup[]
}

export const menu: MenuCategory[] = [
  {
    id: 'breakfast',
    title: 'Breakfast',
    turkish: 'Kahvaltı',
    groups: [
      {
        items: [
          { name: 'Menemen', price: 12 },
          { name: 'Cilbir Omelette', price: 13 },
          { name: 'Sucuklu Omelette', price: 15 },
          { name: 'Spinach Omelette', price: 12 },
          { name: 'Veggie Omelette', price: 12 },
        ],
      },
    ],
  },
  {
    id: 'appetizers',
    title: 'Appetizers',
    turkish: 'Mezeler',
    groups: [
      {
        items: [
          { name: '5 Appetizers Platter', price: 30 },
          { name: 'Labne', price: 8 },
          { name: 'Muhammara', price: 9 },
          { name: 'Beets Hummus', price: 8 },
          { name: 'Ezme', price: 8 },
          { name: 'Kisir', price: 8 },
          { name: 'Dolmas', price: 9 },
          { name: 'Borek', price: 5 },
          { name: 'Shakshouka', price: 9 },
          { name: 'Cauliflower', price: 8 },
          { name: 'Morkovcha', price: 9 },
          { name: 'Pickle Plate', price: 8 },
          { name: 'Garlic Fries', price: 8 },
          { name: 'Simit', price: 3.5 },
          { name: 'Pita Bread', price: 1.5 },
        ],
      },
    ],
  },
  {
    id: 'soups-salads',
    title: 'Soups & Salads',
    turkish: 'Çorba ve Salata',
    groups: [
      {
        items: [
          // CONFIRM: the published menu lists a single soup by cup or bowl.
          {
            name: 'Soup',
            variants: [
              { label: 'Cup', price: 7 },
              { label: 'Bowl', price: 10 },
            ],
          },
        ],
      },
      {
        title: 'Salads',
        items: [
          { name: 'Chicken Salad', price: 18 },
          { name: 'Lamb Salad', price: 21 },
          { name: 'Roasted Veggie Salad', price: 15 },
        ],
      },
    ],
  },
  {
    id: 'pide',
    title: 'Pide & Lahmacun',
    turkish: 'Pide ve Lahmacun',
    groups: [
      {
        items: [
          { name: 'Mix Meat Pide', price: 22 },
          { name: 'Kiymali Pide', price: 19 },
          { name: 'Sucuklu Egg Pide', price: 19 },
          { name: 'Chicken Pide', price: 18 },
          { name: 'Veggie Pide', price: 16 },
          { name: 'Cheese Pide', price: 15 },
          { name: 'Vegan Pide', price: 15 },
          { name: 'Lahmacun', price: 12 },
        ],
      },
    ],
  },
  {
    id: 'entrees',
    title: 'Entrées',
    turkish: 'Ana Yemekler',
    groups: [
      {
        items: [
          { name: 'Iskender Kebab', price: 24 },
          { name: 'Manti', price: 24 },
          { name: 'Lamb Chops', price: 33 },
          {
            name: 'Shashlik Kebab',
            variants: [
              { label: 'Chicken', price: 28 },
              { label: 'Beef', price: 35 },
              { label: 'Lamb', price: 35 },
            ],
          },
          {
            name: 'Beyti',
            variants: [
              { label: 'Chicken', price: 22 },
              { label: 'Doner', price: 22 },
              { label: 'Lamb', price: 24 },
            ],
          },
          {
            name: 'Ali Nazik',
            variants: [
              { label: 'Chicken', price: 23 },
              { label: 'Lamb', price: 25 },
              { label: 'Mixed', price: 30 },
            ],
          },
          { name: 'Beef Kofte', price: 24 },
          { name: 'Salmon', price: 28 },
          { name: 'Ribeye Steak', price: 40 },
        ],
      },
    ],
  },
  {
    id: 'durum',
    title: 'Dürüm',
    turkish: 'Dürüm',
    groups: [
      {
        items: [
          { name: 'Chicken Durum', price: 18 },
          { name: 'Doner Durum', price: 18 },
          { name: 'Lamb Durum', price: 20 },
          { name: 'Veg Durum', price: 15 },
        ],
      },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    turkish: 'Tatlılar',
    groups: [
      {
        items: [
          { name: 'Baklava', price: 10 },
          { name: 'Kunefe', price: 9 },
          { name: 'Sutlac', price: 8 },
        ],
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    turkish: 'İçecekler',
    groups: [
      {
        title: 'Hot',
        items: [
          { name: 'Turkish Coffee', price: 5 },
          { name: 'Turkish Black Tea', price: 3 },
          { name: 'Turkish Green Tea', price: 3 },
          { name: 'Teapot', price: 8 },
          { name: 'Latte', note: 'Vanilla or caramel', price: 5 },
        ],
      },
      {
        title: 'Cold',
        items: [
          { name: 'Ayran', price: 5 },
          { name: 'Mojito', price: 5 },
          { name: 'Fruit Mocktails', note: 'Mango, strawberry, pineapple, cherry or pomegranate', price: 5 },
          { name: 'Iced Coffee', price: 5 },
          { name: 'Gazoz', price: 4 },
          { name: 'Juice', note: 'Apple or orange', price: 4 },
          { name: 'Soft Drinks', note: 'Coke, Diet Coke or Sprite', price: 4 },
        ],
      },
    ],
  },
]

export const menuItems = (category: MenuCategory) => category.groups.flatMap((g) => g.items)

export function lowestPrice(item: MenuItem) {
  if (item.price !== undefined) return item.price
  return Math.min(...(item.variants ?? []).map((v) => v.price))
}

export function formatPrice(value: number) {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`
}

export function findItem(categoryId: string, name: string) {
  const category = menu.find((c) => c.id === categoryId)
  const item = category && menuItems(category).find((i) => i.name === name)
  if (!category || !item) throw new Error(`Menu item not found: ${categoryId} / ${name}`)
  return { category, item }
}
