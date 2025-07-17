import fs from 'fs'
import path from 'node:path'
import { glob } from 'glob'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { cleanMd } from './clean-md.js'
import { cleanMarkdown } from '../util.js'
import { compareVersions } from 'compare-versions'
import { introPages } from './intro-pages.js'

export async function generateLsrFiles(stackVersion) {
  const vprFiles = glob.sync(`./docs/vpr/*-index.md`)
  /** Get the plugin skip list */
  const skipList = fs.existsSync('./data/skip-list.json')
    && JSON.parse(fs.readFileSync('./data/skip-list.json', 'utf-8'))
  /** Get the plugin versioning data */
  const versionData = fs.existsSync('./data/versions.json')
    && JSON.parse(fs.readFileSync('./data/versions.json', 'utf-8'))
  if (!versionData) {
    console.log('⚠️  Could not get `data/versions.json`')
    process.exit()
  }
  if (!versionData[stackVersion]) {
    console.log(`⚠️  No data for version \`${stackVersion}\`. Run \`npm run get-files -- <stackVersion>\`.`)
    process.exit()
  }
  const currentData = versionData[stackVersion]
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
     * If we got a version from the Gem lock file,
     * try using that version.
     */
    if (currentData[type][name]) {
      version = currentData[type][name]
      /**
       * If that version doesn't exist in the vpr directory,
       * set it to undefined so we can look up the latest version.
       */
      const vprFilename = `./docs/vpr/v${version.replace(/\./g, '-')}-plugins-${type}s-${name}.md`
      if (!fs.existsSync(vprFilename)) currentData[type][name] = undefined
    }
    /**
     * If there was no version in the Gem lock file,
     * use the latest version.
     */
    if (!currentData[type][name]) {
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
      versionData[stackVersion][type][name] = version
    }

    const oldestStackVersion = Object.keys(versionData).filter(stackV => {
      return versionData[stackV][type][name] === versionData[stackVersion][type][name]
    }).sort((a, b) => {
      return compareVersions(a, b)
    })[0] || '9.0'

    const otherStackVersions = {}
    if (oldestStackVersion !== '9.0') {
      Object.keys(versionData).sort((a, b) => compareVersions(a, b)).reverse().forEach((stackV) => {
        const greater = compareVersions(stackVersion, stackV) > 0 ? true : false
        if (greater && versionData[stackV][type][name]) {
          if (!otherStackVersions[stackV]) otherStackVersions[stackV] = {}
          if (!otherStackVersions[stackV][type]) otherStackVersions[stackV][type] = {}
          otherStackVersions[stackV][type][name] = versionData[stackV][type][name]
        }
      })
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
        stackVersion: oldestStackVersion,
        otherStackVersions: otherStackVersions
      })
      .use(remarkStringify)
      .process(vprContent)

    /** Clean up and compile the final Markdown */
    let markdownContent = String(lsrContent)
    markdownContent = cleanMarkdown(markdownContent)
    fs.writeFileSync(lsrFilename, markdownContent)
    /** Build intro pages for each plugin type */
    introPages(versionData, stackVersion)
  })

  /** Save the latest versioning data for next time */
  const versionDir = `./data/`
  if (!fs.existsSync(versionDir)) fs.mkdirSync(versionDir, { recursive: true })
  fs.writeFileSync(`${versionDir}/versions.json`, JSON.stringify(versionData, null, 2))
}
