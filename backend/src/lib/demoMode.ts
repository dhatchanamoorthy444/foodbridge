/**
 * Local presentation mode. When enabled the API boots without Supabase and
 * exposes a local demo login (backed by MySQL when available, otherwise a
 * JSON file) so the project can be demonstrated without any cloud services.
 */
export function isDemoMode(): boolean {
  return (
    process.env.DEMO_MODE === 'true' ||
    process.env.DEMO_MODE === '1' ||
    process.env.LOCAL_DEMO === 'true'
  )
}
