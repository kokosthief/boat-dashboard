import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await request.json();
    const id = params.id;
    const allowedFields = [
      'name',
      'location',
      'website',
      'phone',
      'sandblasting',
      'status',
      'rating',
      'notes',
      'living_permitted',
      'mooring_cost',
      'electricity_price',
      'car_parking',
      'services',
    ] as const;

    const payload = Object.fromEntries(
      allowedFields
        .filter(field => body[field] !== undefined)
        .map(field => [field, body[field]])
    );

    const { data, error } = await supabase
      .from('haulout_yards')
      .update(payload)
      .eq('id', id)
      .select(
        'id,name,location,website,phone,sandblasting,status,rating,notes,living_permitted,mooring_cost,electricity_price,car_parking,services,created_at,updated_at'
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Yard not found' }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update yard' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServerClient();
    const id = params.id;

    const { error } = await supabase
      .from('haulout_yards')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete yard' }, { status: 500 });
  }
}
