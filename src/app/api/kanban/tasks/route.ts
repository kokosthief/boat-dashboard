import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { statusColumns, type Task } from '@/data/tasks';

export const dynamic = 'force-dynamic';

type Status = Task['status'];

interface TaskRow {
  id: string;
  name: string;
  location: string | null;
  vendor: string | null;
  status: Status;
  target_date: string | null;
  cost: string | null;
  notes: string | null;
  urgent: boolean | null;
  sort_order: number | null;
}

const validStatuses = new Set<string>(statusColumns);

function toTask(row: TaskRow) {
  return {
    id: row.id,
    name: row.name,
    location: row.location || '',
    vendor: row.vendor || '',
    status: row.status,
    targetDate: row.target_date || '',
    cost: row.cost || '',
    notes: row.notes || '',
    urgent: row.urgent === true,
    sortOrder: row.sort_order ?? 0,
  };
}

function cleanPayload(body: Record<string, unknown>, fallbackSortOrder: number) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const status = typeof body.status === 'string' && validStatuses.has(body.status) ? body.status : 'Planning';
  return {
    name,
    location: typeof body.location === 'string' ? body.location.trim() : '',
    vendor: typeof body.vendor === 'string' ? body.vendor.trim() : '',
    status,
    target_date: typeof body.targetDate === 'string' && body.targetDate ? body.targetDate : null,
    cost: typeof body.cost === 'string' ? body.cost.trim() : '',
    notes: typeof body.notes === 'string' ? body.notes.trim() : '',
    urgent: body.urgent === true,
    sort_order: typeof body.sortOrder === 'number' ? body.sortOrder : fallbackSortOrder,
  };
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('timo_kanban_tasks')
      .select('id,name,location,vendor,status,target_date,cost,notes,urgent,sort_order')
      .order('sort_order', { ascending: true })
      .order('target_date', { ascending: true, nullsFirst: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tasks: ((data || []) as TaskRow[]).map(toTask) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load Kanban tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await request.json();

    const { count } = await supabase
      .from('timo_kanban_tasks')
      .select('id', { count: 'exact', head: true });

    const payload = cleanPayload(body, count ?? 0);
    if (!payload.name) return NextResponse.json({ error: 'Task name is required' }, { status: 400 });

    const { data, error } = await supabase
      .from('timo_kanban_tasks')
      .insert(payload)
      .select('id,name,location,vendor,status,target_date,cost,notes,urgent,sort_order')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ task: toTask(data as TaskRow) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create Kanban task' }, { status: 500 });
  }
}
