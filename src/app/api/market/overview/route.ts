import { NextResponse } from 'next/server';
import { stockService } from '@/lib/data/stockService';

export async function GET() {
  try {
    const overview = await stockService.getMarketOverview();
    return NextResponse.json(overview);
  } catch (error) {
    console.error('Market overview API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market overview' },
      { status: 500 }
    );
  }
}