# AppFit Javascript SDKs

A monorepo for the AppFit Javascript SDKs.

Included packages:
* **Browser** - NPM-hosted library for use with web apps
* **CDN** - a cdn-hosted bundle of the SDK. It wraps the browser library.
* **Node** - a server-based version of the SDK
* **Shared** - NPM-hosted library shared by other packages

## Setup
1. Install NVM and run `nvm use` to switch to the proper Node version
1. Install dependencies:
    ```shell
    npm i
    ```
    **NOTE:** This is a mono repo, so there is only one `node_modules` for all projects.

## Building
1. Build all the packages:
   ```shell
   npm run build
   ```

## Deployment
1. Version & tag the packages (*this will push the tags!*):
   ```shell
   npm run deploy:version
   ```
   Use the prompts to bump each package.
1. Push to `prod` branch to publish to NPM and update the CDN.

## Testing
1. Test the packages:
   ```shell
   npm run test
   ```
