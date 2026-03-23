import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { normalizeDocumentImage } from '@/lib/document-image';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const {
    title,
    slug,
    description = null,
    image = null,
    content,
    publicAccessEnabled = false,
    publicCommentsVisible = false,
    anonymousCommentsEnabled = false,
  } = await req.json();
  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'title, slug and content are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('documents')
    .update({
      title,
      slug,
      description: description?.trim() || null,
      image: normalizeDocumentImage(image),
      content,
      public_access_enabled: Boolean(publicAccessEnabled),
      public_comments_visible: Boolean(publicAccessEnabled && publicCommentsVisible),
      anonymous_comments_enabled: Boolean(publicAccessEnabled && publicCommentsVisible && anonymousCommentsEnabled),
    })
    .eq('id', id)
    .select('slug')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, slug: data.slug });
}
