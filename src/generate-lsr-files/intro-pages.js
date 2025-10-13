import fs from 'fs'

export function introPages(type, versionData) {
  const context = fs.readFileSync(`temp/logstash-docs/docs/plugins/${type}s.asciidoc`, 'utf-8')
  const introContent = context.match(/((?!\|=).*\n)+/)
  const parseIntro = introContent[0].match(/^\[\[(?<id>[^\]]+)\]\]\n=+ +(?<title>[^\n]+)\n+(?<intro>[\s\S]+)/m)
  const { id, title, intro } = parseIntro.groups
  let content = ''
  content += '---\n'
  content += 'mapped_pages:\n'
  content += `  - https://www.elastic.co/guide/en/logstash/current/${id}.html\n`
  content += `applies_to:\n`
  content += `  stack: ga\n`
  content += '---\n'
  content += '\n'
  content += `# ${title}\n`
  content += '\n'
  content += asciidocToMdLink(intro)
  content += '\n'
  content += '| Plugin | Description | Github repository |\n'
  content += '|---|---|---|\n'
  Object.keys(versionData).sort().forEach(name => {
    const regex = new RegExp(`^\\| \\<\\<plugins-${type}s-${name},${name}\\>\\>[^\n]+`, 'm')
    if (!context.match(regex)) return
    const row = context.match(regex)[0]
    const cells = row.split(/ *\| */)
    const description = cells[2].replace(
      /([^\{])\{([^\{\}]+)\}([^\}])/g,
      '$1{{$2}}$3'
    )
    const repo = cells[3]
    content += `| [${name}](plugins-${type}s-${name}.md) | ${description} | ${asciidocToMdLink(repo)} |\n`
  })
  fs.writeFileSync(`docs/lsr/${id}.md`, content)
}

function asciidocToMdLink(text) {
  return text.replace(/(?<url>[^ ]+)\[(?<text>[^\]]+)\]/, (match, url, text) => {
    return `[${text}](${url.replace(/\/\{branch\}\//, '/master/')})`
  })
}