'use client';

import { useState } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import PaletteIcon from '@mui/icons-material/Palette';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import StarIcon from '@mui/icons-material/Star';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LabelIcon from '@mui/icons-material/Label';
import BuildIcon from '@mui/icons-material/Build';
import ScienceIcon from '@mui/icons-material/Science';
import DescriptionIcon from '@mui/icons-material/Description';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DocumentBoard } from './DocumentBoard';
import type { DocForBoard, FolderForBoard } from './DocumentBoard';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const FOLDER_ICON_MAP: Record<string, React.ElementType> = {
  work: WorkIcon, code: CodeIcon, star: StarIcon, bookmark: BookmarkIcon,
  label: LabelIcon, build: BuildIcon, science: ScienceIcon,
  description: DescriptionIcon, lightbulb: LightbulbIcon, assessment: AssessmentIcon,
};

const FOLDER_ICON_OPTIONS: Array<{ value: string | null; label: string; Icon: React.ElementType }> = [
  { value: null,          label: 'Default',  Icon: FolderIcon      },
  { value: 'work',        label: 'Work',     Icon: WorkIcon        },
  { value: 'code',        label: 'Code',     Icon: CodeIcon        },
  { value: 'star',        label: 'Star',     Icon: StarIcon        },
  { value: 'bookmark',    label: 'Bookmark', Icon: BookmarkIcon    },
  { value: 'label',       label: 'Label',    Icon: LabelIcon       },
  { value: 'build',       label: 'Build',    Icon: BuildIcon       },
  { value: 'science',     label: 'Science',  Icon: ScienceIcon     },
  { value: 'description', label: 'Docs',     Icon: DescriptionIcon },
  { value: 'lightbulb',   label: 'Idea',     Icon: LightbulbIcon   },
  { value: 'assessment',  label: 'Chart',    Icon: AssessmentIcon  },
];

const FOLDER_COLORS = [
  { value: null,      swatch: '#9e9e9e' },
  { value: '#1565C0', swatch: '#1565C0' },
  { value: '#2E7D32', swatch: '#2E7D32' },
  { value: '#B71C1C', swatch: '#B71C1C' },
  { value: '#E65100', swatch: '#E65100' },
  { value: '#6A1B9A', swatch: '#6A1B9A' },
  { value: '#00695C', swatch: '#00695C' },
  { value: '#F57F17', swatch: '#F57F17' },
  { value: '#37474F', swatch: '#37474F' },
];

// ─── FolderCustomizePopover ───────────────────────────────────────────────────

function FolderCustomizePopover({
  folder,
  anchorEl,
  onClose,
  onSave,
}: {
  folder: FolderForBoard;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSave: (color: string | null, icon: string | null, name: string) => void;
}) {
  const [color, setColor] = useState<string | null>(folder.color);
  const [icon,  setIcon]  = useState<string | null>(folder.icon);
  const [name,  setName]  = useState(folder.name);

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <Box sx={{ p: 2.5, width: 290 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Name</Typography>
        <Box
          component="input"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          sx={{
            width: '100%', mb: 2, p: 1, borderRadius: 1.5,
            border: '1px solid', borderColor: 'divider',
            bgcolor: 'background.paper', color: 'text.primary',
            fontSize: '0.875rem', outline: 'none',
            '&:focus': { borderColor: 'primary.main' },
          }}
        />

        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Color</Typography>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {FOLDER_COLORS.map((c) => (
            <Box
              key={String(c.value)}
              onClick={() => setColor(c.value)}
              sx={{
                width: 28, height: 28, borderRadius: '50%', bgcolor: c.swatch,
                border: '2.5px solid', borderColor: color === c.value ? 'text.primary' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.1s', '&:hover': { transform: 'scale(1.2)' },
              }}
            >
              {c.value === null && color === null && <CheckIcon sx={{ fontSize: 14 }} />}
            </Box>
          ))}
        </Stack>

        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Icon</Typography>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 2.5 }}>
          {FOLDER_ICON_OPTIONS.map((item) => (
            <Tooltip key={String(item.value)} title={item.label}>
              <Box
                onClick={() => setIcon(item.value)}
                sx={{
                  width: 36, height: 36, borderRadius: 1.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid',
                  borderColor: icon === item.value ? 'primary.main' : 'divider',
                  bgcolor: icon === item.value ? 'primary.main' : 'transparent',
                  color: icon === item.value ? 'primary.contrastText' : 'text.secondary',
                  cursor: 'pointer', transition: 'all 0.1s',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <item.Icon sx={{ fontSize: 18 }} />
              </Box>
            </Tooltip>
          ))}
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" onClick={onClose}>Cancel</Button>
          <Button
            size="small" variant="contained"
            disabled={!name.trim()}
            onClick={() => { onSave(color, icon, name.trim()); onClose(); }}
          >
            Apply
          </Button>
        </Stack>
      </Box>
    </Popover>
  );
}

// ─── FolderPageContent ────────────────────────────────────────────────────────

export function FolderPageContent({
  initialFolder,
  initialDocs,
  initialSubFolders,
  isAdmin,
}: {
  initialFolder: FolderForBoard;
  initialDocs: DocForBoard[];
  initialSubFolders: FolderForBoard[];
  isAdmin: boolean;
}) {
  const [folder, setFolder] = useState(initialFolder);
  const [folderAnchor, setFolderAnchor] = useState<HTMLElement | null>(null);

  const accent = folder.color ?? '#1565C0';
  const FolderIconComponent = folder.icon ? (FOLDER_ICON_MAP[folder.icon] ?? FolderIcon) : FolderIcon;

  function handleFolderSave(color: string | null, icon: string | null, name: string) {
    setFolder((f) => ({ ...f, color, icon, name }));
    fetch(`/api/folders/${folder.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color, icon, name }),
    });
  }

  return (
    <>
      {/* Folder header */}
      <Box sx={{ mb: 5, pb: 3, borderBottom: '3px solid', borderColor: accent }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 3,
              bgcolor: `${accent}18`,
              border: '2px solid', borderColor: `${accent}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            <FolderIconComponent sx={{ fontSize: 30, color: accent }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              {folder.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {initialSubFolders.length > 0 && `${initialSubFolders.length} sub-folder${initialSubFolders.length !== 1 ? 's' : ''} · `}
              {initialDocs.length} document{initialDocs.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          {isAdmin && (
            <Tooltip title="Customize folder">
              <IconButton
                onClick={(e) => setFolderAnchor(e.currentTarget)}
                sx={{
                  bgcolor: `${accent}14`,
                  color: accent,
                  border: '1px solid', borderColor: `${accent}33`,
                  '&:hover': { bgcolor: `${accent}28` },
                  transition: 'all 0.2s ease',
                }}
              >
                <PaletteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>

      {/* Shared DnD grid — same component as the board */}
      <DocumentBoard
        initialDocs={initialDocs}
        initialFolders={initialSubFolders}
        isAdmin={isAdmin}
        contextId={folder.id}
      />

      <FolderCustomizePopover
        folder={folder}
        anchorEl={folderAnchor}
        onClose={() => setFolderAnchor(null)}
        onSave={handleFolderSave}
      />
    </>
  );
}
