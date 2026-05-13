const fs = require('fs');
const path = require('path');
const { logger } = require('@nx/devkit');

let sortPackageJson;
let builtCompleteFunction;

logger.info = new Proxy(logger.info, {
  apply(target, thisArg, args) {
    target.apply(thisArg, args);

    // nx prints this message after rollup finishes and nx itself has completed building the resulting package.json
    if (args[0].includes('Done in') && builtCompleteFunction) {
      builtCompleteFunction();
    }
  },
});

(async () => {
  sortPackageJson = (await import('sort-package-json')).default;
})();

/** @type {import("rollup").RollupOptionsFunction} */
const rollupConfig = (config) => {
  const outputDir = config.output.dir;

  builtCompleteFunction = () => {
    if (path.basename(outputDir) === 'core') {
      return;
    }

    // STEP 1: Add @sapporta/rest-core to peerDependencies of all libs, except core itself
    // Can't let changesets handle this for us because it sees peerDependencies updates as a breaking change
    const packageJsonPath = path.join(outputDir, 'package.json');
    const packageJsonObject = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf8'),
    );
    const splitVersion = packageJsonObject.version.split('.');
    splitVersion.splice(-1, 1, '0');

    const peerVersion = packageJsonObject.version.includes('-')
      ? packageJsonObject.version // pre-release needs to use exact version
      : `~${splitVersion.join('.')}`;

    packageJsonObject.peerDependencies = {
      ...packageJsonObject.peerDependencies,
      '@sapporta/rest-core': peerVersion,
    };

    fs.writeFileSync(
      packageJsonPath,
      `${JSON.stringify(sortPackageJson(packageJsonObject), null, 2)}\n`,
    );

    logger.info('\nAdded @sapporta/rest-core to peer dependencies');
  };

  return {
    ...config,
    external: (source, importer, isResolved) => {
      // stop rollup from looking for workspace packages because it thinks they're not external since they are not in package.json
      if (source.startsWith('@sapporta/rest-')) {
        return true;
      }
      return config.external(source, importer, isResolved);
    },
    plugins: [...config.plugins],
  };
};

module.exports = rollupConfig;
