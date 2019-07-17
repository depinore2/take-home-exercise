# build and browserify it fully once, before beginning watch mode.
set-location "$psscriptroot/.."
& "./automation/build.ps1"

#do it again, but in watch mode now.
$tscCmd = "`'$(resolve-path ./node_modules/.bin/tsc) -p $(resolve-path tsconfig.json) --watch`'"
$browserifyCmd = "`'pwsh $(resolve-path "./automation/browserify.ps1") -watchMode`'"
$httpCmd = "`'$(resolve-path ./node_modules/.bin/http-server) -s -o -c-1`'"

$wholeCommand = "$(resolve-path ./node_modules/.bin/concurrently) $tscCmd $browserifyCmd $httpCmd"

write-host $wholeCommand

& ([Scriptblock]::Create($wholeCommand))