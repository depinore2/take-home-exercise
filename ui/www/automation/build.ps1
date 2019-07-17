param(
    $BuildNumber = "--buildnumber--",
    [switch] $WithCompat,
    $buildMode = "development"
)

$beginningLocation = get-location;

set-location "$psscriptroot/.."

& "$psscriptroot/../../automation/update-ts-refs.ps1" -workingDirectory "$psscriptroot/.."

$builds = @( @{ friendlyName = "Default Build"; config = "tsconfig.json"; output = "dist/$buildNumber.js" } )

if($WithCompat) {
    $builds = $builds += @{ friendlyName = "Compatibility Build"; config = "tsconfig-compat.json"; output = "dist/compat_$buildNumber.js" }
}

function Clean-TypeScript() {
    node "$psscriptroot/../node_modules/typescript/lib/tsc.js" --build --clean
}

$compiledDirectory = "src"

Clean-TypeScript

foreach($build in $builds) {
    # commands
    $runTsc = { 
        node "$psscriptroot/../node_modules/typescript/lib/tsc.js" -p $build.config`
    }
    $runBrowserify = {
        param($debug = $false)

        & "$psscriptroot/browserify.ps1" "$compiledDirectory/index.js" $build.output $debug
    }
    $runUglify = { node "$psscriptroot/../node_modules/uglify-es/bin/uglifyjs" $build.output -cm -o $build.output }

    write-host "Building $($build.friendlyName)."

    # production mode
    if($buildMode -eq "production" -or $buildMode -eq "prod") {
        & $runTsc
        & $runBrowserify
        & $runUglify
    }
    # development mode
    else {
        & $runTsc
        & $runBrowserify $true
    }

    Clean-TypeScript
}

set-location $beginningLocation