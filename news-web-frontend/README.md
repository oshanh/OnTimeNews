# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## User flow (example)

This section describes the typical user flows for visitors and administrators, and gives copy-paste examples for common actions.

- Frontend base URL: the dev server usually runs at `http://localhost:5173`.
- API base URL: configured via `VITE_API_BASE_URL` (defaults to `http://localhost:8080/api`).

- Visitor flow — read and comment
	1. Open the site at `http://localhost:5173`.
	2. Click a category card to see headlines for that category.
	3. Click a headline to open the article page.
	4. Scroll to the comments panel and post a comment using the form.

	Example POST payload (frontend sends JSON to `/api/news/{newsId}/comments`):

	```bash
	curl -X POST "http://localhost:8080/api/news/123/comments" \
		-H "Content-Type: application/json" \
		-d '{"authorName":"Alice","message":"Nice article!"}'
	```

- Admin flow — create / update / delete news and comments
	1. Visit `http://localhost:5173/admin`.
	2. Sign in with the admin username/password you set for the backend (via `ADMIN_USER` / `ADMIN_PASS`).
	3. Use the dashboard to create a new article, selecting one or more categories.
	4. Use the list view to delete news items or delete comments via the API.

	Example: create a news item with curl (Basic auth; replace credentials):

	```bash
	curl -X POST "http://localhost:8080/api/admin/news" \
		-u admin:admin \
		-H "Content-Type: application/json" \
		-d '{
			"title":"New Feature Launch",
			"summary":"Short summary",
			"content":"Full article content...",
			"imageUrl":"https://example.com/image.jpg",
			"publishedAt":"2026-07-28T12:00:00",
			"categoryIds":[1,2]
		}'
	```

	Example: delete a comment (admin):

	```bash
	curl -X DELETE "http://localhost:8080/api/admin/comments/456" -u admin:admin
	```

Security note: the current admin auth is Basic auth validated against environment variables and the frontend keeps credentials only in memory. This setup is intended for local development. For production, consider using HTTPS + a proper auth solution (Spring Security, hashed passwords, tokens).
