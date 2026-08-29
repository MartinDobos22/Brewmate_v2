// Metro must see the whole pnpm workspace so @brewmate/shared resolves and
// hot-reloads like local source.
const path = require('node:path');

const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

/**
 * The contract's own source, which Metro reads directly: `tsconfig.base.json`
 * maps `@brewmate/shared` onto it, and Expo's Metro honours those paths.
 */
const sharedSourceRoot = path.resolve(workspaceRoot, 'shared', 'src');

/** The extension the contract's internal imports carry, and the one they mean. */
const EMITTED_EXTENSION = '.js';

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

/**
 * `@brewmate/shared` is compiled by tsc under NodeNext, which requires every
 * relative import to name the file the emitted JavaScript will have - so its
 * source says `./api/index.js` while the file on disk is `./api/index.ts`.
 * Node and tsc both understand that; Metro reads it literally and fails with
 * "Unable to resolve ./api/index.js from shared/src/index.ts".
 *
 * Dropping the extension for imports that come out of the contract's source
 * lets Metro find the TypeScript, and leaves every other resolution - the app's
 * own files, node_modules, real .js files - to the default resolver.
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isRelative = moduleName.startsWith('.');
  const isFromSharedSource = context.originModulePath.startsWith(sharedSourceRoot);

  if (isRelative && isFromSharedSource && moduleName.endsWith(EMITTED_EXTENSION)) {
    const withoutExtension = moduleName.slice(0, -EMITTED_EXTENSION.length);

    return context.resolveRequest(context, withoutExtension, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
