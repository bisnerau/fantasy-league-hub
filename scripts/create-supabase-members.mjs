import { randomBytes } from 'node:crypto';
import { chmod, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import {
  leagueMembers,
  memberLoginEmail,
} from '../lib/data/member-directory.ts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const outputPath =
  process.env.MEMBER_CREDENTIALS_OUTPUT ??
  '/private/tmp/mac12-member-credentials.csv';

if (!supabaseUrl || !secretKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required.',
  );
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: existingData, error: listError } =
  await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

if (listError) throw listError;

const existingByEmail = new Map(
  existingData.users.map((user) => [user.email, user]),
);
const credentials = ['Manager,Login,Initial password'];
const resetExisting = process.argv.includes('--reset-existing');
let created = 0;
let updated = 0;

async function saveCredentials() {
  await writeFile(outputPath, `${credentials.join('\n')}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
  await chmod(outputPath, 0o600);
}

await saveCredentials();

for (const member of leagueMembers) {
  const email = memberLoginEmail(member.loginSlug);
  const metadata = {
    display_name: member.displayName,
    login_slug: member.loginSlug,
    sleeper_user_id: member.sleeperUserId,
    roster_id: member.rosterId,
    franchise_id: member.franchiseId,
    is_admin: Boolean(member.isAdmin),
  };
  const existing = existingByEmail.get(email);

  if (existing) {
    const password = resetExisting
      ? `M12-${randomBytes(12).toString('base64url')}!`
      : undefined;
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      user_metadata: metadata,
      ...(password ? { password } : {}),
    });
    if (error) throw error;
    updated += 1;
    if (password) {
      credentials.push(
        [member.displayName, member.loginSlug, password]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      );
      await saveCredentials();
    }
    continue;
  }

  const password = `M12-${randomBytes(12).toString('base64url')}!`;
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });
  if (error) throw error;
  created += 1;
  credentials.push(
    [member.displayName, member.loginSlug, password]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(','),
  );
  await saveCredentials();
}

console.log(
  `Created ${created} manager accounts; refreshed ${updated}. Credentials saved to ${outputPath}.`,
);
