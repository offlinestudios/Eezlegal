# 🔐 NextAuth Setup Instructions

## 🚨 **Important: Auth Files Removed for Git Upload**

The NextAuth authentication files were temporarily removed because the directory name `[...nextauth]` contains special characters that GitHub's web interface cannot handle.

## 📁 **Missing Directory Structure:**
```
app/api/auth/[...nextauth]/route.ts
```

## 🔧 **How to Add Authentication After Upload:**

### **Method 1: GitHub Web Interface (Recommended)**

1. **After uploading the main project to GitHub:**
   
2. **Create the auth directory structure:**
   - Navigate to `app/api/` in your GitHub repository
   - Click "Create new file"
   - Type: `auth/[...nextauth]/route.ts`
   - GitHub will automatically create the nested directories

3. **Add the NextAuth route file:**
   ```typescript
   import NextAuth from 'next-auth';
   import GoogleProvider from 'next-auth/providers/google';
   import { PrismaAdapter } from '@next-auth/prisma-adapter';
   import { prisma } from '@/lib/prisma';

   const handler = NextAuth({
     adapter: PrismaAdapter(prisma),
     providers: [
       GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       }),
     ],
     pages: { 
       signIn: '/login' 
     },
     callbacks: {
       async redirect({ url, baseUrl }) {
         const urlObj = new URL(url, baseUrl);
         const next = urlObj.searchParams.get('next');
         
         if (next && next.startsWith('/')) {
           return `${baseUrl}${next}`;
         }
         
         return `${baseUrl}/app`;
       },
       async session({ session, user }) {
         if (session.user && user) {
           session.user.id = user.id;
         }
         return session;
       },
     },
     session: { 
       strategy: 'jwt' 
     },
     secret: process.env.NEXTAUTH_SECRET,
   });

   export { handler as GET, handler as POST };
   ```

4. **Commit the file**

### **Method 2: Git Command Line**

If you have git CLI access:

```bash
# Clone your repository
git clone your-repo-url
cd your-repo

# Create the auth directory (CLI handles special characters fine)
mkdir -p "app/api/auth/[...nextauth]"

# Add the route.ts file (copy content from above)
# Then commit and push
git add .
git commit -m "Add NextAuth authentication"
git push
```

### **Method 3: Use Provided Files**

I've created a separate `nextauth-files` folder with the correct structure. You can:

1. Download the `nextauth-files.zip` 
2. Extract it locally
3. Copy the files to your local git repository
4. Push via git CLI

## ✅ **What This Enables:**

Once you add these files, your website will have:

- ✅ **Google OAuth Login** - "Continue with Google" button works
- ✅ **Session Management** - Users stay logged in
- ✅ **Protected Routes** - `/app` area requires authentication
- ✅ **Automatic Redirects** - Users go to `/app` after login
- ✅ **Database Integration** - User data stored in PostgreSQL

## 🚨 **Without These Files:**

- ❌ **No authentication** - Login buttons won't work
- ❌ **No protected routes** - Anyone can access `/app`
- ❌ **Website partially broken** - Core functionality missing

## 🎯 **Priority:**

**Upload the main project first**, then add the auth files. The website will work for browsing, but authentication features will be disabled until you add the NextAuth files.

## 📞 **Need Help?**

The auth setup is critical for your website functionality. If you have trouble with any of these methods, let me know and I can provide alternative solutions!

