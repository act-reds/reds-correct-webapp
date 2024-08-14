# REDS Correct



## Prisma

### Set up the project

- install prisma

  ```bas
  npm install @prisma/client
  npm install prisma --save-dev
  npm install @types/node
  ```

- setup prisma
  ```bash
  npx prisma init
  ```

- create the content of the schema.prisma file
  ```bash
  generator client {
    provider = "prisma-client-js"
  }
  
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  
  model User {
    id    Int    @id @default(autoincrement())
    name  String?
    email String @unique
  }users
  
  model Course {
    id   Int    @id @default(autoincrement())
    name String?
  }
  ```



- Update the .env file
  ```bash
  DATABASE_URL="postgresql://act-reds:reds@localhost:5432/testdb"
  ```

- Generate prisma client and run migrations
  ```bash
  npx prisma generate
  npx prisma migrate dev --name init
  ```

  

### Manage actions

Create routes like this :

- app/api/data/users/route.ts
- app/api/data/courses/route.ts
- app/api/data/labs/route.ts

And these files can be filled like this : 

POST request

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, email } = await req.json();
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'User could not be created' }, { status: 500 });
  }
}
```



GET request

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    const courses = await prisma.course.findMany();
    return NextResponse.json({ users, courses });
  } catch (error) {
    return NextResponse.json({ error: 'Data could not be retrieved' }, { status: 500 });
  }
}
```















