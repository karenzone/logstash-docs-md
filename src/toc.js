import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fromHtml } from 'hast-util-from-html'
import { visit } from 'unist-util-visit'
import { find } from 'unist-util-find'
import { remove } from 'unist-util-remove'
import { fileFilterRegex, getTypeInfo } from './util.js'
import yaml from 'yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Get the contents of the toc.html file and process it
 * into a JSON object where each item includes the
 * `old_file` (HTML file) name, the `file` (Markdown file),
 * the `navigation_title`, and any children (who also have
 * the same information).
 */
function getToc(file, filter) {
  /** If we only want some pages, create a regex to filter pages */
  const filterRegex = filter && fileFilterRegex(filter)
  /** Get the contents of the toc.html field */
  const tocHtml = fs.readFileSync(file, 'utf-8')
  /** Parse into an abstract syntax tree */
  const tree = fromHtml(tocHtml)
  /** Get the first unordered list */
  const list = find(tree, { tagName: 'ul' })
  /** Remove empty text nodes */
  remove(list, (node) => {
    return node.type === 'text' && /^\n+$/m.test(node.value)
  })
  /** Walk the tree to process each list item */
  visit(list, { tagName: 'li' }, (node) => {
    /** Get rid of position info because we won't need it */
    delete node.position
    /** Go through all the children of list items */
    node.children = node.children.filter(child => {
      /** Process the content of each list item */
      if (child.tagName === 'span') {
        /** Get rid of more properties we don't need */
        cleanProperties(node)
        /** Get the link inside this list item */
        const href = find(child, { tagName: 'a' })?.properties.href
        /** If we have a file filter, filter out pages we don't need */
        if (!href || (filterRegex && !filterRegex.test(href))) {
          node = undefined
          return
        }
        /** Create the new filename */
        const basename = path.basename(href, '.html')
        const newFilename = `${basename.replace(/\./g, '-')}.md`
        /**
         * Define all the properties we're actually going to use
         * in the list item
         */
        node.old_file = href
        node.file = newFilename
        node.navigation_title = find(child, { type: 'text' }).value
        return
      } else if (child.tagName === 'ul') {
        /**
         * For lists inside another list, get rid of properties
         * we don't need, but otherwise leave them alone
         * since we'll process the individual items inside
         * the nested list in the logic above
         */
        cleanProperties(child)
        return child
      }
    })
    /** Get rid of children when we've cleared out the array */
    if (node?.children?.length === 0) delete node.children
  })
  /**
   * Go through the modified list again, and clean up the
   * nested items that are left over from `ul`s and `li`s.
   */
  visit(list, (node) => {
    if (node.children?.length === 1) {
      node.children = node.children[0].children
    }
  })
  /**
   * Filter out items that don't have a `file`.
   */
  visit(list, (node) => {
    node.children = node.children?.filter(ch => {
      return ch.file
    })
  })
  return list
}

/** Properties we're not going to use */
function cleanProperties(node) {
  delete node.type
  delete node.tagName
  delete node.properties
  delete node.position
  return node
}

/**
 * Build the `toc.yml` file based on the `toc.html` file
 */
function buildToc(type) {
  const { bookId, fileFilter } = getTypeInfo(type)
  const dir = path.resolve(__dirname, process.cwd())
  const tocFile = path.join(dir, 'temp', 'built-docs', 'raw', 'en', bookId, 'current', 'toc.html')
  const destDir = path.join(dir, 'docs', type)
  /** Turn the HTML into JSON */
  let tocJson = getToc(tocFile, fileFilter)
  /**
   * Go through each item and remove the information
   * we don't need in the toc.yml file
   */
  visit(tocJson, (node) => {
    delete node.navigation_title
    delete node.old_file
  })
  /** Add the index to the beginning of the toc */
  tocJson.children.unshift({ file: 'index.md' })
  /** Add the manually written value-types file to the end of the toc */
  if (type === 'lsr') tocJson.children.push({ file: 'value-types.md' })
  /** Format the JSON correctly */
  tocJson = { 'toc': tocJson.children }
  /** Turn the JSON into YAML */
  const tocYml = yaml.stringify(tocJson)
  /** Create the new `toc.yml` file */
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    const newTocFilepath = path.join(destDir, 'toc.yml')
  fs.writeFileSync(newTocFilepath, tocYml)

  console.log(`Created ${destDir}/toc.yml`)
}

export { getToc, buildToc }