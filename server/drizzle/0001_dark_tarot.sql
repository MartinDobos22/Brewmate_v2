CREATE TYPE "public"."brew_method_category" AS ENUM('pour_over', 'immersion', 'espresso', 'cold', 'stovetop');--> statement-breakpoint
CREATE TYPE "public"."chat_role" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."equipment_type" AS ENUM('grinder', 'brewer', 'kettle', 'scale');--> statement-breakpoint
CREATE TYPE "public"."grinder_typical_use" AS ENUM('espresso', 'filter', 'both');--> statement-breakpoint
CREATE TYPE "public"."grinder_unit_type" AS ENUM('clicks', 'numbers', 'microns');--> statement-breakpoint
CREATE TYPE "public"."milk_usage" AS ENUM('never', 'sometimes', 'often', 'always');--> statement-breakpoint
CREATE TYPE "public"."recipe_source" AS ENUM('ai', 'manual', 'imported', 'adjusted', 'calibration');--> statement-breakpoint
CREATE TYPE "public"."roast_level" AS ENUM('light', 'medium_light', 'medium', 'medium_dark', 'dark');--> statement-breakpoint
CREATE TYPE "public"."taste_profile_source" AS ENUM('questionnaire', 'calibration_brew', 'brew_chat', 'manual');--> statement-breakpoint
CREATE TYPE "public"."water_type" AS ENUM('tap', 'bottled', 'filtered', 'remineralized', 'unknown');--> statement-breakpoint
CREATE TABLE "ai_usage_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"function_name" text NOT NULL,
	"model" text NOT NULL,
	"tokens_in" integer DEFAULT 0 NOT NULL,
	"tokens_out" integer DEFAULT 0 NOT NULL,
	"cost_estimate" numeric(12, 6) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bag_evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"image_url" text,
	"parsed_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"verdict_text" text,
	"reasoning" jsonb DEFAULT '{"points":[]}'::jsonb NOT NULL,
	"uncertainties" jsonb DEFAULT '{"items":[]}'::jsonb NOT NULL,
	"profile_confidence_at_time" real,
	"was_purchased" boolean,
	"linked_bag_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brew_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"bag_id" uuid,
	"equipment_set_id" uuid,
	"constraints" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"actual_params" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"water_type" "water_type" NOT NULL,
	"duration_seconds" integer,
	"profile_learning_weight" real DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brew_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name_sk" text NOT NULL,
	"category" "brew_method_category" NOT NULL,
	"default_ratio_range" jsonb NOT NULL,
	"requires_equipment_type" "equipment_type",
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coffee_bags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"roaster" text,
	"name" text NOT NULL,
	"origin_country" text,
	"region" text,
	"farm" text,
	"variety" text,
	"process" text,
	"roast_level" "roast_level",
	"roast_date" date,
	"altitude" integer,
	"tasting_notes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"weight_grams" real,
	"remaining_grams" real,
	"image_url" text,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"equipment_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"default_constraints" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "equipment_type" NOT NULL,
	"catalog_grinder_id" uuid,
	"brand" text,
	"model" text,
	"params" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grinders_catalog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"unit_type" "grinder_unit_type" NOT NULL,
	"min_setting" real NOT NULL,
	"max_setting" real NOT NULL,
	"step" real NOT NULL,
	"micron_calibration" jsonb,
	"typical_use" "grinder_typical_use" NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"role" "chat_role" NOT NULL,
	"content" text NOT NULL,
	"recipe_patch" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bag_id" uuid,
	"method_id" uuid NOT NULL,
	"equipment_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"params" jsonb NOT NULL,
	"rationale" text,
	"source" "recipe_source" NOT NULL,
	"parent_recipe_id" uuid,
	"is_saved" boolean DEFAULT false NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "taste_profile_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source" "taste_profile_source" NOT NULL,
	"source_ref" text,
	"payload" jsonb NOT NULL,
	"applied_delta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "taste_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"acidity" real DEFAULT 5 NOT NULL,
	"sweetness" real DEFAULT 5 NOT NULL,
	"body" real DEFAULT 5 NOT NULL,
	"bitterness" real DEFAULT 5 NOT NULL,
	"intensity" real DEFAULT 5 NOT NULL,
	"flavor_affinities" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"roast_preference" "roast_level",
	"milk_usage" "milk_usage",
	"source_weights" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"confidence_level" real DEFAULT 0 NOT NULL,
	"brew_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "water_type" "water_type" DEFAULT 'unknown' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_state" jsonb;--> statement-breakpoint
