import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Clear the docs directory
 */
export function clearDocsDir(type) {
  const dir = path.resolve(__dirname, process.cwd())
  const docsDir = path.join(dir, 'docs')
  const typeDir = path.join(docsDir, type)
  const docsetFile = path.join(docsDir, 'docset.yml')
  if (fs.existsSync(typeDir)) {
    fs.rmSync(typeDir, { recursive: true })
    fs.rmSync(docsetFile, { recursive: true })
  }
  /** Make fresh docs/reference directory where generated files will live. */
  fs.mkdirSync(typeDir, { recursive: true })
  /** Copy over manual content */
  const manualContentDir = path.join(dir, 'src', 'manual-content')
  const typeContentDir = path.join(manualContentDir, type)
  const docsetContentFile = path.join(dir, 'src', 'manual-content', 'docset.yml')
  fs.cpSync(typeContentDir, typeDir, { recursive: true })
  fs.cpSync(docsetContentFile, docsetFile, { recursive: true })
}
