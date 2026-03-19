'use server'

/**
 * Simulates a server-side delete operation with artificial delay.
 * Logs to server console to demonstrate that execution happens on the server.
 *
 * @example
 * // Use .bind() to pre-fill arguments when passing to ActionButton
 * <ActionButton action={simulateDeleteAction.bind(null, 'item-1')}>Delete</ActionButton>
 */
export async function simulateDeleteAction(itemId: string): Promise<void> {
  console.log(`[Server] Deleting item: ${itemId}`)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  console.log(`[Server] Deleted item: ${itemId}`)
}

/**
 * Simulates a server-side like/favorite operation.
 *
 * @example
 * <ActionButton action={simulateLikeAction.bind(null, 'post-1')}>Like</ActionButton>
 */
export async function simulateLikeAction(postId: string): Promise<void> {
  console.log(`[Server] Liking post: ${postId}`)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log(`[Server] Liked post: ${postId}`)
}
