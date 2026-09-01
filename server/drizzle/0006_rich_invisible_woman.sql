CREATE TABLE "coffee_taste_readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roaster_key" text,
	"name_key" text,
	"reading" jsonb NOT NULL,
	"model" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "coffee_taste_readings_label_key" ON "coffee_taste_readings" USING btree ("roaster_key","name_key") WHERE "coffee_taste_readings"."roaster_key" is not null and "coffee_taste_readings"."name_key" is not null;