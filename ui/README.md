# Edgar's Web Component Starter #

## Why? ##

Because you want to use plain ol [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) and as few layers of abstraction as possible.  

Because you believe that it's important to be able to easily see what's going on inside of your code.  

Because you think shell scripts are a programmer's best friend.

## Tooling ##
* Some [PowerShell Core](https://github.com/powershell/powershell) Scripts, located in /automation and /www/automation.  If you don't already have it on your system, please download it at the link.
* [TypeScript](https://www.typescriptlang.org/), because typos suck.
* [Browserify](http://browserify.org) because it's simple.
* [http-server](https://www.npmjs.com/package/http-server) for development server.

## Libraries out of the box ##
* [routie](https://github.com/jgallen23/routie) for routing.
* [DOMPurify](https://github.com/cure53/DOMPurify) To help you with protecting your HTML.

## How do I run this? ##

Simply run `./www/automation/run.ps1` from the root of the repository in a `pwsh` terminal.

Every time you make a change to any of your TypeScript files, it will recompile your source code.  Make sure to reload your browser, and ensure the browser cache is turned off.
* [Disabling cache in Chrome](https://www.technipages.com/google-chrome-how-to-completely-disable-cache)
* [Disabling cache in Firefox](https://dzone.com/articles/how-turn-firefox-browser-cache)
* [Disabling cache in Internet Explorer 11](https://stackoverflow.com/questions/18083239/what-happened-to-always-refresh-from-server-in-ie11-developer-tools)
* [Disabling cache in Safari](https://forums.developer.apple.com/thread/87664)

Note: this workflow is only for working in the `www` folder.  For core or test, please use `tsc --watch`.

## Repo Structure ##
* www - The main project, which is what holds all assets that will be deployed to a web server.
* core - Put most of your core logic here.  Separate your pure logic out of your web code, and put it all here.  It'll make testing easier.
* test - A unit testing project that has a reference to core.  I'm of the philosophy that unit tests are best suited to pure logic, not UI testing--so focus on just testing pure logic here.

## Working in Core or Test ##
* I recommend you run TypeScript in watch mode (`tsc --watch`).
* If you make any changes to a tsReference, make sure to run `{thisFolder}/automation/update-ts-refs.ps1`, which will update your folder's copy of its dependent source code.
  * For example, if you make a change to `core` while working on `test`, simply do: `pwsh 'test/automation/update-ts-refs.ps1'`, and it will pull in the latest copy of core into test.

## Building for Production ##
Run `automation/build-prod.ps1` from `pwsh`.  It takes two parameters:
* buildNumber
* destinationFolder

Example: 
~~~
pwsh automation/build-prod.ps1 -buildNumber 1.2.3.4 -destinationFolder ../out
~~~

It will do the following:
* Put all assets in a folder of your choosing.
* Build and minify all assets.
* Build an IE11 compatibilty mode build
* Keep only blob patterns listed in your package.json `prodAssets` section
* Remove all `node_modules` and reinstall only dependencies (effectively removing all devDependencies).
* Any file that contains the string "--buildnumber--" will be replaced with the buildNumber you've provided.  This is used in the index.html to provide a unique build number and break the cache.

## Internet Explorer 11 ##
Care has been taken to make sure IE 11 can be supported.  If you work for an enterprise where a large part of your clients still use IE11 (like me), then this is key.

When in `run` mode, it will not automatically create the compatibility assets.  However, you can test your IE build using:
~~~
./www/test-compat.ps1
~~~
in `pwsh`, from the root of the repository.  This will run `/automation/build.ps1 -withCompat`, and then start `http-server`.

Furthermore, [ES6 promise](https://www.npmjs.com/package/es6-promise) and [fetch](https://github.com/github/fetch) polyfills are automatically included and loaded in compatibility mode.

## tsreferences.json ##
Any mappings that you provide in this folder will pull from other locations on disk and place them into your ts references folder (`ts_modules` by default) at build time.

This is useful if you want to reuse TypeScript source code from other projects, but need full control over how it is compiled.  The BaseWebComponent class uses this approach: It comes from `https://github.com/depinore/wclibrary`, is installed as npm module, and then pulled into your ts_modules.

This is different from tsc's built-in "references" compiler option in that it guarantees that your reference is built using the host's compilation settings.

This gives us the leverage to compile it both in regular mode and compatibility mode.

You can feel free to organize your application into as many typescript projects as you want, and simply add tsreferences to bring them in as dependencies.

## Further Reading ##

For more detailed information regarding the automation scripts, please run
```
get-help <path/to/powershell/script>
```
from a `pwsh` terminal.  

For more information regarding Web Components, I highly recommend the [official Mozilla Foundation web components documentation](https://developer.mozilla.org/en-US/docs/Web/Web_Components).