# Deployment Instructions for VoiceTell

## ⚠️ CRITICAL STEPS TO FIX 404 ERRORS

### 🔥 STEP 1: Vercel Project Settings (MUST DO FIRST)
1. Go to your Vercel project dashboard
2. Click **Settings** tab
3. In **General** section:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (CRITICAL!)
   - **Build Command**: `bun run build`
   - **Output Directory**: Leave empty (Next.js auto-detects)
   - **Install Command**: `bun install`
   - **Development Command**: `bun run dev`

### 🔥 STEP 2: Environment Variables (CRITICAL!)
In **Settings** → **Environment Variables**:
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://chaudharygaurav2004--audio-cnn-inference-audioclassifier-3d645a.modal.run`
- **Environments**: ✅ Production ✅ Preview ✅ Development

### 🔥 STEP 3: Functions & Compatibility
In **Settings** → **Functions**:
- **Node.js Version**: 18.x
- **Region**: Washington, D.C., USA (iad1)

## Prerequisites
1. Ensure your Modal backend is deployed and working
2. Have your Vercel account ready
3. Test the application locally first

## Vercel Deployment Steps

### 1. Environment Variables
In your Vercel dashboard, add these environment variables:

**Name**: `NEXT_PUBLIC_API_URL`
**Value**: `https://chaudharygaurav2004--audio-cnn-inference-audioclassifier-3d645a.modal.run`
**Environments**: Production, Preview, Development

### 2. Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `bun run build`
- **Output Directory**: `.next`
- **Install Command**: `bun install`
- **Development Command**: `bun run dev`

### 3. Advanced Settings
- **Node.js Version**: 18.x
- **Function Region**: Washington, D.C., USA (iad1)

### 4. Deploy via CLI (Alternative)
```bash
cd frontend
vercel
# Follow the prompts
# When asked for settings, use the values above
```

### 5. Deploy via GitHub Integration
1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Configure the environment variables
4. Deploy

## Testing the Deployment
1. Visit your deployed URL
2. Try uploading an audio file
3. Check the browser console for any errors
4. Verify the API calls are working

## Troubleshooting
- **If you get 404 errors:**
  - Check the root directory setting is set to `frontend`
  - Ensure the build completed successfully
  - Verify environment variables are set for Production environment
  - Check that Node.js version is set to 18.x in Vercel settings
  - Make sure the Framework Preset is set to "Next.js"
  
- **If environment variables aren't working:**
  - Check they're set for the right environment (Production, Preview, Development)
  - Verify the variable name is exactly: `NEXT_PUBLIC_API_URL`
  - Ensure there are no extra spaces in the URL value
  
- **If builds fail:**
  - Check the build logs in Vercel dashboard
  - Verify all dependencies are correctly installed
  - Check for any TypeScript or ESLint errors
  
- **Common Vercel 404 Issues:**
  - Wrong root directory (should be `frontend`)
  - Missing or incorrect vercel.json configuration
  - App Router not properly configured
  - Missing environment variables

## Post-Deployment
- Test all functionality
- Update README with live demo URL
- Monitor performance and errors
