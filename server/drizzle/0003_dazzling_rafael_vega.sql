CREATE TABLE "coffee_bag_parses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_hash" text NOT NULL,
	"roaster_key" text,
	"name_key" text,
	"fields" jsonb NOT NULL,
	"model" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "coffee_bag_parses_image_hash_key" ON "coffee_bag_parses" USING btree ("image_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "coffee_bag_parses_label_key" ON "coffee_bag_parses" USING btree ("roaster_key","name_key") WHERE "coffee_bag_parses"."roaster_key" is not null and "coffee_bag_parses"."name_key" is not null;