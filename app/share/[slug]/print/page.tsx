import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { splitDocumentContent } from '@/lib/document-content';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default async function SharePrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const adminClient = await createAdminClient();

  const { data: doc } = await adminClient
    .from('documents')
    .select('title, content, public_access_enabled')
    .eq('slug', slug)
    .single();

  if (!doc || !doc.public_access_enabled) notFound();

  const { body } = splitDocumentContent(doc.content);

  return (
    <>
      <style>{`
        @media screen {
          body { max-width: 800px; margin: 0 auto; padding: 32px 24px; font-family: system-ui, sans-serif; }
        }
        @media print {
          body { margin: 0; padding: 0; }
        }
        h1 { font-size: 2rem; margin-bottom: 0.25rem; }
        .print-btn {
          display: inline-block;
          margin-bottom: 24px;
          padding: 6px 16px;
          border: 1px solid #aaa;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          background: #f5f5f5;
        }
        @media print { .print-btn { display: none; } }
      `}</style>

      <h1>{doc.title}</h1>
      <button className="print-btn">Print / Save as PDF</button>

      <script dangerouslySetInnerHTML={{ __html: 'document.querySelector(".print-btn").onclick=()=>window.print()' }} />

      <MarkdownRenderer content={body} />
    </>
  );
}
