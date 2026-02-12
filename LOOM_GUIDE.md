# 🎥 Loom Video Guide

Record a **3-6 minute** video walkthrough explaining your project.

## 📋 What to Cover

Your video should explain these 5 topics:

### 1. **Turbo Configuration** (1 minute)

Show and explain:
- `pnpm-workspace.yaml` - How packages are linked
- `turbo.json` - Build configuration
- How Turbo manages the monorepo
- Dependencies between packages

**Example script:**
> "This is a TurboRepo monorepo with 3 main directories: apps for applications, packages for shared code. In turbo.json, I've configured the build pipeline where crypto package builds first, then the API and web can build in parallel. The workspace configuration links @repo/crypto to both apps..."

### 2. **How Encryption Works** (1-2 minutes)

Walk through the code:
- `packages/crypto/src/encrypt.ts`
- Explain envelope encryption concept
- Show the two-step process:
  1. Payload encrypted with random DEK
  2. DEK wrapped with master key
- Why this is secure (key rotation, authenticated encryption)

**Show in code:**
```typescript
// Step 1: Generate random DEK
const dek = generateDEK();

// Step 2: Encrypt payload with DEK
const encryptedPayload = encryptWithKey(payloadBuffer, dek);

// Step 3: Wrap DEK with master key
const wrappedDEK = encryptWithKey(dek, masterKey);
```

**Example script:**
> "I used AES-256-GCM with envelope encryption. First, I generate a random 32-byte DEK. Then I encrypt the payload with this DEK using GCM mode, which gives us authenticated encryption - meaning we get both confidentiality and integrity. Then I wrap the DEK with the master key so it can be stored safely. This pattern allows for key rotation without re-encrypting all data..."

### 3. **How Deployment Works** (30 seconds)

Briefly show:
- Your Vercel dashboard with both deployments
- Environment variables set
- The deployed URLs working

**Example script:**
> "I deployed both apps to Vercel. The API is deployed as a serverless function, and I set the MASTER_KEY_HEX environment variable. The frontend is deployed as a Next.js app with NEXT_PUBLIC_API_URL pointing to the API. Both are working in production..."

### 4. **One Bug You Solved** (1 minute)

Pick ONE real issue you encountered and explain:
- What went wrong
- How you debugged it
- How you fixed it

**Example bugs you might have faced:**
- Environment variables not loading in tsx
- CORS errors between frontend and API
- Port conflicts during development
- Validation failing on nonce/tag lengths
- Import path issues with @repo/crypto

**Example script:**
> "One bug I encountered was that the master key wasn't loading in the API. The tsx watch command wasn't reading the .env file. I debugged by adding console.log to check if process.env.MASTER_KEY_HEX existed - it was undefined. I fixed it by adding --env-file=.env flag to the tsx command in package.json. This taught me to always verify environment loading in development."

### 5. **What You'd Improve** (30 seconds - 1 minute)

Mention 2-3 improvements:
- Database persistence (PostgreSQL/SQLite)
- Better error messages
- Rate limiting
- Audit logging
- Key rotation mechanism
- Better UI/UX
- API documentation (Swagger)
- CI/CD pipeline
- Monitoring and alerting

**Example script:**
> "If I had more time, I'd add three things: First, database persistence using PostgreSQL instead of in-memory storage. Second, I'd add audit logging to track all encryption and decryption operations for security compliance. Third, I'd implement a proper key rotation mechanism where we can upgrade the master key version without breaking existing encrypted records..."

---

## 🎬 Recording Tips

### Setup
1. **Use Loom**: https://loom.com (free for 5-minute videos)
2. **Screen + Camera**: Show your face in a corner (builds trust)
3. **Test audio**: Make sure you're clear
4. **Close distractions**: Notifications, extra tabs

### During Recording
- **Start with intro**: "Hi, I'm [Name], this is my Mirfa challenge submission"
- **Be natural**: Don't read from a script word-for-word
- **Show, don't just tell**: Navigate through files, point with cursor
- **Be concise**: Respect the 3-6 minute limit
- **End strong**: "Thanks for watching, excited to discuss further"

### What to Show on Screen
1. **Code editor** with relevant files
2. **Terminal** showing commands running
3. **Browser** with deployed app working
4. **Vercel dashboard** (briefly)

### Common Mistakes to Avoid
- ❌ Don't spend too much time on one topic
- ❌ Don't skip testing the deployed app
- ❌ Don't mumble or rush
- ❌ Don't forget to explain WHY you made decisions
- ❌ Don't go over 6 minutes

---

## 📝 Example Timeline (5 minutes)

```
0:00 - 0:30   Introduction & overview
0:30 - 1:30   Turbo configuration
1:30 - 3:00   Encryption explanation (most important!)
3:00 - 3:30   Deployment walkthrough
3:30 - 4:15   Bug I solved
4:15 - 5:00   Improvements & closing
```

---

## ✅ Checklist Before Recording

- [ ] Test deployed app works end-to-end
- [ ] Prepare which files to show
- [ ] Think of the bug you'll discuss
- [ ] Prepare 2-3 improvements to mention
- [ ] Close unnecessary tabs/apps
- [ ] Test microphone
- [ ] Have notes (but don't read from them)

---

## 🎯 Key Points to Emphasize

These show you understand the requirements:

1. **Security focus**: Explain WHY envelope encryption is better
2. **Production-ready**: Show error handling, validation
3. **Clean architecture**: Explain separation of concerns
4. **Testing**: Mention your 14 tests
5. **TypeScript**: Type safety throughout
6. **Deployment**: Both apps working in production

---

## 🔗 After Recording

1. **Upload to Loom** or YouTube (unlisted)
2. **Get shareable link**
3. **Test the link** in incognito mode
4. **Copy URL** for submission form

---

## 💡 Example Opening

> "Hi! I'm [Name]. This is my submission for the Mirfa Software Engineer challenge. I built a secure transaction encryption system using TurboRepo, Fastify, and Next.js with AES-256-GCM envelope encryption. Let me walk you through how it works..."

## 💡 Example Closing

> "...and that's the system. To summarize: I used envelope encryption for security and key rotation, deployed both apps to Vercel, wrote 14 comprehensive tests, and the entire system is type-safe with TypeScript. If I had more time, I'd add database persistence and audit logging. Thanks for watching - I'm excited to discuss this further!"

---

## 📊 What Evaluators Look For

Based on `others/EVALUATION.md`:

✅ **Good:**
- Clean explanation
- Correct encryption understanding
- Shows deployed app working

✅ **Excellent:**
- Deep security reasoning
- Thoughtful architecture decisions  
- Clear debugging process
- Good communication skills

---

Ready to record? Take a deep breath, you've got this! 🚀

**Remember:** They want to see you can explain your thinking, not just that you coded it.
