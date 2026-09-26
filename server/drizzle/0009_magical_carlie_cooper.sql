CREATE TYPE "public"."bag_impression" AS ENUM('as_expected', 'different', 'recipe_dependent', 'good_value', 'would_not_buy');--> statement-breakpoint
CREATE TYPE "public"."bag_rating_stage" AS ENUM('halfway', 'finished');--> statement-breakpoint
ALTER TYPE "public"."taste_profile_source" ADD VALUE 'purchase';--> statement-breakpoint
ALTER TYPE "public"."taste_profile_source" ADD VALUE 'bag_rating';--> statement-breakpoint
CREATE TABLE "bag_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bag_id" uuid NOT NULL,
	"stage" "bag_rating_stage" NOT NULL,
	"stars" smallint NOT NULL,
	"impression" "bag_impression",
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "taste_profiles" ADD COLUMN "rated_bag_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "bag_ratings" ADD CONSTRAINT "bag_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bag_ratings" ADD CONSTRAINT "bag_ratings_bag_id_coffee_bags_id_fk" FOREIGN KEY ("bag_id") REFERENCES "public"."coffee_bags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bag_ratings_bag_stage_idx" ON "bag_ratings" USING btree ("bag_id","stage");--> statement-breakpoint
CREATE INDEX "bag_ratings_user_updated_idx" ON "bag_ratings" USING btree ("user_id","updated_at" DESC NULLS LAST);