import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { cleanMd } from './clean-md.js'
import { cleanMarkdown, getTypes } from '../util.js'
import { compareVersions } from 'compare-versions'
import { introPages } from './intro-pages.js'

export async function generateLsrFiles(stackVersion) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  /** Get all VPR files */
  const vprFiles = glob.sync(`./docs/vpr/*-index.md`)
  /** Get the plugin skip list */
  const skipList = fs.existsSync('./data/skip-list.json')
    && JSON.parse(fs.readFileSync('./data/skip-list.json', 'utf-8'))
  /** Store version data */
  const pluginTypes = getTypes()
  /** Get the plugin versioning data */
  const versionData = fs.existsSync('./data/versions.json')
    && JSON.parse(fs.readFileSync('./data/versions.json', 'utf-8'))
  if (!versionData) {
    console.log('⚠️  Could not get `data/versions.json`')
    process.exit()
  }
  if (!versionData[stackVersion]) {
    versionData[stackVersion] = {}
    pluginTypes.forEach(t => versionData[stackVersion][t] = {})
  }
  /** Iterate through all the plugins included in the VPR */
  vprFiles.map(vprFile => {
    /** Parse the filename to get the plugin type and plugin name */
    const basename = path.basename(vprFile, '.md')
    const parsedName = basename.match(/^(?<type>[^-]+)-(?<name>[^ ]+)-index/m)
    const { type, name } = parsedName.groups
    return {
      type,
      name
    }
  }).filter(details => {
    /** Check if it's on the skip list */
    const { type, name } = details
    return skipList[type] && !skipList[type].includes(name)
  }).forEach(async details => {
    let version
    const { type, name } = details
    /**
     * Use the latest version from the VPR.
     */
    const versionedFiles = glob.sync(`./docs/vpr/v*-${type}s-${name}.md`)
    const versions = versionedFiles.map(file => {
      return file.match(/\d+-\d+-\d+/)[0].replace(/-/g, '.')
    }).sort((a, b) => {
      return compareVersions(a, b)
    }).reverse()
    version = versions[0]
    if (!version) {
      console.log(`⚠️  Could not get version for \`${type}-${name}\``)
      return
    }
    if (!versionData[stackVersion][type][name]) {
      versionData[stackVersion][type][name] = version
    }
    const vprFilename = `./docs/vpr/v${version.replace(/\./g, '-')}-plugins-${type}s-${name}.md`
    if (!fs.existsSync(vprFilename)) {
      console.log(`⚠️  Could not find VPR file for \`${type}-${name}\`.`)
      return
    }
    const vprContent = fs.readFileSync(vprFilename, 'utf-8')
    const lsrFilename = `./docs/lsr/plugins-${type}s-${name}.md`
    console.log(`✅ [lsr] Building ${lsrFilename}`)
    /** Clean up the VPR content to work for LSR */
    const lsrContent = await unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkGfm, { tablePipeAlign: false })
      .use(cleanMd, {
        pluginType: type,
        pluginName: name,
      })
      .use(remarkStringify)
      .process(vprContent)

    /** Clean up and compile the final Markdown */
    let markdownContent = String(lsrContent)
    markdownContent = cleanMarkdown(markdownContent)
    fs.writeFileSync(lsrFilename, markdownContent)
  })

  /** Add manual plugin pages to version data */
  const dir = path.resolve(__dirname, process.cwd())
  const manualLsrDir = path.join(dir, 'src', 'manual-content', 'lsr')
  const copiedFiles = fs.readdirSync(manualLsrDir, { recursive: true })
  const manualFileRegex = /^plugins-(?<type>[^- ]+)s-(?<name>[^ ]+)\.md$/m
  copiedFiles.filter(f => manualFileRegex.test(f)).forEach(f => {
    const { type, name } = f.match(manualFileRegex).groups
    if (!versionData[stackVersion][type][name]) {
      versionData[stackVersion][type][name] = ''
    }
  })

  /** Sort version data */
  const sortedVersionData = {}
  sortedVersionData[stackVersion] = {}
  pluginTypes.forEach(type => {
    /** Build intro pages for each plugin type */
    introPages(type, versionData[stackVersion][type])
    sortedVersionData[stackVersion][type] = {}
    Object.keys(versionData[stackVersion][type])
      .sort()
      .forEach(key => {
          sortedVersionData[stackVersion][type][key] = versionData[stackVersion][type][key]
       })
  })

  /** Save the latest versioning data for next time */
  const versionDir = `./data/`
  if (!fs.existsSync(versionDir)) fs.mkdirSync(versionDir, { recursive: true })
  fs.writeFileSync(`${versionDir}/versions.json`, JSON.stringify(sortedVersionData, null, 2))
}
