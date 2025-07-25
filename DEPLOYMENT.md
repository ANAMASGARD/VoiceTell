# Deployment Instructions for VoiceTell

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
- If you get 404 errors, check the root directory setting
- If environment variables aren't working, check they're set for the right environment
- If builds fail, check the build logs in Vercel dashboard

## Post-Deployment
- Test all functionality
- Update README with live demo URL
- Monitor performance and errors
