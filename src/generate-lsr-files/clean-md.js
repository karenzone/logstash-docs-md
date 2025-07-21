import { visit } from 'unist-util-visit'
import { remove } from 'unist-util-remove'
import { getTypes } from '../util.js'
import yaml from 'yaml'

export function cleanMd(options = { pluginType, pluginName }) {
  const { pluginType, pluginName } = options
  return (tree) => {
    let updatedTree = tree
    updatedTree = updateFrontmatter(updatedTree, pluginName)
    updatedTree = updateHeadings(updatedTree)
    updatedTree = updateLinks(updatedTree)
    updatedTree = updateVersionLink(updatedTree, pluginType, pluginName)
    return updatedTree
  }
}

/**
 * Update frontmatter to:
 * - Change the nav title to the name of the plugin
 *   instead of the version number
 * - Change the mapped_pages to the Logstash Reference
 *   guide page instead of the VPR page.
 * - Add applies_to for the specified Stack version.
 */
function updateFrontmatter(updatedTree, pluginName) {
  visit(updatedTree, (node) => {
    if (node.type === 'yaml') {
      const frontmatter = yaml.parse(node.value)
      frontmatter['navigation_title'] = pluginName
      frontmatter['mapped_pages'] = frontmatter['mapped_pages'].map(mp => {
        return mp.replace(/\/logstash-versioned-plugins\//, '/logstash/')
                 .replace(/v\d+\.\d+\.\d+-/, '')
      })
      node.value = yaml.stringify(frontmatter)
    }
  })
  return updatedTree
}

/**
 * Update headings to:
 * - Remove the version number from the title
 * - Remove the version number from IDs for other headings
 */
function updateHeadings(updatedTree) {
  visit(updatedTree, (node) => {
    if (node.type === 'heading') {
      if (node.depth === 1) {
        node.children[0].value = node.children[0].value.replace(/ v\d+\.\d+\.\d+.+$/m, '')
      } else {
        node.children = node.children.map(ch => {
          if (ch.type === 'text') {
            /** Remove version */
            ch.value = ch.value.replace(/v\d+\.\d+\.\d+-/, '')
            /** Remove generated number for duplicate IDs */
            ch.value = ch.value.replace(/_\d+\] *$/m, ']')
          }
          return ch
        })
      }
    }
  })
  return updatedTree
}

/**
 * Update links to:
 * - Remove version numbers in local links
 * - Add /vpr/ prefix to index links
 */
function updateLinks(updatedTree) {
  const types = getTypes()
  const indexRegex = new RegExp(`(${types.join('\|')})-[^ ]+-index\.md`)
  visit(updatedTree, (node) => {
    if (node.type === 'link') {
      if (!/:\/\//.test(node.url)) {
        node.url = node.url.replace(/(\/vpr\/)?v\d+(-|\.)\d+(-|\.)\d+-/g, '')
        if (indexRegex.test(node.url)) {
          node.url = `/vpr/${node.url}`
        }

      }
    }
  })
  return updatedTree
}

/** Clean up intro section */
function updateVersionLink(updatedTree, pluginType, pluginName) {
  visit(updatedTree, (node) => {
    if (node.type === 'listItem') {
      const text = node.children[0].children[0].value
      if (/^Plugin version: */m.test(text)) {
        node.children[0].children = [
          { type: 'text', value: `${text} (` },
          {
            type: 'link',
            url: `/vpr/${pluginType}-${pluginName}-index.md`,
            children: [ { type: 'text', value: 'Other versions' } ]
          },
          { type: 'text', value: ')' },
        ]
      }
    }
    if (
      node.type === 'paragraph'
      && node.children.length > 0
      && (
        /For other versions, see the/.test(node.children[0].value)
        || /To learn more about Logstash, see the/.test(node.children[0].value)
      )
    ) {
      remove(node)
    }
  })
  return updatedTree
}
