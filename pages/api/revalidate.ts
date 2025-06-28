import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // Revalidate the home page
    revalidatePath('/');
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    console.error('Error during revalidation:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
