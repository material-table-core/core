const { build } = require('esbuild');
const { red, green, yellow, italic } = require('chalk');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');

const { log } = console;
const { stdout, stderr, exit } = process;

/**
 * OUTPUT PATH IS SET HERE!!
 *
 * relative to root of project
 *
 * !! NO TRAILING SLASH !!
 */
const BUILD_DIR = 'dist';

stdout.write(yellow(`-Cleaning build artifacts from : '${BUILD_DIR}' `));

rimraf(path.resolve(__dirname, BUILD_DIR), async (error) => {
  if (error) {
    stderr.write(red(`err cleaning '${BUILD_DIR}' : ${error.stderr}`));
    exit(1);
  }

  log(green.italic('successfully cleaned build artifacts'));

  const options = {
    entryPoints: getFilesRecursive('./src', '.js'),
    minifySyntax: true,
    minify: true,
    bundle: false,
    outdir: `${BUILD_DIR}`,
    target: 'es6',
    // format: 'cjs',
    loader: {
      '.js': 'jsx'
    }
  };

  log(yellow('-Begin bundling'));

  try {
    await build(options);
    log(
      green(`\nSuccessfully bundled to '${BUILD_DIR}'`),
      yellow('\n[note]'),
      italic.green(': this path is relative to the root of this project)')
    );
  } catch {
    stderr.write(red(`\nerror bundling : ${error.stderr}`));
    exit(1);
  } finally {
    exit(0);
  }
});

/**
 * Helper functions
 */

function getFilesRecursive(dirPath, fileExtension = '') {
  const paths = traverseDir(dirPath);
  if (fileExtension === '') {
    return paths;
  }
  return paths.filter((p) => p.endsWith(fileExtension));
}

function traverseDir(dir, filePaths = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDir(fullPath, filePaths);
    } else {
      filePaths.push(fullPath);
    }
  });
  return filePaths;
}
