import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { FolderPageContent } from "@/components/FolderPageContent";
import type { DocForBoard, FolderForBoard } from "@/components/DocumentBoard";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const isAdmin = user.user_metadata?.role === "admin";

  const [{ data: rawFolder }, { data: rawFolderTree }] = await Promise.all([
    supabase.from("folders").select("*").eq("id", id).single(),
    supabase.from("folders").select("id, name, parent_id"),
  ]);

  if (!rawFolder) notFound();

  const [{ data: rawDocs }, { data: rawSubFolders }] = await Promise.all([
    supabase.from("documents").select("*").eq("folder_id", id).order("position", { ascending: true }),
    supabase.from("folders").select("*").eq("parent_id", id).order("position", { ascending: true }),
  ]);

  const folder: FolderForBoard = {
    id: rawFolder.id,
    name: rawFolder.name,
    color: rawFolder.color ?? null,
    icon: rawFolder.icon ?? null,
    public_share_token: rawFolder.public_share_token ?? null,
    position: rawFolder.position ?? 0,
    parent_id: rawFolder.parent_id ?? null,
  };

  const folderMap = new Map<string, { id: string; name: string; parent_id: string | null }>(
    ((rawFolderTree ?? []) as Array<{ id: string; name: string; parent_id: string | null }>).map((item) => [
      item.id,
      { id: item.id, name: item.name, parent_id: item.parent_id ?? null },
    ]),
  );

  const initialPath: Array<{ id: string; name: string }> = [];
  let cursor = folder.parent_id ?? null;
  while (cursor) {
    const parent = folderMap.get(cursor);
    if (!parent) break;
    initialPath.unshift({ id: parent.id, name: parent.name });
    cursor = parent.parent_id;
  }

  const subFolders: FolderForBoard[] = (rawSubFolders ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    color: f.color ?? null,
    icon: f.icon ?? null,
    public_share_token: f.public_share_token ?? null,
    position: f.position ?? 0,
    parent_id: f.parent_id ?? null,
  }));

  const docs: DocForBoard[] = (rawDocs ?? []).map((d) => ({
    id: d.id,
    slug: d.slug,
    public_share_token: d.public_share_token ?? null,
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar isAdmin={isAdmin} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <FolderPageContent
          initialFolder={folder}
          initialDocs={docs}
          initialSubFolders={subFolders}
          initialPath={initialPath}
          isAdmin={isAdmin}
        />
      </Container>
    </Box>
  );
}
