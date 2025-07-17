import { getVersionData } from "./get-version-data.js"
import { clearDocsDir } from "./clear-docs-dir.js"
import { generateVprFiles } from "./generate-vpr-files/index.js"
import { generateLsrFiles } from "./generate-lsr-files/index.js"
import { buildToc } from "./toc.js"

/**
 * Validate arguments
 */
const TYPE = process.argv[2]
const STACK_VERSION = process.argv[3]
let MINOR_VERSION
const validTypes = ['lsr', 'vpr']
if (!validTypes.includes(TYPE) || !TYPE) {
  console.log(`Needs a valid type. Use either: ${validTypes.join(',')}`)
  process.exit()
}
if (TYPE === 'lsr') {
  if (!STACK_VERSION) {
    console.log(`Needs a minor version when using the \`lsr\` type. For example: \`9.1\`.`)
    process.exit()
  }
  MINOR_VERSION = getMinor(STACK_VERSION)
  if (!MINOR_VERSION) {
    console.log(`Version is incorrectly formatted. Use a minor version, for example: \`9.1\`.`)
    process.exit()
  }
  if (STACK_VERSION !== MINOR_VERSION) {
    console.log(`✅ Using minor version \`${MINOR_VERSION}\`.`)
  }
}

/**
 * Do this prep only if the specified
 * `TYPE` is `lsr`.
 */
if (TYPE === 'lsr') {
  await getVersionData(MINOR_VERSION)
  clearDocsDir('lsr')
}

/**
 * Always update the VPR docs regardless of the
 * specified `TYPE` so we always have the latest
 * VPR files to pull from if the `TYPE` is `lsr`.
 */
clearDocsDir('vpr')
await generateVprFiles()
buildToc('vpr')

/**
 * If the `TYPE` is `lsr`, update the LSR files.
 */
if (TYPE === 'lsr') {
  await generateLsrFiles(MINOR_VERSION)
  buildToc('lsr')
}

function getMinor(version) {
  const match = version.match(/^\d+\.\d+/m)
  return match && match[0]
}
