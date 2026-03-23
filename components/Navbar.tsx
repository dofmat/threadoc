'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function Navbar({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 20, px: { xs: 1.5, md: 2.5 }, pt: 1.5 }}>
      <Paper
        elevation={0}
        sx={{
          px: { xs: 1.5, md: 2.25 },
          py: 1.25,
          borderRadius: { xs: 3, md: 5 },
          border: '1px solid rgba(12, 123, 220, 0.12)',
          backdropFilter: 'blur(14px)',
          bgcolor: 'rgba(255,255,255,0.82)',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1, md: 2 }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              component="img"
              src="/td-logo.svg"
              alt="TD logo"
              sx={{ width: 42, height: 42, borderRadius: 1.5 }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                component={Link}
                href="/"
                sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 800 }}
              >
                Threadoc
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                TD collaborative reading
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
            flexWrap="wrap"
            useFlexGap
          >
            <Button
              component={Link}
              href="/"
              size="small"
              variant="text"
              color="inherit"
              sx={{ minWidth: { xs: 'auto', md: 64 }, px: { xs: 1, md: 1.5 } }}
            >
              Home
            </Button>
            <Button
              component={Link}
              href="/blueprint"
              size="small"
              variant="text"
              color="inherit"
              sx={{ minWidth: { xs: 'auto', md: 64 }, px: { xs: 1, md: 1.5 } }}
            >
              Blueprint
            </Button>
            {isAdmin && (
              <Button
                component={Link}
                href="/admin/users"
                size="small"
                variant="text"
                color="inherit"
                sx={{ minWidth: { xs: 'auto', md: 64 }, px: { xs: 1, md: 1.5 } }}
              >
                Admin
              </Button>
            )}
            <Button
              onClick={handleLogout}
              size="small"
              variant="contained"
              sx={{
                ml: { xs: 0, md: 0.5 },
                px: { xs: 1.5, md: 2 },
                borderRadius: 2,
              }}
            >
              Sign out
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
