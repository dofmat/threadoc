import { notFound, redirect } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NextLink from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { DocumentEditorForm } from '@/components/DocumentEditorForm';
import { withDefaultSharing } from '@/lib/document-sharing';

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') redirect('/');

  const { data: baseDocument } = await supabase
    .from('documents')
    .select('id, title, slug, content')
    .eq('slug', slug)
    .single();

  if (!baseDocument) notFound();

  const { data: sharing } = await supabase
    .from('documents')
    .select('description, image, public_access_enabled, public_comments_visible, anonymous_comments_enabled')
    .eq('id', baseDocument.id)
    .single();

  const document = withDefaultSharing(baseDocument, sharing);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <NextLink href={`/docs/${document.slug}`} style={{ textDecoration: 'none' }}>
          <Button startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 3 }}>
            Back to document
          </Button>
        </NextLink>

        <Typography variant="h5" fontWeight={700} mb={3}>
          Edit document
        </Typography>

        <DocumentEditorForm
          mode="edit"
          documentId={document.id}
          initialTitle={document.title}
          initialSlug={document.slug}
          initialDescription={document.description ?? ''}
          initialImage={document.image ?? ''}
          initialContent={document.content}
          initialPublicAccessEnabled={document.public_access_enabled}
          initialPublicCommentsVisible={document.public_comments_visible}
          initialAnonymousCommentsEnabled={document.anonymous_comments_enabled}
        />
      </Container>
    </Box>
  );
}
