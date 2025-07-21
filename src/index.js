import { clearDocsDir } from "./clear-docs-dir.js"
import { generateVprFiles } from "./generate-vpr-files/index.js"
import { generateLsrFiles } from "./generate-lsr-files/index.js"
import { buildToc } from "./toc.js"

/**
 * Validate arguments
 */
const TYPE = process.argv[2]
let STACK_VERSION = process.argv[3]
let PATCH_VERSION

const validTypes = ['lsr', 'vpr']
if (!validTypes.includes(TYPE) || !TYPE) {
  console.log(`Needs a valid type. Use either: ${validTypes.join(',')}`)
  process.exit()
}
if (TYPE === 'lsr') {
  if (!STACK_VERSION) {
    console.log(`Needs a version when using the \`lsr\` type. For example: \`9.1.0\`.`)
    process.exit()
  }
  PATCH_VERSION = getPatch(STACK_VERSION)
  if (!PATCH_VERSION) {
    console.log(`Version is incorrectly formatted. Use a full version, for example: \`9.1.0\`.`)
    process.exit()
  }
  if (STACK_VERSION !== PATCH_VERSION) {
    console.log(`✅ Using version \`${PATCH_VERSION}\`.`)
  }
}

/**
 * Do this prep only if the specified
 * `TYPE` is `lsr`.
 */
if (TYPE === 'lsr') clearDocsDir('lsr')

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
  await generateLsrFiles(PATCH_VERSION)
  buildToc('lsr')
}

function getPatch(version) {
  const match = version.match(/^(?<major>\d+)\.?(?<minor>\d+)?\.?(?<patch>\d+)?/m)
  const major = match && match.groups.major
  const minor = match && match.groups.minor || '0'
  const patch = match && match.groups.patch || '0'
  return match && `${major}.${minor}.${patch}`
}
