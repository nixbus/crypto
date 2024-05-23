import { build } from 'esbuild'

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
      banner: {
        js: [
          'import bannerPath from "path";',
          'import { fileURLToPath } from "url";',
          'import { createRequire as topLevelCreateRequire } from "module";',
          'const require = topLevelCreateRequire(import.meta.url);',
          'const __filename = fileURLToPath(import.meta.url);',
          'const __dirname = bannerPath.dirname(__filename);',
        ].join(''),
      },
    }),
    build({
      ...options,
      outdir: './dist/cjs',
      format: 'cjs',
    }),
  ])
}

main()
  .then(() => console.log('⚡ Bundle build complete ⚡'))
  .catch(() => {
    process.exit(1)
  })
