# ♟️ Chess Tournament Management System

A web-based Chess Tournament Management System developed using **SvelteKit** and **PostgreSQL**.

The application allows administrators to manage chess tournaments by creating players, organizing tournaments, assigning players, generating random matches, selecting winners automatically, and displaying tournament rankings.

---

# 🚀 Features

## Dashboard

- Display total players
- Display total tournaments
- Display total generated matches
- Display top-ranked player

---

## Player Management

- Add Player
- View Players
- Update Player
- Delete Player

---

## Tournament Management

- Create Tournament
- View Tournament
- Update Tournament
- Delete Tournament

---

## Player Assignment

- Assign multiple players to tournaments
- Remove assigned players
- Save tournament participants

---

## Match Generation

- Randomly shuffle players
- Automatically generate matches
- Randomly select winners
- Support odd number of players using BYE
- Regenerate matches for a tournament
- Previous matches for the selected tournament are replaced

---

## Ranking

- Count player wins
- Display rankings
- Sort by:
  - Highest Wins
  - Highest Rating (Tie Breaker)

---

## Responsive UI

- Desktop
- Tablet
- Mobile

---

# 🛠 Tech Stack

| Technology | Used |
|------------|------|
| Svelte | ✅ |
| SvelteKit | ✅ |
| PostgreSQL | ✅ |
| JavaScript | ✅ |
| CSS | ✅ |

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/Saketbishnu/Chess_Tournament.git
```

Go into the project

```bash
cd Chess_Tournament
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=chess_tournament
```

Run the project

```bash
npm run dev
```

Open

```
http://localhost:5173
```

---

# 🏗 System Architecture

```
                User
                  │
                  ▼
          Svelte Frontend
                  │
             Fetch API
                  │
                  ▼
        SvelteKit Backend
                  │
          PostgreSQL Queries
                  │
                  ▼
         PostgreSQL Database
```

---

# 🔄 Application Workflow

```
Dashboard
      │
      ▼
Create Players
      │
      ▼
Create Tournament
      │
      ▼
Assign Players
      │
      ▼
Generate Matches
      │
      ▼
Random Winner Selection
      │
      ▼
Save Match Results
      │
      ▼
Calculate Rankings
      │
      ▼
Display Dashboard Statistics
```

---

# 🗄 Database Schema

The project uses four relational tables.

```
Players
     │
     ├──────────────┐
     │              │
     ▼              │
Tournament_Players  │
     ▲              │
     │              │
Tournaments         │
                    │
                    ▼
                 Matches
```

---

## Players

| Column | Type |
|---------|------|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(100) |
| age | INTEGER |
| rating | INTEGER |
| country | VARCHAR(100) |
| created_at | TIMESTAMP |

---

## Tournaments

| Column | Type |
|---------|------|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(100) |
| location | VARCHAR(100) |
| start_date | DATE |
| created_at | TIMESTAMP |

---

## Tournament Players

| Column | Type |
|---------|------|
| id | SERIAL PRIMARY KEY |
| tournament_id | INTEGER |
| player_id | INTEGER |

---

## Matches

| Column | Type |
|---------|------|
| id | SERIAL PRIMARY KEY |
| tournament_id | INTEGER |
| player1_id | INTEGER |
| player2_id | INTEGER |
| winner_id | INTEGER |
| created_at | TIMESTAMP |

---

# 📂 Project Structure

```
src
│
├── lib
│   └── server
│       └── db.js
│
└── routes
    ├── +page.svelte
    ├── +server.js
    │
    ├── players
    │   ├── +page.svelte
    │   └── +server.js
    │
    ├── tournaments
    │   ├── +page.svelte
    │   └── +server.js
    │
    ├── matches
    │   ├── +page.svelte
    │   └── +server.js
    │
    ├── ranking
    │   ├── +page.svelte
    │   └── +server.js
    │
    └── contact
        └── +page.svelte
```

---

# 🖥 Application Pages

- Home Dashboard
- Player Management
- Tournament Management
- Match Generation
- Rankings
- Contact

---

# 📸 Screenshots

Add screenshots here.

```
screenshots/

home.png

players.png

tournaments.png

matches.png

ranking.png

contact.png
```

---

# 🔮 Future Improvements

- Swiss Tournament Pairing
- Authentication
- Tournament History
- Export Results to PDF
- Email Notifications

---

# 👨‍💻 Author

**Saket Bishnu**

B.Tech CSE (Big Data Analytics)

SRM Institute of Science and Technology

GitHub:
https://github.com/Saketbishnu