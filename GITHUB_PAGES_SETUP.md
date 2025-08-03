# GitHub Pages Setup Guide

This guide will help you set up GitHub Pages for the Vue Tour Guide demo.

## Prerequisites

1. **Repository Setup**: Make sure your repository is pushed to GitHub
2. **Repository Settings**: You need admin access to the repository

## Step-by-Step Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### 2. Configure Repository Permissions

1. Go to **Settings** > **Actions** > **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

### 3. Verify Workflow Files

Make sure these files exist in your repository:
- `.github/workflows/deploy-demo.yml` (or `deploy-demo-v2.yml`)
- `vite.demo.config.mjs`
- `package.json` with `build:demo` script

### 4. Trigger Deployment

The demo will be automatically deployed when you:
- Push to the `main` branch
- Manually trigger the workflow (if using v2 workflow)

### 5. Access Your Demo

Once deployed, your demo will be available at:
```
https://[your-username].github.io/v-tour-guide/
```

## Troubleshooting

### Permission Denied Error

If you see a "Permission denied" error:

1. **Check Repository Settings**:
   - Go to Settings > Pages
   - Ensure "GitHub Actions" is selected as source

2. **Check Workflow Permissions**:
   - Go to Settings > Actions > General
   - Ensure "Read and write permissions" is selected

3. **Check Branch Protection**:
   - Go to Settings > Branches
   - Ensure the `main` branch allows GitHub Actions to push

### Build Failures

If the build fails:

1. **Check Node.js Version**: The workflow uses Node.js 20
2. **Check Dependencies**: Ensure all dependencies are properly installed
3. **Check Config Files**: Verify `vite.demo.config.mjs` exists

### Manual Deployment

If automatic deployment doesn't work:

1. **Build Locally**:
   ```bash
   npm run build:demo
   ```

2. **Deploy Manually**:
   - Go to Settings > Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
   - Set folder to `/ (root)`

## Alternative Workflow

If the main workflow doesn't work, try the alternative workflow:

1. Rename `.github/workflows/deploy-demo-v2.yml` to `.github/workflows/deploy-demo.yml`
2. Push the changes
3. The v2 workflow uses the newer GitHub Pages deployment action

## Support

If you continue to have issues:

1. Check the **Actions** tab in your repository for detailed error logs
2. Ensure your repository is public (or you have GitHub Pro for private repos)
3. Verify that GitHub Pages is enabled in your repository settings

## Local Testing

Before pushing to GitHub, test locally:

```bash
# Install dependencies
npm install

# Build demo
npm run build:demo

# Check the build output
ls -la dist-demo/
```

The demo should build successfully and be ready for deployment. 