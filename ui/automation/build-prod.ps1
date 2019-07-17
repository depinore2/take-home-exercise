param(
    [Parameter(Mandatory=$true)]$buildNumber,
    [Parameter(Mandatory=$true)]$destinationFolder,
    [Parameter(Mandatory=$true)]$environment
)

$begin = get-date

# Ensure the detination folder is an absolute path, and resolve it even if it may not exist.
$destinationFolder = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($destinationFolder)

remove-item $destinationFolder -recurse -force -erroraction silentlycontinue

function ChangeLocation($loc) {
    $loc = resolve-path $loc
    write-host "Navigating to $loc"
    set-location $loc
}

$originalLocation = get-location

$sourceDirectory = "$psscriptroot/../"

ChangeLocation $sourceDirectory

write-host "First removing any node_modules if there are any, as it tends to slow everything down..."
get-childitem node_modules -recurse | remove-item -recurse -force

write-host "Copying everything to $destinationFolder"
copy-item (resolve-path "$sourceDirectory*") $destinationFolder -recurse -force
ChangeLocation "$destinationFolder/www"

remove-item node_modules -recurse -force -erroraction silentlycontinue

get-childitem *.html -recurse | 
    foreach-object { 
        write-host "Replacing buildNumber in $($_.fullname)"

        (get-content $_.fullname -raw) -ireplace '--buildnumber--',$buildNumber | set-content $_.fullname
    }

write-host "Adding the appropriate environment."
(get-content index.html -raw) -replace "<head>","<head>`n`t<script>`n`t`t//This was added by build-prod.ps1`n`t`twindow.build_environment = '$environment';`n`t</script>" |
    set-content index.html

& "./automation/build.ps1" -buildNumber $buildNumber -withCompat -buildMode production

write-host "Removing all NPM devDependencies."
remove-item node_modules -recurse -force
npm i --only=prod

write-host "Removing everything except www"
get-childitem -path '..' | where-object FullName -ne (get-location) | remove-item -recurse -force

$packageJsonPath = resolve-path package.json
write-host "Reading and parsing $(resolve-path $packageJsonPath)"
$packageJson = get-content $packageJsonPath -raw | convertfrom-json

foreach($prodAssetPattern in $packageJson.prodAssets) {
    write-host "Looking for child items that match pattern $prodAssetPattern in $(get-location)"
    $matchedFiles = get-childitem -filter $prodAssetPattern

    foreach($matchedFile in $matchedFiles) {
        write-host "Moving $($matchedFile.fullname) to $(resolve-path ..)"
        move-item $matchedFile.fullname ".." -force
    }
}

write-host "Finally, removing $(get-location)"
set-location ..
remove-item www -recurse -force

ChangeLocation $originalLocation

$totalDuration = new-timespan -start $begin -end (get-date)
write-host "Completed production build; took $($totalDuration.totalseconds) seconds." 