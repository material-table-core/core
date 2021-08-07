import esbuild from 'esbuild';
import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs';

const { log, error } = console;

/**
 * OUTPUT PATH IS SET HERE!!
 *
 * relative to root of project
 *
 * !! NO TRAILING SLASH !!
 */
const BUILD_DIR = './dist';

log(`-Cleaning build artifacts from : '${BUILD_DIR}' `);

rimraf(path.resolve(BUILD_DIR), async (err) => {
  if (err) {
    error(`err cleaning '${BUILD_DIR}' : ${error.stderr}`);
    process.exit(1);
  }

  log('successfully cleaned build artifacts');

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

  log('-Begin building');

  try {
    await esbuild.build(options);
    log(
      `\nSuccessfully built to '${BUILD_DIR}''\n[note] : this path is relative to the root of this project)'`
    );
  } catch (err) {
    error(`\nERROR BUILDING : ${err}`);
    process.exit(1);
  } finally {
    process.exit(0);
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
