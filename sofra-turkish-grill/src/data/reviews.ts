/**
 * Guest reviews.
 *
 * Only reviews already published on sofratg.com (attributed there to Google)
 * are used, quoted exactly as shown. Entries without `text` are hidden — paste
 * the full wording from the source to publish them. Never paraphrase, combine
 * or invent reviews, and confirm reuse with the owner before launch.
 */

export interface Review {
  author: string
  text?: string
  /** Star rating as displayed with the review on the source page. */
  rating: number
  source: 'Google'
}

export const reviews: Review[] = [
  {
    author: 'Gabriella E.',
    rating: 5,
    source: 'Google',
    text: 'A hidden gem! Recently opened up in the community and I was very eager to try Turkish food. Extremely delicious halal food as well as friendly and attentive service.',
  },
  {
    author: 'Fatima A.',
    rating: 5,
    source: 'Google',
    text: 'Best restaurant in Kent! Highly recommend if you are looking for some good Turkish food, especially the drinks. Also, the service was great!',
  },
  // Shown on sofratg.com, but the full text could not be retrieved while
  // building. Paste it verbatim from the homepage to publish.
  { author: 'Lisa G.', rating: 5, source: 'Google' },
  { author: 'Kenny W.', rating: 5, source: 'Google' },
]

export const publishedReviews = reviews.filter((r): r is Review & { text: string } => Boolean(r.text))
