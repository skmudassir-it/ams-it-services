# Deploying to Dokploy

This folder is a complete Docker build context: the `Dockerfile` builds the React site and runs the Node.js API, which serves the site and the SQLite database on one port (5000).

## 1. Create the application

In Dokploy go to **Project → Create Service → Application**, then pick one:

- **Drop / Upload:** choose *Drop* as the source and upload `ams-it-services-dokploy.zip`, which is in this folder.
- **Git:** push this folder to a repository and connect it.

In **Build Type**, choose **Dockerfile** with path `Dockerfile` and context `.`.

## 2. Environment variables (Environment tab)

```
JWT_SECRET=<long random string, e.g. 64 hex characters>
ADMIN_EMAIL=mudassir@amsitservices.com
ADMIN_PASSWORD=<strong password>
ADMIN_NAME=Mudassir Shaik
CHAT_BASE_URL=https://llm.amsventures.co.in
CHAT_API_KEY=<your gateway key>
CHAT_MODEL=auto
```

Optional settings:
- `ANTHROPIC_API_KEY`: used by the chat bot if no gateway is set.
- `COOKIE_SECURE=false`: only while testing over plain `http://`. Logins need HTTPS otherwise.

`PORT`, `NODE_ENV` and `DB_PATH` are already set in the image.

## 3. Persistent storage (Advanced → Volumes)

Add a **Volume mount** with mount path **`/app/data`**, using any volume name (for example `ams-data`).

This keeps users, messages, subscribers and CMS edits across redeploys. Without it, the database resets on every deploy.

## 4. Domain (Domains tab)

Add your domain (e.g. `amsitservices.com`) with **container port `5000`** and HTTPS enabled (Let's Encrypt).

## 5. Deploy

Click **Deploy**. When the health check (`/api/health`) passes, open the domain. Sign in at `/login` with the admin email and password above to reach `/admin`.

## Updating

To update, make your changes in the main project folder and run `npm run package:docker` to rebuild this `dist` folder and its zip. Then upload the new zip or push to git, and redeploy.
