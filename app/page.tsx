import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Navbar } from '@/components/Navbar';
import { withDefaultSharing } from '@/lib/document-sharing';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const isAdmin = user.user_metadata?.role === 'admin';

  const { data: baseDocs } = await supabase
    .from('documents')
    .select('id, slug, title, content, created_at')
    .order('created_at', { ascending: false });

  const docs = await Promise.all(
    (baseDocs ?? []).map(async (doc) => {
      const { data: sharing } = await supabase
        .from('documents')
        .select('description, image, public_access_enabled, public_comments_visible, anonymous_comments_enabled')
        .eq('id', doc.id)
        .single();

      return withDefaultSharing(doc, sharing);
    })
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar isAdmin={isAdmin} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Card
          variant="outlined"
          sx={{
            mb: 4,
            borderRadius: 4,
            borderColor: 'rgba(12, 123, 220, 0.12)',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(241,248,255,0.96) 100%)',
            'html[data-mui-color-scheme="dark"] &': {
              borderColor: 'rgba(112, 163, 215, 0.18)',
              background:
                'linear-gradient(135deg, rgba(17, 28, 43, 0.96) 0%, rgba(18, 44, 72, 0.84) 100%)',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip label="Product blueprint" size="small" color="primary" />
                <Chip label="Reader-first UX" size="small" variant="outlined" />
              </Stack>
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Blueprint for a content-first reading experience
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  A structured concept page with roadmap, component inventory, annotation
                  strategy, mockups, and flow diagrams for collaborative Markdown reading.
                </Typography>
              </Box>
              <Box>
                <Link href="/blueprint" style={{ textDecoration: 'none' }}>
                  <Button variant="contained">Open blueprint</Button>
                </Link>
              </Box>
            </Stack>
          </CardContent>
        </Card>

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

        <Box
          sx={{
            columnCount: { xs: 1, sm: 2, xl: 3 },
            columnGap: '20px',
          }}
        >
          {docs?.map((doc, index) => (
            <Card
              key={doc.id}
              variant="outlined"
              sx={{
                mb: 2.5,
                breakInside: 'avoid',
                borderRadius: 3,
                borderColor: 'rgba(12, 123, 220, 0.1)',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 18px 38px rgba(15, 90, 163, 0.12)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {doc.public_access_enabled && <Chip size="small" label="Public link" color="primary" />}
                      {doc.public_comments_visible && <Chip size="small" label="Public comments" variant="outlined" />}
                      {doc.anonymous_comments_enabled && <Chip size="small" label="Anonymous on" variant="outlined" />}
                    </Stack>
                    {isAdmin && (
                      <Link href={`/admin/documents/${doc.slug}`} style={{ textDecoration: 'none' }}>
                        <Button size="small" variant="outlined">Edit</Button>
                      </Link>
                    )}
                  </Stack>

                  <Link href={`/docs/${doc.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box
                      sx={{
                        minHeight: 96 + ((index % 3) * 22),
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      {doc.image && (
                        <Box
                          component="img"
                          src={doc.image}
                          alt={doc.title}
                          sx={{
                            width: '100%',
                            height: 180,
                            objectFit: 'cover',
                            borderRadius: 2,
                            mb: 1.5,
                            border: '1px solid rgba(12, 123, 220, 0.08)',
                          }}
                        />
                      )}
                      <Typography variant="h6" fontWeight={750} sx={{ mb: 1 }}>
                        {doc.title}
                      </Typography>
                      <Box
                        sx={{
                          color: 'text.secondary',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          '& p': { m: 0, lineHeight: 1.7 },
                          '& strong': { color: 'text.primary' },
                          '& em': { fontStyle: 'italic' },
                          '& code': {
                            px: 0.5,
                            py: 0.15,
                            borderRadius: 1,
                            bgcolor: 'rgba(12, 123, 220, 0.08)',
                            fontFamily: 'monospace',
                            fontSize: '0.84em',
                          },
                        }}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: () => null,
                            h2: () => null,
                            h3: () => null,
                            h4: () => null,
                            h5: () => null,
                            h6: () => null,
                            p: ({ children }) => <Typography variant="body2" component="p">{children}</Typography>,
                            a: ({ children }) => <>{children}</>,
                            ul: () => null,
                            ol: () => null,
                            li: () => null,
                            blockquote: ({ children }) => <Typography variant="body2" component="p">{children}</Typography>,
                            code: ({ children }) => <Box component="code">{children}</Box>,
                            pre: ({ children }) => <>{children}</>,
                          }}
                        >
                          {createExcerpt(doc.description || doc.content, 320 + (index % 3) * 40)}
                        </ReactMarkdown>
                      </Box>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {new Date(doc.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                  </Link>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
        {!docs?.length && (
          <Typography variant="body2" color="text.secondary">No documents yet.</Typography>
        )}
      </Container>
    </Box>
  );
}

function createExcerpt(content: string, maxLength: number) {
  const cleaned = content
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/^\s*(title|description|weight|bookCollapseSection)\s*:\s*.*$/gim, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\|.*\|/g, '')
    .trim();

  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !/^#{1,6}\s/.test(part))
    .filter((part) => !/^\s*[-*+]\s/.test(part))
    .filter((part) => !/^\s*\d+\.\s/.test(part));

  const excerpt = (paragraphs[0] || cleaned)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[*_`>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return excerpt.length > maxLength ? `${excerpt.slice(0, maxLength).trim()}…` : excerpt;
}
