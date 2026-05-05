import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('expenses')
      .update(body)
      .eq('id', id)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data[0])
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
