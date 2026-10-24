/**
 * Photo slots.
 *
 * Every image on the site is a named slot. To fill one, add an
 * owner-authorized photo to `src/assets/photos/` named after the slot id
 * (e.g. `hero.jpg`, `dish-iskender.jpg`). The build resizes it and converts it
 * to AVIF / WebP / JPEG automatically.
 *
 * Until a photo is supplied, nothing on the site says so: dish slots fall back
 * to text-only menu layouts, supporting images are simply left out, and the
 * large atmospheric slots show a typographic art panel (`art`) in the brand
 * palette. The dev server logs which slots are still empty.
 *
 * Dish slots must only receive a photo that has been positively identified as
 * that dish. Review each `alt` text against the final photo.
 */

export type ArtTone = 'ember' | 'olive' | 'espresso' | 'sand'

export interface PhotoSlot {
  /** What the photo should show (for the team — never shown to visitors). */
  label: string
  alt: string
  /** object-position on desktop, and optionally a separate mobile crop. */
  position?: string
  mobilePosition?: string
  /** Palette for the art panel shown while no photo exists. */
  tone: ArtTone
  /** Optional Turkish word set in the art panel, with its English meaning. */
  art?: { word: string; meaning: string }
  /** Borrow another slot's photo when this one has not been supplied. */
  fallback?: SlotId
}

type SlotDefinition = Omit<PhotoSlot, 'fallback'> & { fallback?: string }

const slots = {
  hero: {
    label: 'The communal table spread',
    alt: 'A shared table of Turkish dishes at Sofra Turkish Grill in Kent',
    position: '50% 55%',
    mobilePosition: '58% 50%',
    tone: 'ember',
  },
  'welcome-main': {
    label: 'Dining room, warmly lit',
    alt: 'The dining room at Sofra Turkish Grill',
    tone: 'olive',
    art: { word: 'Hoş geldiniz', meaning: 'Welcome' },
  },
  'welcome-detail': {
    label: 'Turkish coffee or tea service',
    alt: 'Turkish coffee served at Sofra',
    tone: 'sand',
  },

  'dish-lamb-chops': { label: 'Lamb Chops', alt: 'Lamb Chops at Sofra Turkish Grill', tone: 'ember' },
  'dish-iskender': { label: 'Iskender Kebab', alt: 'Iskender Kebab at Sofra Turkish Grill', tone: 'espresso' },
  'dish-manti': { label: 'Manti', alt: 'Manti at Sofra Turkish Grill', tone: 'sand' },
  'dish-mix-meat-pide': { label: 'Mix Meat Pide', alt: 'Mix Meat Pide at Sofra Turkish Grill', tone: 'ember' },
  'dish-shashlik': { label: 'Shashlik Kebab', alt: 'Shashlik Kebab at Sofra Turkish Grill', tone: 'olive' },
  'dish-baklava': { label: 'Baklava', alt: 'Baklava at Sofra Turkish Grill', tone: 'sand' },

  'experience-grill': {
    label: 'Kebabs and shashlik on the grill',
    alt: 'Kebabs cooking on the grill at Sofra',
    tone: 'ember',
    art: { word: 'Ateş', meaning: 'Fire' },
    fallback: 'dish-shashlik',
  },
  'experience-pide': {
    label: 'Pide fresh from the oven',
    alt: 'Freshly baked pide at Sofra',
    tone: 'espresso',
    art: { word: 'Fırın', meaning: 'Oven' },
    fallback: 'dish-mix-meat-pide',
  },
  'experience-table': {
    label: 'Guests sharing a full table',
    alt: 'Guests sharing dishes around the table at Sofra',
    tone: 'olive',
    art: { word: 'Sofra', meaning: 'The table' },
    fallback: 'hero',
  },
  'experience-welcome': {
    label: 'Turkish tea and coffee',
    alt: 'Turkish tea and coffee at Sofra',
    tone: 'ember',
    art: { word: 'Çay', meaning: 'Tea' },
    fallback: 'welcome-detail',
  },

  'catering-main': {
    label: 'Catering spread for an event',
    alt: 'A Sofra catering spread prepared for an event',
    tone: 'espresso',
    art: { word: 'Afiyet olsun', meaning: 'Enjoy your meal' },
    fallback: 'hero',
  },
  'catering-detail': {
    label: 'Platter detail',
    alt: 'A platter from Sofra Turkish Grill',
    tone: 'sand',
    fallback: 'dish-mix-meat-pide',
  },

  'menu-hero': {
    label: 'Signature dishes from above',
    alt: 'Turkish dishes from the Sofra menu',
    tone: 'ember',
    fallback: 'hero',
  },
  'story-hero': {
    label: 'Restaurant interior',
    alt: 'Inside Sofra Turkish Grill in Kent, Washington',
    tone: 'espresso',
    fallback: 'welcome-main',
  },
  'story-kitchen': {
    label: 'In the kitchen',
    alt: 'Dishes being prepared in the Sofra kitchen',
    tone: 'ember',
    fallback: 'experience-grill',
  },
  'story-table': {
    label: 'A table set for sharing',
    alt: 'A table set with Turkish dishes at Sofra',
    tone: 'sand',
    fallback: 'experience-table',
  },
  'catering-hero': {
    label: 'Event or group celebration',
    alt: 'A group celebration with Sofra catering',
    tone: 'olive',
    fallback: 'catering-main',
  },
  'contact-hero': {
    label: 'Storefront or dining room',
    alt: 'Sofra Turkish Grill at 24228 104th Ave SE in Kent',
    tone: 'espresso',
    fallback: 'story-hero',
  },
} as const satisfies Record<string, SlotDefinition>

export type SlotId = keyof typeof slots

/** Typed view of the slots — also checks every `fallback` names a real slot. */
export const photoSlots: Record<SlotId, PhotoSlot> = slots
