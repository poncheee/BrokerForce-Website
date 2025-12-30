# Fix Git Remote - Point to Your Forked Repo

## Current Situation:
- We pushed to: `daniel0tgc/BrokerForce-Website` (your friend's repo)
- You forked it to your own repo
- We need to update the remote to point to YOUR repo

## Solution: Update Git Remote

### Step 1: Find Your Forked Repo URL

Your forked repo should be:
- `https://github.com/poncheee/BrokerForce-Website.git` (or similar)
- Or whatever your GitHub username is

**What's your GitHub username or your forked repo URL?**

### Step 2: Update the Remote

Once we know your repo URL, we'll run:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/BrokerForce-Website.git
```

### Step 3: Verify

```bash
git remote -v
```

Should show your repo, not daniel0tgc's.

### Step 4: Push Again

After updating the remote, we'll push the netlify.toml fix to YOUR repo:

```bash
git push origin main
```

This will trigger Netlify to redeploy with the correct URL.

---

**What's your GitHub username or your forked repo URL?**
