# AppFit Javascript SDKs

A monorepo for the AppFit Javascript SDKs.

Included packages:
* **Browser** - NPM-hosted library for use with web apps
* **CDN** - a cdn-hosted bundle of the SDK. It wraps the browser library.
* **Server** - a server-based version of the SDK
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
1. Update snippet in docs, if it was changed. (See section below)

## Testing
1. Test the packages:
   ```shell
   npm run test
   ```
   
## Updating browser script snippet
In the documentation, we give users a `<script>` tag to insert in a webpage. This code loads AppFit from a CDN.

This tag is generated by the build and just needs to be pasted into the documentation.
1. Run the build
2. In the `cdn/dist/snippet` folder, is a `snippet.html`
3. Copy the code into the documentation. It's probably good to add some newlines to make it clearer where to paste the API key.
