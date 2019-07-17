const fs = require('fs');
const path = require('path');

function readPackageJson(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if(err)
                reject(err);
            else
                resolve(JSON.parse(data));
        });
    });
}

function constructNpmDependencies(source, target = {}) {
    for(const package in source) {
        if(!target[package])
            target[package] = [];

        if(typeof source[package] === 'object')
            Array.prototype.push.apply(target[package], source[package])
        else
            target[package].push(source[package]);
    }

    return target;
}
function joinNpmDependencies(depsA, depsB) {
    return constructNpmDependencies(
        depsA,
        constructNpmDependencies(depsB)
    );
}
function dedupeDependencies(npmDependencies) {
    const output = {}
    
    for(const package in npmDependencies) 
        output[package] = [...new Set(npmDependencies[package])]; // set will prevent duplicates, and then we just throw it back into an array.

    return output;
}

async function getDependencies(contextFolder, packageJsonFile) {
    constFolder = path.resolve(contextFolder);
    const absolutePackageJsonFile = path.resolve(contextFolder, packageJsonFile);

    const packageJsonFolder = path.dirname(absolutePackageJsonFile);
    const packageJson = await readPackageJson(absolutePackageJsonFile); 

    const allNpmDependencies = joinNpmDependencies(packageJson.dependencies, packageJson.devDependencies);

    const thisDependencies = {
        npmDependencies: allNpmDependencies,
        tsReferences: (packageJson.tsReferences || []).map(ref => ({
            packageJson: path.resolve(contextFolder, ref.packageJson),
            from: path.resolve(contextFolder, ref.from),
            to: path.resolve(contextFolder, 'ts_modules', ref.to)
        }))
    }

    if(!packageJson.tsReferences || packageJson.tsReferences.length === 0) {
        return thisDependencies;
    }
    else {
        const recursiveDependencies = await Promise.all(
                                        packageJson
                                            .tsReferences.map(ref => getDependencies(packageJsonFolder, ref.packageJson))
                                    );
        
        return recursiveDependencies
                .reduce((all, current) => ({
                        npmDependencies: joinNpmDependencies(all.npmDependencies, current.npmDependencies),
                        tsReferences: current.tsReferences.concat(all.tsReferences)
                    }), thisDependencies);
    }
}

module.exports = {
    getDependencies,
    dedupeDependencies,
    readPackageJson,
    joinNpmDependencies,
}