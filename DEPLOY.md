# Deploying to Dokploy

This folder is a complete Docker build context: the `Dockerfile` builds the React site and runs the Node.js API, which serves the site and the SQLite database on one port (5000).

## 1. Create the application

In Dokploy go to **Project → Create Service → Application**, then pick one:

- **Drop / Upload:** extract the three `ams-it-services-partN-of-3.zip` files into one folder. Zip that folder's contents so the `Dockerfile` sits at the zip root, choose *Drop* as the source, and upload the zip.
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

Email (GoDaddy SMTP) handles verification codes, password resets and notifications:

```
SITE_URL=https://amsitservices.com
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=mudassir@amsitservices.com
SMTP_PASS=<mailbox password>
MAIL_FROM=mudassir@amsitservices.com
MAIL_FROM_NAME=AMS IT Services
ADMIN_NOTIFY_EMAIL=mudassir@amsitservices.com
```

**Dokploy only applies environment changes on a redeploy.** After adding or editing variables, click **Deploy** again. The app's first log lines show `Email: SMTP connected …` when it worked; `Email: SMTP not configured` means the variables didn't reach the container.

If your GoDaddy email is Microsoft 365, use `SMTP_HOST=smtp.office365.com`, `SMTP_PORT=587` and `SMTP_SECURE=false`, and make sure SMTP AUTH is enabled for the mailbox. After deploying, open **Admin → Overview → Email (SMTP)** and click **Send test**.

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

## Split zips (ams-it-services-part1/2/3-of-3.zip)

These hold the same content as the single zip, split into three standalone zips of about 7 MB each for upload limits. Extract **all three into the same folder** to rebuild the full project:
- Part 1 has the Dockerfile and all the code.
- Parts 2 and 3 have the images.

Dokploy's Drop upload needs one zip, so extract the three parts, zip that folder again, and upload it. `npm run package:docker` regenerates the folder and the three parts.

## Updating

To update, make your changes in the main project folder and run `npm run package:docker` to rebuild this `dist` folder and its zip. Then upload the new zip or push to git, and redeploy.
