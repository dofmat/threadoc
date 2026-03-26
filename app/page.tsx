import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { DocumentBoard } from '@/components/DocumentBoard';
import type { DocForBoard, FolderForBoard } from '@/components/DocumentBoard';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const isAdmin = user.user_metadata?.role === 'admin';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawDocs } = await (supabase.from('documents').select('*').order('position', { ascending: true }) as any);
  const { data: rawFolders } = await supabase
    .from('folders')
    .select('id, name, color, icon, position')
    .order('position', { ascending: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docs: DocForBoard[] = ((rawDocs ?? []) as any[]).map((d) => ({
    id: d.id,
    slug: d.slug,
    title: d.title,
    content: d.content,
    description: d.description ?? null,
    image: d.image ?? null,
    created_at: d.created_at,
    folder_id: d.folder_id ?? null,
    position: d.position ?? 0,
    card_color: d.card_color ?? null,
    card_icon: d.card_icon ?? null,
    public_access_enabled: d.public_access_enabled ?? false,
    public_comments_visible: d.public_comments_visible ?? false,
    anonymous_comments_enabled: d.anonymous_comments_enabled ?? false,
  }));

  const folders: FolderForBoard[] = (rawFolders ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    color: f.color ?? null,
    icon: f.icon ?? null,
    position: f.position ?? 0,
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar isAdmin={isAdmin} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Board header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h5" fontWeight={700}>Documents</Typography>
          {isAdmin && (
            <Link href="/admin/documents/new" style={{ textDecoration: 'none' }}>
              <Button variant="contained" startIcon={<AddIcon />} size="small">
                New document
              </Button>
            </Link>
          )}
        </Stack>

        {docs.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No documents yet.</Typography>
        ) : (
          <DocumentBoard initialDocs={docs} initialFolders={folders} isAdmin={isAdmin} />
        )}
      </Container>
    </Box>
  );
}
