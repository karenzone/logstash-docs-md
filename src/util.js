/**
 * Clean the Markdown after being processed
 */
function cleanMarkdown(content) {
  /** Don't escape brackets in headings (used for IDs) */
  let updatedContent = content.replace(/^#+ +.+$/gm, (m) => m.replace(/\\/g, ''))
  /** Don't escape underscores */
  updatedContent = updatedContent.replace(/\\_/g, '_')
  /** Don't escape brackets */
  updatedContent = updatedContent.replace(/\\\[/g, '[')
  /** Don't escape parentheses */
  updatedContent = updatedContent.replace(/\]\\\(\</g, '](<')
  /** Don't escape ticks around inline applies_to info */
  updatedContent = updatedContent.replace(/\{applies_to\}\\`([^\`]+)\\`/g, '{applies_to}`$1`')
  /** Replace irregular whitespace to avoid hints */
  updatedContent = replaceWhitespace(updatedContent)
  /** Don't escape angle brackets for line breaks (used in tables) */
  updatedContent = updatedContent.replace(/\\<br>/g, '<br>')
  return updatedContent
}

function fileFilterRegex(list) {
  return new RegExp(`(^|\/)(${list.join('|')})\\.html$`, 'm')
}

function getTypeInfo(type) {
  if (type === 'lsr') {
    return {
      bookId: 'logstash',
      fileFilter: [
        'codec-plugins',
        'filter-plugins',
        'input-plugins',
        'output-plugins',
        'plugin-integrations',
        'plugins-(?:codecs|filters|inputs|outputs|integrations)-.*',
      ]
    }
  } else if (type === 'vpr') {
    return {
      bookId: 'logstash-versioned-plugins'
    }
  } else {
    console.log(`Invalid type: \`${type}\`. Must be \`lsr\` or \`vpr\`.`)
    process.exit(1)
  }
}

function getTypes() {
  return [ 'codec', 'filter', 'input', 'integration', 'output' ]
}

function replaceWhitespace(string) {
  return string.replace(
    /(\v|\f|\u00A0|\u1680|\u2000-|\u200A|\u200B|\u2009|\u2028|\u2029|\u202F|\u205F|\u3000)/g,
    ''
  )
}

export {
  cleanMarkdown,
  fileFilterRegex,
  getTypeInfo,
  getTypes,
  replaceWhitespace,
}
