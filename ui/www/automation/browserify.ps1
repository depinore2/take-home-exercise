param(
    $entryPoint = "$psscriptroot/../src/index.js",
    $outFile = "$psscriptroot/../dist/--buildnumber--.js",
    $debugMode = $true,
    [switch] $watchMode
)

if($watchMode) {
    write-host "Running browserify in watch mode (watchify)."
}
        
node "$psscriptroot/../node_modules/$(if($WatchMode) { "watchify" } else { "browserify" })/bin/cmd.js" $entryPoint -o $outFile $(if($debugMode) { "--debug" } else { "" })