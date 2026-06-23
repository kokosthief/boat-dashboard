import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('haulout_yards')
      .select(
        'id,name,location,website,phone,sandblasting,status,rating,notes,living_permitted,mooring_cost,electricity_price,car_parking,services,created_at,updated_at'
      )
      .order('rating', { ascending: false })
      .order('id', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch yards' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await request.json();
    const {
      name,
      location,
      website,
      phone,
      sandblasting,
      status,
      rating,
      notes,
      living_permitted,
      mooring_cost,
      electricity_price,
      car_parking,
      services,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('haulout_yards')
      .insert([
        {
          name,
          location,
          website,
          phone,
          sandblasting,
          status,
          rating,
          notes,
          living_permitted,
          mooring_cost,
          electricity_price,
          car_parking,
          services,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create yard' },
      { status: 500 }
    );
  }
}
