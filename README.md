# Local Run

### Overview

**Docker Compose is required for local run!**

You can run the whole application locally by running one of the `run` scripts (`*.bat` for Windows or
`*.sh` for Linux and Mac). These scripts do the following and then run docker containers:

- `run-nobuild` — build neither backend nor frontend
- `run-build-back` — build only backend
- `run-build-front` — build only frontend
- `run` — build both frontend and frontend

If a script doesn't build some part of the application that needs to be run,
this part must be built before.

### JavaScript Development run

For development using local npm library, please install globally yalc:
npm i yalc@1.0.0-pre.53 -g

**Local JS development scripts**:
npm run install:all - install node_modules into all folders
npm run delete:nm:all - uninstall node_modules from all folders
npm run start:all - start all JS services in development mode
npm run compile:all - to run **ALL** services:
Other scripts located in package.json in root of the project

The following scripts will run JavaScript and Java services, which can work in the same port, that leads
to conflicts. You can use Docker to stop them. Make sure that you PostgreSQL(if it is installed on PC)
port is not 5432, or you can not be able to have access to the database. Eslint can have conflicts with
Node v17 and higher.

### Specify what to run

You can run only certain services if you specify docker-compose _profiles_ for the scripts.
Different profiles start different sets of containers. For all profiles,
**Database** is run and **flyway** migration is executed.

There are the possible profiles:

- `admin_back` — fox-hunt-admin-backend
- `org_back` — fox-hunt-organization-service
- `back` — `admin_back` + `org_back`
- `admin_front` — `back` + fox-hunt-front
- `org_front` — `back` + fox-hunt-organization-front
- `all` —` back` + `admin_front` + `org_front`

So, for example, if you want to build only backend and then run admin
and organization backend and admin frontend,
you can do it by executing the following command:

`> run-build-back admin_front`

or

`$ run-build-back.sh admin_front`

### Default profiles

Each script has a default profile, so you can omit it in the command line. Default profiles are:

- `run-nobuild` — `admin_front`
- `run-build-back` — `back`
- `run-build-front` — `admin_front`
- `run` — `admin_front`

So, if you want to build and run only backend, you can execute the following command:

`> run`

or

`$ ./run.sh`

---

**NOTE**

The `run` script is optimized. It won't build frontend if it is not going to be run.

---

### Access services

You can access the application services from your local machine:

- **front**: `localhost:3000`
- **organization-front**: `localhost:3001`
- **database**: `localhost:5432`. Credentials are in the `.env` file, unless you specify `POSTGRESQL_USERNAME` and `POSTGRESQL_PASSWORD` environment variables
- **admin-backend**: `localhost:8080`
- **organization-service**: `localhost:8082`

# foxhunt

### Code style

Java: [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)

JavaScript: [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)

HTML/CSS: [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)

# gmail

email: foxhunt.itechart@gmail.com
password: $pring2022F0xhunt
