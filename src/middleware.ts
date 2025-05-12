import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/'
])

const isPublicApiRoute = createRouteMatcher([
  '/api/auth(.*)',
  '/api/webhooks(.*)',
  '/api/health(.*)',
  '/api/synthesize-speech(.*)',
  '/api/text-to-speech(.*)',
  '/api/ai-chat(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  console.log('auth', auth)
  if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
    await auth.protect();
  }
  // If the user is signed in, continue to the requested page
  // If the user is not signed in, redirect to the sign-in page
  
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}