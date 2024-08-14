-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserComponent" (
    "userId" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,

    CONSTRAINT "UserComponent_pkey" PRIMARY KEY ("userId","componentId")
);

-- AddForeignKey
ALTER TABLE "UserComponent" ADD CONSTRAINT "UserComponent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComponent" ADD CONSTRAINT "UserComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
