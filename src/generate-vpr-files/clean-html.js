import path from 'node:path'
import { visit } from 'unist-util-visit'
import { remove } from 'unist-util-remove'
import { find } from 'unist-util-find'
import { replaceWhitespace } from '../util.js'

export function cleanHtml(options = { files, bookId }) {
  const { files, bookId } = options
  return (tree) => {
    let updatedTree = tree
    updatedTree = getMainContent(updatedTree)
    updatedTree = replaceCodeCalloutLinks(updatedTree)
    updatedTree = replaceProblematicTables(updatedTree)
    updatedTree = replaceHeadings(updatedTree)
    updatedTree = replaceLinks(updatedTree, files, bookId)
    updatedTree = replaceIrregularWhitespace(updatedTree)
    return updatedTree
  }
}

/**
 * Get just the main content
 *
 * Grab the HTML for the main docs content from inside the
 * `div` with `id` set to `content`, and filter out the
 * `Edit this page on GitHub` links next to each heading
 * and the notice stating there is a newer version of the docs.
 */
function getMainContent(updatedTree) {
  visit(updatedTree, (node) => {
    if (node.properties?.id === 'content') {
      remove(node, (n) => {
        /** Remove "edit in GitHub" links */
        return n.properties?.className?.includes('edit_me')
      })
      updatedTree = node
    }
  })
  /** Remove the banner at the top of the page */
  remove(updatedTree, (n) => {
    return n.properties?.id === 'url-to-v3'
  })
  return updatedTree
}

/**
 * Replace code callout links in code blocks
 */
