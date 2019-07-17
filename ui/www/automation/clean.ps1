get-childitem -path "$psscriptroot/../dist*" |
remove-item -recurse -force

node "$psscriptroot/../node_modules/typescript/lib/tsc.js" --build --clean

remove-item "ts_modules" -recurse -force -erroraction silentlycontinue