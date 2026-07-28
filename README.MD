```markdown
# OnTimeNews

## Quick start — commands to run after cloning

Open a terminal and run the following commands from the repository root.

1) Clone the repository

```bash
git clone <repo-url>
cd OnTimeNews
```

2) Start the backend (Spring Boot / Maven)

Windows (use mvnw.cmd included in the repo):

```powershell
cd news-web-backend
.\mvnw.cmd spring-boot:run
```

macOS / Linux (use the wrapper):

```bash
cd news-web-backend
./mvnw spring-boot:run
```

If you prefer to build first and then run the jar:

```bash
./mvnw clean package
java -jar target/news-web-backend-0.0.0.jar
```

3) Start the frontend (Vite + React)

Open a new terminal tab/window and run:

```bash
cd news-web-frontend
npm install
npm run dev
```

The frontend default dev server (Vite) will print the local URL (typically `http://localhost:5173`).

4) Environment variables

- If the backend or frontend requires environment variables, copy any provided example files (for example, `.env.example`) to `.env` and update the values.

5) Run both together

- Start the backend first, then the frontend in a separate terminal. You can also use a process manager (tmux, terminal tabs, or a dev script) to run both concurrently.

6) Helpful commands

- Run frontend build: `npm run build` (from `news-web-frontend`)
- Run backend tests: `./mvnw test` (from `news-web-backend`)

---

See the files under `news-web-backend` and `news-web-frontend` for more details.
```
