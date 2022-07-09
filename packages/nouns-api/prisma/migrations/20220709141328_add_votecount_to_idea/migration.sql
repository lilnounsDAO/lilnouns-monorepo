-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "votecount" INTEGER;

-- DB Triggers to calculate the votecount property on the Idea model. This runs after a vote is added/applied and avoids alot of
-- confusing logic to hangle token weighted voting
CREATE OR REPLACE FUNCTION function_vote_counts() RETURNS TRIGGER AS
    $BODY$

    BEGIN
        if TG_OP='INSERT' then
            UPDATE "Idea" i
            SET
                "votecount"= "votecount" + NEW."direction" * u."lilnounCount"
            FROM "User" u
            WHERE NEW."voterId" = u."wallet"
            AND NEW."ideaId" = i."id";
        end if;
        if TG_OP='UPDATE' then
            UPDATE "Idea" i
            SET
                "votecount"= "votecount" + NEW."direction" * 2 * u."lilnounCount"
            FROM "User" u
            WHERE NEW."voterId" = u."wallet"
            AND NEW."ideaId" = i."id";
        end if;
        RETURN NEW;
    END

    $BODY$
language plpgsql;

CREATE TRIGGER trig_vote_counts
    AFTER INSERT OR UPDATE ON "Vote"
    FOR EACH ROW
    EXECUTE PROCEDURE function_vote_counts();