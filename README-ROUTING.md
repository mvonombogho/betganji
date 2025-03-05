# BetGanji Routing Structure

## Current Routing Issue

This project currently has two parallel routing structures that are causing conflicts:

1. **Client-side routes** at the root level:
   - `/src/app/dashboard/page.tsx`
   - `/src/app/matches/page.tsx`
   - `/src/app/predictions/page.tsx`

2. **Server-side routes** using a route group:
   - `/src/app/(dashboard)/dashboard/page.tsx`
   - `/src/app/(dashboard)/matches/page.tsx`
   - `/src/app/(dashboard)/predictions/page.tsx`

**The problem** is that these routes both resolve to the same URLs (`/dashboard`, `/matches`, `/predictions`), which Next.js doesn't allow.

## Temporary Solution

We've temporarily disabled the conflicting pages in the route group by:

1. Removing the `export default` statements from the route group pages
2. Renaming the component exports to avoid them being used as default exports
3. Adding comments to explain this situation

This is a temporary solution to get the app running.

## Long-Term Solutions

For a more permanent solution, choose one of these approaches:

### Option 1: Standardize on client-side routes

1. Move all logic from the route group pages to client-side pages
2. Delete the route group structure entirely
3. Adapt server components to work within the client-side structure using React Server Components patterns

### Option 2: Standardize on server-side routes with route group

1. Move all client-side logic to the route group pages
2. Delete the top-level pages
3. Update any client-side components to use 'use client' directives within the route group structure

### Option 3: Use different paths

If you need both approaches, you could rename the routes in one of the structures to avoid conflicts:

- Change `/src/app/(dashboard)/dashboard/page.tsx` to `/src/app/(dashboard)/overview/page.tsx` (URL becomes `/overview`)
- Change `/src/app/(dashboard)/matches/page.tsx` to `/src/app/(dashboard)/match-list/page.tsx` (URL becomes `/match-list`)

## Which approach to choose?

The current client-side routes seem to be more complete and functional, so Option 1 is recommended unless there's a specific need for server-side rendering.
