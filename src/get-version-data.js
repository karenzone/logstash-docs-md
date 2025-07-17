import fs from 'fs'
import path from 'node:path'
import { glob } from 'glob'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function getVersionData(stackVersion) {
  const dir = path.resolve(__dirname, process.cwd())

  /** Valid plugin types */
  const types = [ 'codec', 'filter', 'input', 'integration', 'output' ]

  /** Get the Gem lock file for the Stack version */
  const gemFiles = glob.sync(`temp/logstash/${stackVersion}/*`)
  if (gemFiles.length < 1) {
    console.log(`No data for version \`${stackVersion}\`. Run \`npm run get-files -- <stackVersion>\`.`)
    process.exit()
  }
  const gemFile = gemFiles[0]
  const gemFileContent = fs.readFileSync(gemFile, 'utf-8')

  /** Starting point for version data */
  const versionData = fs.existsSync('./data/versions.json')
    ? JSON.parse(fs.readFileSync('./data/versions.json', 'utf-8'))
    : {}
  /** Clear out plugin versions for the Stack version */
  versionData[stackVersion] = {}
  types.forEach(type => {
    versionData[stackVersion][type] = {}
  })

  /** Parse the data from the Gem lock file */
  const content = gemFileContent.match(/^GEM(\n\s\s+.+)+/m)
  const indent = content[0].split(/\n/)[3].match(/^\s+/)[0]
  const topLevelRegex = new RegExp(`^${indent}logstash-.+`, 'gm')
  const nameFormatRegex = /^\s*logstash-(?<type>[^- ]+)-(?<name>[^- ]+) *\((?<version>\d+\.\d+\.\d+).*\)/m
  /** Iterate through each plugin */
  content[0].match(topLevelRegex).forEach(plugin => {
    const parsedName = plugin.match(nameFormatRegex)
    if (!parsedName) {
      console.log(`⚠️  Not a valid name: ${plugin}`)
      return
    }
    const { type, name, version } = parsedName.groups
    if (!types.includes(type)) {
      console.log(`⚠️  Not a valid type: ${plugin}`)
      return
    }
    /** Format versioning information as JSON */
    versionData[stackVersion][type][name] = version
  })

  /** Add manual plugin pages to version data */
  const manualContentLsrDir = path.join(dir, 'src', 'manual-content', 'lsr')
  const copiedFiles = fs.readdirSync(manualContentLsrDir, { recursive: true })
  const manualFileRegex = /^plugins-(?<type>[^- ]+)s-(?<name>[^ ]+)\.md$/m
  copiedFiles.filter(f => manualFileRegex.test(f)).forEach(f => {
    const { type, name } = f.match(manualFileRegex).groups
    versionData[stackVersion][type][name] = ''
  })

  /** Write data to a JSON file */
  const dataDir = `./data/`
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(`${dataDir}/versions.json`, JSON.stringify(versionData, null, 2))
}

