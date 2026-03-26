import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/Navbar';
import { FolderPageContent } from '@/components/FolderPageContent';
import type { DocForBoard, FolderForBoard } from '@/components/DocumentBoard';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const isAdmin = user.user_metadata?.role === 'admin';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawFolder } = await (supabase
    .from('folders')
    .select('id, name, color, icon, position, parent_id')
    .eq('id', id)
    .single() as any);

  if (!rawFolder) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ data: rawDocs }, { data: rawSubFolders }] = await Promise.all([
    (supabase
      .from('documents')
      .select('*')
      .eq('folder_id', id)
      .order('position', { ascending: true }) as any),
    (supabase
      .from('folders')
      .select('id, name, color, icon, position, parent_id')
      .eq('parent_id', id)
      .order('position', { ascending: true }) as any),
  ]);

  const folder: FolderForBoard = {
    id: rawFolder.id,
    name: rawFolder.name,
    color: rawFolder.color ?? null,
    icon: rawFolder.icon ?? null,
    position: rawFolder.position ?? 0,
    parent_id: rawFolder.parent_id ?? null,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subFolders: FolderForBoard[] = ((rawSubFolders ?? []) as any[]).map((f: any) => ({
    id: f.id,
    name: f.name,
    color: f.color ?? null,
    icon: f.icon ?? null,
    position: f.position ?? 0,
    parent_id: f.parent_id ?? null,
  }));

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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar isAdmin={isAdmin} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            size="small"
            sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
          >
            Back to board
          </Button>
        </Link>

        <FolderPageContent
          initialFolder={folder}
          initialDocs={docs}
          initialSubFolders={subFolders}
          isAdmin={isAdmin}
        />
      </Container>
    </Box>
  );
}
