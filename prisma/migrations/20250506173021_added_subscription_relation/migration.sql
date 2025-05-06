-- CreateTable
CREATE TABLE "ownerFeedback" (
    "id" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "ownerFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ownerFeedback" ADD CONSTRAINT "ownerFeedback_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
