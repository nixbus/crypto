import { build } from 'esbuild'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'

async function main() {
  const options = {
    entryPoints: ['./lib/crypto.ts'],
    bundle: true,
    treeShaking: true,
    sourcemap: false,
    keepNames: true,
    minify: true,
    platform: 'neutral',
    tsconfig: './tsconfig.json',
    logLevel: 'info',
    define:
      process.env.NODE_ENV === 'production'
        ? {
            'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
          }
        : undefined,
  }
  await Promise.all([
    build({
      ...options,
      outdir: './dist',
      format: 'esm',
    }),
    build({
      ...options,
      outdir: './dist/cjs/lib',
      format: 'cjs',
      outExtension: { '.js': '.cjs' }
    }),
  ])

  const wrapperContent = `module.exports = require('./lib/crypto.cjs');`;
  const wrapperPath = path.join(process.cwd(), 'dist/cjs/crypto.js');

  await writeFile(wrapperPath, wrapperContent, 'utf8');
}

main()
  .then(() => console.log('⚡ Bundle build complete ⚡'))
  .catch(() => {
    process.exit(1)
  })
