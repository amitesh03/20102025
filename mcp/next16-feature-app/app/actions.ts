'use server'

import { refresh, updateTag } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  // Simulate a DB update
  await new Promise((r) => setTimeout(r, 10))
  // Trigger a client-side refresh of subscribed UI
  refresh()
}

export type Profile = { name?: string; email?: string }
export async function updateUserProfile(userId: string, profile: Profile) {
  // Simulate a DB update
  await new Promise((r) => setTimeout(r, 10))
  // Read-your-writes: expire and refresh cache for the user tag
  updateTag(`user-${userId}`)
}