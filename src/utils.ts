import * as cheerio from "cheerio"

export const stripHtml = (html: string, replacement = " ") =>
  (String(html) || "")
    .replace(/(<\/p><p>|&nbsp;)/g, " ") // replace line break and space first
    .replace(/(<([^>]+)>)/gi, replacement)

export const makeSummary = (html: string, length = 140) => {
  // buffer for search
  const buffer = 20

  // split on sentence breaks
  const sections = stripHtml(html, "")
    .replace(/([?!。？！]|(\.\s))\s*/g, "$1|")
    .split("|")

  // grow summary within buffer
  let summary = ""
  while (summary.length < length - buffer && sections.length > 0) {
    const el = sections.shift() || ""

    const addition =
      el.length + summary.length > length + buffer
        ? `${el.substring(0, length - summary.length)}...`
        : el

    summary = summary.concat(addition)
  }

  return summary
}

/**
 * Output clean HTML for IPFS
 */
export const outputCleanHTML = (html: string) => {
  /**
   * Note: enable `xmlMode` to remove default wrapper
   *
   * @see https://github.com/cheeriojs/cheerio/issues/1031#issuecomment-368307598
   */
  const $ = cheerio.load(html, { decodeEntities: false, xmlMode: true })

  // remove audio player
  $(".player").remove()

  return $.html()
}
