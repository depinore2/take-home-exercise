declare const build_environment: string; // this is defined in index.html, and is set during the build process, using build-prod.ps1

export const message = 'hello world!';
export const environmentName = build_environment;

export const backEndUrl = 'http://localhost:3000';