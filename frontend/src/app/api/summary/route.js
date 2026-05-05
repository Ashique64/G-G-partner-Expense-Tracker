import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { calculateSettlements } from '@/lib/calculations'

export async function GET() {
  try {
    // Fetch all partners
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: true })

    if (partnersError) throw partnersError

    // Fetch all expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')

    if (expensesError) throw expensesError

    const summary = calculateSettlements(partners, expenses)

    return NextResponse.json(summary)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
