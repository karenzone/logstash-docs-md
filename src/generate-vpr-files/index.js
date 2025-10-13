import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import remarkGfm from 'remark-gfm'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { cleanHtml } from './clean-html.js'
import { getToc } from '../toc.js'
import { cleanMarkdown } from '../util.js'
import yaml from 'yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Make docs-builder compliant Markdown files
 */
export async function generateVprFiles() {
  const dir = path.resolve(__dirname, process.cwd())

  /** Get the relevant directories */
  const bookId = 'logstash-versioned-plugins'
  /** The source directory where the HTML files live */
  const srcDir = path.join(dir, 'temp', 'built-docs', 'raw', 'en', bookId, 'current')
  /** The destination directory where the Markdown files will go */
  const destDir = path.join(dir, 'docs', 'vpr')
  /** If the destination directory doesn't exist yet, create it */
  if (!fs.existsSync(destDir))
    fs.mkdirSync(destDir, { recursive: true })

  /**
   * Get the toc data so we can get the
   * `navigation_title` for each page
   */
  const toc = getToc(path.join(srcDir, 'toc.html'))

  /**
   * Get all HTML files in the source directory
   */
  const pluginFiles = glob.sync(`${srcDir}/**/*.html`)
  pluginFiles.reverse().forEach(async (file) => {
    /** Build the full new file path */
    const basename = path.basename(file, '.html')
    /** Replace any `.` with `-` in file base names */
    const newFilename = `${basename.replace(/\./g, '-')}.md`
    const newFilepath = path.join(destDir, newFilename)
    /** Skip the toc and index HTML files */
    if (basename === 'index') return
    if (basename === 'toc') return

    console.log(`✅ [vpr] Building ${newFilepath}`)

    /** Build the frontmatter */
    const frontmatter = buildFrontmatter(toc, bookId, basename, newFilename)
    /** Read the contents of the HTML file */
    const content = fs.readFileSync(file, 'utf-8')
    /**
     * Parse HTML into an abstract syntax tree and
     * process it into docs-builder compliant Markdown
     */
    const markdown = await unified()
      .use(rehypeParse)
      .use(cleanHtml, { files: pluginFiles, bookId: bookId })
      .use(rehypeRemark)
      .use(remarkGfm, { tablePipeAlign: false })
      .use(remarkStringify)
      .process(content)
    /** Clean up and compile the final Markdown */
    let markdownContent = String(markdown)
    markdownContent = cleanMarkdown(markdownContent)
    markdownContent = `${frontmatter}\n\n${markdownContent}`
    /** Create the Markdown file */
    fs.writeFileSync(newFilepath, markdownContent)
  })
}

/**
 * Build out the frontmatter needed by docs-builder
 */
function buildFrontmatter(toc, bookId, basename, newFilename) {
  const frontmatterObj = {}
  let navigationTitle = ''
  /**
   * Go through the toc data, find the page,
   * and get the text used in the toc to use
   * as the `navigation_title`
   */
  visit(toc, (node) => {
    if (node.file === newFilename) {
      frontmatterObj['navigation_title'] = node.navigation_title
    }
  })
  /** Add mapped_pages */
  frontmatterObj['mapped_pages'] = [
    `https://www.elastic.co/guide/en/${bookId}/current/${basename}.html`
  ]
  /** Add applies_to */
  frontmatterObj['applies_to'] = {}
  frontmatterObj['applies_to']['stack'] = 'ga'
  return `---\n${yaml.stringify(frontmatterObj)}---`
}
