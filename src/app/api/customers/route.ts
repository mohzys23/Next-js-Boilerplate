import { db } from '@/libs/DB';
import { customerProfileSchema } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // This ensures the route is not statically optimized

export async function GET() {
  try {
    const customers = await db.select().from(customerProfileSchema);
    return NextResponse.json({ data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await db.insert(customerProfileSchema).values(body).returning();
    return NextResponse.json({ data: customer[0] });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const customer = await db
      .update(customerProfileSchema)
      .set(data)
      .where(eq(customerProfileSchema.id, id))
      .returning();
    return NextResponse.json({ data: customer[0] });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 },
      );
    }
    await db
      .delete(customerProfileSchema)
      .where(eq(customerProfileSchema.id, Number.parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 },
    );
  }
}
