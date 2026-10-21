// Build-time GitHub lookups. Real data only: on any failure these return null and the
// page leaves the line out instead of showing a guess.

const ACCOUNTS = ['users/Codestz', 'orgs/silentthreadstudio'];

export interface PublicPush {
  at: Date;
  repo: string;
}

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
}

async function events(account: string): Promise<GitHubEvent[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'silentthreadstudio.com',
  };
  const token = import.meta.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`https://api.github.com/${account}/events/public?per_page=50`, { headers });
    return res.ok ? ((await res.json()) as GitHubEvent[]) : [];
  } catch {
    return [];
  }
}

/** The most recent public push across the founder's and the studio's accounts. */
export async function lastPublicPush(): Promise<PublicPush | null> {
  const all = (await Promise.all(ACCOUNTS.map(events))).flat();
  const latest = all
    .filter((e) => e.type === 'PushEvent')
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  return latest ? { at: new Date(latest.created_at), repo: latest.repo.name } : null;
}
