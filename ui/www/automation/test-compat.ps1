& "$psscriptroot/build.ps1" -withcompat
set-location "$psscriptroot/../"
& node_modules/.bin/http-server