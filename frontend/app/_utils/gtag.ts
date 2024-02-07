/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
export const GA_TAG_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export const IS_GATAG = GA_TAG_ID !== ''

export const pageview = (url: string) => {
  window.gtag('config', GA_TAG_ID!, {
    page_path: url,
  })
}
