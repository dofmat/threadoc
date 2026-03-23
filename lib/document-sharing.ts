type BaseDocument = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  image?: string | null;
  content: string;
  created_at?: string;
};

type SharingSettings = {
  public_access_enabled: boolean;
  public_comments_visible: boolean;
  anonymous_comments_enabled: boolean;
};

export function withDefaultSharing<T extends BaseDocument | { id: string }>(
  document: T,
  sharing?: Partial<SharingSettings & { description: string | null; image: string | null }> | null
) {
  return {
    ...document,
    description: 'description' in document ? (sharing?.description ?? document.description ?? null) : sharing?.description ?? null,
    image: 'image' in document ? (sharing?.image ?? document.image ?? null) : sharing?.image ?? null,
    public_access_enabled: Boolean(sharing?.public_access_enabled),
    public_comments_visible: Boolean(sharing?.public_comments_visible),
    anonymous_comments_enabled: Boolean(sharing?.anonymous_comments_enabled),
  };
}
