import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const customerProfiles = pgTable('customer_profiles', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  companyName: text('company_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 