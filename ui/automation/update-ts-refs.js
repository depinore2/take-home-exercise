const getDeps = require(__dirname + '/get-ts-deps.js');
const path = require('path');

function getOwnPackageJsonPath(originFolder) {
    return path.resolve(originFolder, 'package.json');
}

async function getDirectDependencies(originFolder) {
    const ownPackageJson = await getDeps.readPackageJson(getOwnPackageJsonPath(originFolder));

    return getDeps.joinNpmDependencies(ownPackageJson.dependencies, ownPackageJson.devDependencies);
}

async function main() {
    const originFolder = path.resolve(process.argv[2]); // assumes it's going to be an absolute path.

    const { npmDependencies, tsReferences } = await getDeps.getDependencies(originFolder, getOwnPackageJsonPath(originFolder));
    const directDependencies = await getDirectDependencies(originFolder);
    
    const dedupedNpmDependencies = getDeps.dedupeDependencies(npmDependencies);

    const toInstall = [];

    for(const packageName in dedupedNpmDependencies)
        for(const version of dedupedNpmDependencies[packageName])
            if((directDependencies[packageName] || []).indexOf(version) === -1) // only install this if it's not already a direct dependency of the origin package. (it's assumed that npm i was already run on the host.)
                toInstall.push(packageName + '@' + version);

    const npmInstallationCommands = [];

    if(toInstall.length)
        npmInstallationCommands.push(`npm i ${originFolder} ${toInstall.join(' ')}`);

    console.log(JSON.stringify({
        npmInstallationCommands,
        npmDependencies,
        tsReferences
    }, null, '   '));
}

main();