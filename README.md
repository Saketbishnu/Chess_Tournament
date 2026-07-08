# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.16.2 create --template minimal --no-types --install npm .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

 ## Overall Architecture

                User
                  │
                  ▼
         Svelte Frontend (UI)
                  │
        CRUD Requests (HTTP)
                  │
                  ▼
      SvelteKit Server (Backend)
                  │
          SQL Queries
                  │
                  ▼
          PostgreSQL Database

##  Overall Flow of the project

     Admin opens website
        │
        ▼
     Create Players
        │
        ▼
     Create Tournament
        │
        ▼
     Add Players
        │
        ▼
     Start Tournament
        │
        ▼
     Random Match Generation
        │
        ▼
     Random Winner Selection
        │
        ▼
     Store Results
        │
        ▼
     Show Rankings

##  Our project will have four tables.

       Players

          ↓

     Tournaments

         ↓

     TournamentPlayers

         ↓

      Matches