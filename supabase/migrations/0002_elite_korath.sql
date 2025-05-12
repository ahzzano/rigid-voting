CREATE TABLE "polls" (
	"poll_id" serial PRIMARY KEY NOT NULL,
	"owner_id" serial NOT NULL,
	"poll_name" text NOT NULL,
	"open" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "userInfo" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text
);
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "polls" ADD CONSTRAINT "polls_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;