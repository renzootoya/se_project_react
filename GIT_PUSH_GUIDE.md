# How to Push Project 14 to GitHub

## Step 1: Initialize Git (if not already done)

```bash
cd "/Users/apple/Desktop/Renzo /project 14"
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: WTWR full-stack app with authentication and clothing management"
```

## Step 4: Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/renzootoya/se_project_react.git
```

## Step 5: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## If Repository Already Exists

If the repository already has content, use:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Verify Push

Check your GitHub repository at:
```
https://github.com/renzootoya/se_project_react
```

## What Gets Pushed

✅ Frontend code (React app)
✅ Backend code (Express server)
✅ Database models
✅ Configuration files
✅ Documentation (README, guides)
✅ Sample data seeding script

## .gitignore Already Configured

The following are automatically ignored:
- `node_modules/`
- `.env` (environment variables - never commit!)
- `.DS_Store`
- `*.log`

## After Push

Your GitHub repository will contain:
- Complete frontend with all components
- Complete backend with all routes
- JWT authentication system
- MongoDB integration
- Sample clothing items
- Full documentation
