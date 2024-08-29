# REDS Correct



## Database

### Setup the database 

- Install Postgresql
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  ```

- Start and enable Postgresql service
  ```bash
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  ```

- Create a database
  ```bash
  sudo -i -u postgres
  createuser --interactive # follow the instructions
  ```



### PGAdmin4

```bash
curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg

sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'

sudo apt install pgadmin4 -y
```

If a database is already running, open PGAdmin4 and follow instructions: 

- Right click on "Servers"
- Register -> Server
- On General tab give a name to the server, you can choose whatever, that's the name displayed in pgadmin4.
- Then on on Connection tab and fill the following fields: 
  - Host name/Address : Where the database is running, example "localhost"
  - Port : default is 5432
  - Maintenance Database : the name of the database you're connecting to
  - UserName : The user name attached to the database
  - Password : the password of the user.



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



## Keycloak

To setup keycloak (again, locally), you can use a docker like this :
```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:25.0.4 start-dev
```

Then you can use the interface on :

```bash
localhost:8080
```

The credentials to connect and access the control panel are: 

- username: admin
- pwd: admin

Then to create a Real and everything required for the app to go, follow these steps: 

- Click on the unrolling menu and create a new Realm: 
  - Fill the name: "HEIG-VD"
- Then setup a client: 
  - Fill client id: "reds-correct"
  - Fill the root URL: "http://localhost:3000"







