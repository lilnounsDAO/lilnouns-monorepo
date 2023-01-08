# lilnouns-monorepo

Nouns DAO is a generative avatar art collective run by a group of crypto misfits.

## Contributing

If you're interested in contributing to Lil Nouns DAO repos we're excited to have you. Please discuss any changes in `#developers` in [discord.gg/lilnouns](https://discord.gg/lilnouns) prior to contributing to reduce duplication of effort and in case there is any prior art that may be useful to you.

## Packages

### nouns-api

The [nouns api](packages/nouns-api) is an Node app that hosts the PropLot GraphQL and REST servers using express.js. The API uses Postgres for data storage and Prisma as an ORM.

### nouns-assets

The [nouns assets](packages/nouns-assets) package holds the Noun PNG and run-length encoded image data.

### nouns-bots

The [nouns bots](packages/nouns-bots) package contains a bot that monitors for changes in Noun auction state and notifies everyone via Twitter and Discord.

### nouns-contracts

The [nouns contracts](packages/nouns-contracts) is the suite of Solidity contracts powering Nouns DAO.

### nouns-sdk

The [nouns sdk](packages/nouns-sdk) exposes the Nouns contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### nouns-subgraph

In order to make retrieving more complex data from the auction history, [lilnouns subgraph](packages/nouns-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### nouns-webapp

The [nouns webapp](packages/nouns-webapp) is the frontend for interacting with Noun auctions as hosted at [lilnouns.wtf](https://lilnouns.wtf).

## Quickstart

### Install dependencies

```sh
yarn
```

If you are using a M1 Macbook and are having installation issues then see the **M1 Macbook issues** section below.

### Build all packages

```sh
yarn build
```

### Run Linter

```sh
yarn lint
```

### Run Prettier

```sh
yarn format
```

## M1 Macbook issues

If you are on a M1 Macbook and have used homebrew to configure your machine you may have issues when running `yarn install` due to the `sharp` module. Look out for this in your cli logs:

```
lilnouns-monorepo/node_modules/sharp: Command failed.
Exit code: 1
```

You should be able to fix this and get past the install step by ensuring you are using Node version >=16 and running `brew uninstall vips`. After uninstalling the brew installation of vips the above error should disappear when running `yarn install` and you should now be able to run the applications.

## Adding a dependency

From the root of the monorepo run `yarn workspace @nouns/<PACKAGE> add <NPM_PACKAGE>`. e.g. to add the `uuid` npm package to the webapp you would run `yarn workspace @nouns/webapp add uuid`.

You can also cd into the package where you want to add the npm package and run `yarn add <NPM_PACKAGE>`