ALTER TABLE "ai_usage_logs" ADD CONSTRAINT "ai_usage_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bag_evaluations" ADD CONSTRAINT "bag_evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bag_evaluations" ADD CONSTRAINT "bag_evaluations_linked_bag_id_coffee_bags_id_fk" FOREIGN KEY ("linked_bag_id") REFERENCES "public"."coffee_bags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brew_logs" ADD CONSTRAINT "brew_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brew_logs" ADD CONSTRAINT "brew_logs_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brew_logs" ADD CONSTRAINT "brew_logs_bag_id_coffee_bags_id_fk" FOREIGN KEY ("bag_id") REFERENCES "public"."coffee_bags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brew_logs" ADD CONSTRAINT "brew_logs_equipment_set_id_equipment_sets_id_fk" FOREIGN KEY ("equipment_set_id") REFERENCES "public"."equipment_sets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coffee_bags" ADD CONSTRAINT "coffee_bags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_sets" ADD CONSTRAINT "equipment_sets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_catalog_grinder_id_grinders_catalog_id_fk" FOREIGN KEY ("catalog_grinder_id") REFERENCES "public"."grinders_catalog"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grinders_catalog" ADD CONSTRAINT "grinders_catalog_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_chat_messages" ADD CONSTRAINT "recipe_chat_messages_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_bag_id_coffee_bags_id_fk" FOREIGN KEY ("bag_id") REFERENCES "public"."coffee_bags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_method_id_brew_methods_id_fk" FOREIGN KEY ("method_id") REFERENCES "public"."brew_methods"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_parent_recipe_id_recipes_id_fk" FOREIGN KEY ("parent_recipe_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taste_profile_events" ADD CONSTRAINT "taste_profile_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taste_profiles" ADD CONSTRAINT "taste_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_usage_logs_user_created_idx" ON "ai_usage_logs" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "ai_usage_logs_function_created_idx" ON "ai_usage_logs" USING btree ("function_name","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "bag_evaluations_user_created_idx" ON "bag_evaluations" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "bag_evaluations_linked_bag_idx" ON "bag_evaluations" USING btree ("linked_bag_id");--> statement-breakpoint
CREATE INDEX "brew_logs_user_created_idx" ON "brew_logs" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "brew_logs_recipe_idx" ON "brew_logs" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "brew_logs_bag_idx" ON "brew_logs" USING btree ("bag_id");--> statement-breakpoint
CREATE INDEX "brew_logs_equipment_set_idx" ON "brew_logs" USING btree ("equipment_set_id");--> statement-breakpoint
CREATE UNIQUE INDEX "brew_methods_key_unique_idx" ON "brew_methods" USING btree ("key");--> statement-breakpoint
CREATE INDEX "brew_methods_active_sort_idx" ON "brew_methods" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "coffee_bags_user_archived_idx" ON "coffee_bags" USING btree ("user_id","is_archived");--> statement-breakpoint
CREATE INDEX "coffee_bags_user_created_idx" ON "coffee_bags" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "equipment_sets_user_name_unique_idx" ON "equipment_sets" USING btree ("user_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "equipment_sets_single_default_unique_idx" ON "equipment_sets" USING btree ("user_id") WHERE "equipment_sets"."is_default";--> statement-breakpoint
CREATE INDEX "equipment_sets_user_sort_idx" ON "equipment_sets" USING btree ("user_id","sort_order");--> statement-breakpoint
CREATE INDEX "equipment_user_type_idx" ON "equipment" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "equipment_catalog_grinder_idx" ON "equipment" USING btree ("catalog_grinder_id");--> statement-breakpoint
CREATE UNIQUE INDEX "grinders_catalog_verified_model_unique_idx" ON "grinders_catalog" USING btree (lower("brand"),lower("model")) WHERE "grinders_catalog"."is_verified";--> statement-breakpoint
CREATE INDEX "grinders_catalog_created_by_idx" ON "grinders_catalog" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "recipe_chat_messages_recipe_created_idx" ON "recipe_chat_messages" USING btree ("recipe_id","created_at");--> statement-breakpoint
CREATE INDEX "recipes_user_created_idx" ON "recipes" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "recipes_bag_method_idx" ON "recipes" USING btree ("bag_id","method_id");--> statement-breakpoint
CREATE INDEX "recipes_method_idx" ON "recipes" USING btree ("method_id");--> statement-breakpoint
CREATE INDEX "recipes_parent_idx" ON "recipes" USING btree ("parent_recipe_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recipes_pinned_bag_method_unique_idx" ON "recipes" USING btree ("user_id","bag_id","method_id") WHERE "recipes"."is_pinned" and "recipes"."bag_id" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "recipes_pinned_method_unique_idx" ON "recipes" USING btree ("user_id","method_id") WHERE "recipes"."is_pinned" and "recipes"."bag_id" is null;--> statement-breakpoint
CREATE INDEX "taste_profile_events_user_created_idx" ON "taste_profile_events" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "taste_profile_events_source_ref_unique_idx" ON "taste_profile_events" USING btree ("user_id","source","source_ref") WHERE "taste_profile_events"."source_ref" is not null;