function replaceCodeCalloutLinks(updatedTree) {
  visit(updatedTree, { tagName: 'pre' }, (node) => {
    let callouts
    /** Find links inside the code block */
    visit(node, { tagName: 'a'}, (child) => {
      /** Check if it uses the pattern used for code callouts */
      if (/^CO[\d-]+$/m.test(child.properties?.id)) {
        callouts = true
        /** Change the node from a link to plain text */
        child.type = 'text'
        delete child.tagName
        /** Get the number of the callout relative to the code block */
        const number = child.properties.id.match(/\d+$/m)[0]
        /** Set the value of the text to the docs-builder code callout syntax */
        child.value = `<${number}>`
      }
    })
    /**
     * HACK!
     * Remove inline code comment in code block using callouts
     */
    if (callouts) {
      visit(node, { type: 'text' }, (t) => {
        t.value = t.value.replace(/(loader_schedule => "\* \*\/2 \* \* \*") #[^\n"']+$/m, '$1')
      })
    }
  })
  return updatedTree
}

/**
 * Replace problematic tables
 * (including code callout text and table cells containing code blocks)
 */
function replaceProblematicTables(updatedTree) {
  visit(updatedTree, { tagName: 'table' }, (node) => {
    /**
     * Handle tables that contain code callout text
     *
     * AsciiDoc turns the text for code annotations into a table
     * with two columns where the first cell in each row is the number
     * with an ID that connects it to the annotation inside the code
     * block and the second cell in each row is the text. We need to turn
     * it into an ordered list.
     */
    let callouts
    let listItems = []
    visit(node, { tagName: 'tr' }, (nodeChild) => {
      const firstLink = find(nodeChild, { tagName: 'a' })
      callouts = /^#CO[\d-]+$/m.test(firstLink?.properties?.href)
      if (callouts) {
        const cells = nodeChild.children.filter(ch => ch.tagName === 'td')
        /** If a number is used twice in the code block, we list it twice. */
        visit(cells[0], { tagName: 'a' }, () => {
          listItems.push({
            type: 'element',
            tagName: 'li',
            children: cells[1].children
          })
        })
      }
    })
    if (callouts) {
      node.tagName = 'ol'
      node.children = listItems
    }
    /**
     * Handle table cells that contain code blocks
     */
    visit(node, { tagName: 'pre' }, (nodeChild) => {
      nodeChild.tagName = 'p'
      nodeChild.children.forEach((child) => {
        if (child.type === 'text') child.value = child.value.replace(/\n/g, '<br>')
      })
    })
  })
  return updatedTree
}

/**
 * Update headings
 * (make then incremental starting with h1 and add custom IDs)
 */
function replaceHeadings(updatedTree) {
  let baseHeadingDepth
  visit(updatedTree, (node) => {
    if (/^h\d/m.test(node.tagName)) {
      /** Adjust heading depth (always start with h1) */
      if (!baseHeadingDepth) baseHeadingDepth = node.tagName.match(/^h(\d)$/m)[1]
      const headingDepth = node.tagName.match(/^h(\d)$/m)[1]
      const adjustedDepth = Number(headingDepth) + (1 - Number(baseHeadingDepth))
      node.tagName = `h${adjustedDepth}`
      /** Move the heading ID to the end of the text */
      let id = node.children.find(child => {
        return child.tagName === 'a'
      })?.properties?.id
      /** Remove generated number for duplicate IDs */
      id = id && id.replace(/_\d+$/m, '')
      node.children.shift()
      const updatedChildren = [
        ...node.children,
        { type: 'text', value: ` [${id}]` }
      ]
      node.children = updatedChildren
    }
  })
  return updatedTree
}

/**
 * Replace links
 */
function replaceLinks(updatedTree, files, bookId) {
  /** Make a list of relative file paths */
  const relFiles = files.map(file => path.basename(file))
  /** Walk the tree looking for links */
  visit(updatedTree, { tagName: 'a' }, (node) => {
    /** Get rid of the `title` because it was causing problems */
    node.properties.title = undefined
    const base = path.basename(node.properties.href).split('#')[0]
    /**
     * HACK!
     * There were so many of these links and they were being treated
     * as external links even though we have a new manually written
     * value types page in this repo now. This just replaces the external
     * link with a docs-builder internal link to the new page.
     */
    if (/configuration-file-structure\.html/.test(node.properties.href)) {
      node.properties.href = node.properties.href.replace(
        /(\/guide\/en\/logstash\/[^/]+\/)?configuration-file-structure\.html/,
        `${bookId !== 'logstash' ? '/lsr/' : ''}value-types.md`
      )
    /**
     * If it's a relative link to another elastic.co page,
     * but it is NOT in the current book, then transform the link
     * into an external link to elastic.co and rely on permanent
     * redirects.
     */
    } else if (/^\//m.test(node.properties.href)) {
      node.properties.href = node.properties.href.replace(/^\//m, 'https://www.elastic.co/')
    /**
     * If it's a relative link to another page in the same book,
     * replace it with an docs-builder internal link.
     */
    } else if (relFiles.includes(base)) {
      const base = path.basename(node.properties.href, '.html')
      node.properties.href = node.properties.href.replace(/\.html/, '.md')
      /**
       * We can't use `.` in filenames in docs-builder
       * so this replaces the `.` in the version numbers with `-`.
       */
      node.properties.href = node.properties.href.replace(/^v(\d+)\.(\d+)\.(\d+)(\.|-)/m, 'v$1-$2-$3-')
      /**
       * If linking specifically to the first heading, remove everything
       * after the `#` because it will cause build errors in docs-builder.
       */
      if (/#[^ ]+$/m.test(node.properties.href)) {
        const hash = node.properties.href.match(/#([^ ]+)$/m)[1]
        if (hash === base) {
          node.properties.href = node.properties.href.replace(/#[^ ]+$/m, '')
        }
      }
    /**
     * For the logstash book, we're only pulling plugin pages, but links to other pages
     * in the logstash book will be formatted as internal links in the same book. So if
     * the link doesn't match any of the conditions above AND it's not a proper external
     * link (http) or email address (malito), then we'll treat it like an internal link
     * to a different book and rely on redirects to get us to the correct page.
     */
    } else if (!/^(http|mailto)/m.test(node.properties.href)) {
      node.properties.href = node.properties.href.replace(/^/m, `https://www.elastic.co/guide/en/${bookId}/current/`)
    }
  })
  return updatedTree
}

/**
 * Replace irregular white spaces
 */
function replaceIrregularWhitespace(updatedTree) {
  visit(updatedTree, { type: 'text' }, (node) => {
    node.value = replaceWhitespace(node.value)
  })
  return updatedTree
}
