CREATE TABLE "customer_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"company_name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
