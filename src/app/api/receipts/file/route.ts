import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = 'kokosthief/accounting';

const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

function getExtension(filePath: string): string {
  const match = filePath.match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0].toLowerCase() : '';
}

export async function GET(request: NextRequest) {
  try {
    const filePath = request.nextUrl.searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }

    // Security: prevent path traversal
    const normalized = filePath.replace(/\\/g, '/').replace(/\.\.+\//g, '');
    if (normalized.includes('..') || !normalized.startsWith('receipts/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    const ext = getExtension(normalized);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const filename = normalized.split('/').pop() || 'receipt';

    // Encode each path segment for GitHub API
    const segments = normalized.split('/');
    const encodedPath = segments.map(s => encodeURIComponent(s)).join('/');
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodedPath}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw',
      },
    });

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText} for path: ${normalized}`);
      if (res.status === 404) {
        return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
      }
      return NextResponse.json({ error: `GitHub API error: ${res.status}` }, { status: 502 });
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Receipt file error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
