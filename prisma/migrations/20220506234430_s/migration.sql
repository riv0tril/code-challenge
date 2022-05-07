-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "complete" BOOLEAN NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
