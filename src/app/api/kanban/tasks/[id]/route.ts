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

function cleanPatch(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  if (typeof body.name === 'string') payload.name = body.name.trim();
  if (typeof body.location === 'string') payload.location = body.location.trim();
  if (typeof body.vendor === 'string') payload.vendor = body.vendor.trim();
  if (typeof body.status === 'string' && validStatuses.has(body.status)) payload.status = body.status;
  if (typeof body.targetDate === 'string') payload.target_date = body.targetDate || null;
  if (typeof body.cost === 'string') payload.cost = body.cost.trim();
  if (typeof body.notes === 'string') payload.notes = body.notes.trim();
  if (typeof body.urgent === 'boolean') payload.urgent = body.urgent;
  if (typeof body.sortOrder === 'number') payload.sort_order = body.sortOrder;
  return payload;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payload = cleanPatch(await request.json());
    if (typeof payload.name === 'string' && !payload.name) {
      return NextResponse.json({ error: 'Task name is required' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('timo_kanban_tasks')
      .update(payload)
      .eq('id', params.id)
      .select('id,name,location,vendor,status,target_date,cost,notes,urgent,sort_order')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ task: toTask(data as TaskRow) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update Kanban task' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from('timo_kanban_tasks')
      .delete()
      .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete Kanban task' }, { status: 500 });
  }
}
