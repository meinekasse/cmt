This is a [Blitz.js](https://github.com/blitz-js/blitz) app.

# **cmt (company-management-tool)**

## Prerequired Software

- [Docker](https://docs.docker.com/get-docker/)


## Getting Started

First install the dependencies:

```
yarn
```


Run your app in the development mode.

```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Ensure the `.env.local` file has required environment variables:

```
DATABASE_URL=postgresql://root:root@localhost:5432/cmt
```

Ensure the `.env.test.local` file has required environment variables:

```
DATABASE_URL=postgresql://root:root@localhost:5432/cmt_test
```

## Tests

Runs your tests using Jest.

```
yarn test
```

Blitz comes with a test setup using [Jest](https://jestjs.io/) and [react-testing-library](https://testing-library.com/).

## Commands

[Blitz](https://blitzjs.com/) comes with a powerful CLI that is designed to make development easy and fast. You can install it with `npm i -g blitz`

```
  blitz [COMMAND]

  dev       Start a development server
  build     Create a production build
  start     Start a production server
  export    Export your Blitz app as a static application
  prisma    Run prisma commands
  generate  Generate new files for your Blitz project
  console   Run the Blitz console REPL
  install   Install a recipe
  help      Display help for blitz
  test      Run project tests
```

You can read more about it on the [CLI Overview](https://blitzjs.com/docs/cli-overview) documentation.

## What's included?

- PDF Creation
- PDF Backups in Database
- Receipt creation from external provider [codecrete](https://codecrete.net/qrbill/bill)

