param(
    [Parameter(Mandatory=$true)] $workingDirectory,
    [switch] $skipNpm
)

$beginningLocation = Get-Location
set-location $workingDirectory

if(!$skipNpm) {
    write-host "Installing own npm dependencies in $(get-location)"
    npm i # first thing's first: install all local modules.
}

$updateRefsOutput = node "$psscriptroot/update-ts-refs.js" $workingDirectory | convertfrom-json

if(!$skipNpm) {
    # run all NPM commands
    foreach($cmd in $updateRefsOutput.npmInstallationCommands) {
        write-host "Command: $cmd`nCWD: $(get-location)"
        & ([Scriptblock]::Create($cmd))
    }
}

# make a copy of all tsReference mappings
foreach($map in $updateRefsOutput.tsReferences) {
    remove-item $map.to -recurse -force -erroraction silentlycontinue
    copy-item -path $map.from -destination $map.to -recurse
}

set-location $beginningLocation