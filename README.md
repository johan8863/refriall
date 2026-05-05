# Refriall

## Description

Refriall is **custom software** that I constantly develop and maintain. It's essentially an orders and bills management system.

## Index

- [Features](#features)
- [Requirements](#requirements)
- [Stack](#stack)
- [Deployment](#deployment)
  - [Common](#common)
  - [On macOS/Linux](#on-macoslinux)
  - [On Windows](#on-windows)
    - [Prerequisites](#prerequisites)
    - [1. Set up MariaDB database](#1-set-up-mariadb-database)
    - [2. Install backend dependencies](#2-install-backend-dependencies)
    - [3. Set up the database schema](#3-set-up-the-database-schema)
    - [4. Install frontend dependencies](#4-install-frontend-dependencies)
    - [5. Automate startup as a Windows service](#5-automate-startup-as-a-windows-service)
- [Contact](#contact)

## Features

- Functionalities grouped by sections.
- PDF report generation for bills and orders.
- On demand reloading of backend data to get new model instances.
- Validations in both, front and back-end.
- Creation of order in different currencies.
- Association of order to bills matching Currency and Customer or Customer Dependency.

## Requirements

It is always suggested to have [git](https://git-scm.com/) installed so that you can update the software by just pulling updates, no to download the compressed project from time to time. Follow instructions [on the installation page](https://git-scm.com/install/) to install `git` on your operating system.

On Mac/Linux

- [docker](https://www.docker.com/) container application development

On Windows

- [uv](https://docs.astral.sh/uv/) python package and project manager
- [pnpm](https://pnpm.io/) fast node package manager
- [MariaDB](https://mariadb.org/) open source database
- [nssm](https://nssm.cc/) Windows services tool management.

## Stack

The software is a fullstack application built with the following technologies:

**DevOps:**

- [Docker](https://www.docker.com/) ≥28.0.0 - Containerization

**Backend (Python ≥3.14):**

- [Django](https://www.djangoproject.com/) (5.2) - Core framework
- [Django REST Framework](https://www.django-rest-framework.org/) (3.17.1) - API layer
- [DRF SimpleJWT](https://djangorestframework-simplejwt.readthedocs.io/) (5.5.1) - JWT auth
- [MariaDB](https://mariadb.org/) (11.8.6) - Database
- [Gunicorn](https://gunicorn.org/) (≥25.3.0) - Linux/macOS WSGI server
- [Waitress](https://docs.pylonsproject.org/projects/waitress/) (≥3.0.2) - Windows WSGI server

**Frontend (Node.js):**

- [Vue.js](https://vuejs.org/) (3.3.4) - UI framework
- [Pinia](https://pinia.vuejs.org/) (3.0.4) - State
- [Vue Router](https://router.vuejs.org/) (4.2.4) - Routing
- [Axios](https://axios.rest/) (1.13.4) - HTTP client
- [Bootstrap](https://getbootstrap.com/) (5.3.2) - Styling
- [Vite](https://vitejs.dev/) (7.3.1) - Build tool

> **Pinpoint versions:** See `uv.lock` for backend, `package.json` for frontend.

## Deployment

### Common

The first step is to clone the repository:

```bash
git clone https://github.com/johan8863/refriall.git

cd refriall
```

Then, regardless of the platform, the next installation step is to create the `.env` files for both backend and frontend. In the root directory of the project there is a `.env.sample` file. Copy the contents of that file, create a new `.env` file, and paste the contents into it. You might want to generate a secure password for the `SECRET_KEY` variable. Here's a suggestion using Python:

```python
import secrets
import string

characters = string.ascii_letters + string.digits + string.punctuation
secure_password = ''.join(secrets.choice(characters) for _ in range(63))

print(secure_password)
```

After that `cd refriall_frontend` and repeat the process with the inner `.env.sample` file, in this one there's no password to recreate.

### On macOS/Linux

For both of this operating systems `refriall` is prepared to be installed via [Docker](https://www.docker.com/), make sure you have it properly installed on your system by following its [documentation](https://docs.docker.com/), if you have any doubts you can always [contact me](#contact).

Having docker up and running it is always recommended to take a look at the outer `.env` file you created. The main three following variables are the most important:

```bash
# the name of the initial database, you can leave it unchanged
MARIADB_DATABASE=mariadb_refriall_prod

# for docker you must change the value to mariadb_refriall, the name of the container
MARIADB_HOST=127.0.0.1

# the production settings module will be used, you can leave it unchanged too
DJANGO_SETTINGS_MODULE=project.settings.prod
```

After that you only need to run:

```bash
docker compose up --build -d
```

and the system will be installed via `docker`.

After that, you can access to [http://localhost:8000](http://localhost:8000) and you'll get to the `REFRIALL` login page. From this point you have two situations:

- If starting a fresh new database you must connect to the django container and create the first super user:

```bash
# load the container shell
docker compose exec django_backend bash

# create a super user
python manage.py createsuperuser
```

Now you can access to the system and start creating information.

- If you have a legacy database, then you need to got to `phpMyAdmin` on [http://localhost:8080](http://localhost:8080) to recreate the database because in the building process tables were created thorugh migrations. On the login form provide the values for Server: `mariadb_refriall`, that is the name of the MariaDB container, then Username and Password from the values of the variables `MARIADB_USER` and `MARIADB_ROOT_PASSWORD` on your `.env` file.

  Once in, select your database from the left list and got to the `Operations` tab, scroll down if not visible yet and click on the red text `Drop the database (DROP)`, then `OK` for confirmation.

  Click on `New` at the top left list of databases and enter the same name as the `MARIADB_DATABASE` value. Then go to the `Import` tab and in the first section click the button `Choose File`, select your back-up and click `Import` at the bottom of that page.

  Now you're ready to start working with your legacy information.

### On Windows

### Prerequisites

Before starting, ensure you have:

- Windows 10 or 11 (64-bit)
- Administrator access (for service installation)
- At least 4GB RAM (8GB recommended)
- 2GB free disk space

#### 1. Set up MariaDB database

Start by downloading the MariaDB 11.8.6 windows installer from [the official site](https://mariadb.org/download/). You'll see a form to select the version, operating system and other minor details. The installer is a next-next installer, you only need to define the password for the root user, the rest of the settings can be left at their defaults. Once installed, launch the `HeidiSQL` GUI app to create/manage databases. Create a database named either `mariadb_refriall_prod` or `mariadb_refriall_dev` depending on whether you're going to use the software or to develop/modify it.

At this point you should take a look at the `manage.py` file to find this line:

```python
os.environ.setdefault('DJANGO_SETTINGS_MODULE', config('DJANGO_SETTINGS_MODULE'))
```

And read the instructions from the `.env.sample` or `.env` files and explore the `project/settings/` directory to understand how environment variables are used.

#### 2. Install backend dependencies

Before of moving forward with the database, backend frameworks and libraries must be installed. You have two choices:

- Install uv directly as explained [on installation methods](https://docs.astral.sh/uv/getting-started/installation/#installation-methods)
- [Download](https://www.python.org/downloads/) python and run `pip install uv`

Once you have `uv` installed execute this command from the root directory:

```bash
uv sync
```

This will download and install all Python dependencies.

#### 3. Set up the database schema

If you're working with an empty database, you must run two commands:

```bash
uv run python manage.py migrate   # Creates database tables
uv run python manage.py createsuperuser   # Creates the first user
```

If you are reinstalling the software and already have a previous database, juts apply the migrations.

In both cases you'll se a warning similar to this:.

```bash
WARNINGS:
?: (staticfiles.W004) The directory 'C:\Users\username\dev\refriall\refriall_frontend\dist\static' in the STATICFILES_DIRS setting does not exist.
```

Don't worry about the warning of the missing static folder, it's normal until the frontend is built.

#### 4. Install frontend dependencies

As with backend you have two choices for `pnpm`:

- Install directly as explained [on the official documentation](https://pnpm.io/installation)
- [Download](https://nodejs.org/en/download/) and install Node.js and run `npm install -g pnpm`.

Once pnpm is ready, change to the frontend directory and install dependencies:

```bash
cd refriall_frontend
pnpm install
```

Once the dependecies are installed, build the frontend:

```bash
pnpm build
```

The `Vue.js` frontend is served by django, therefore, in order to have staticfiles ready to use you `must` run the following commands:

```bash
cd .. # return to the root directory
uv run python manage.py collectstatic # collect static files from backend and frontend
```

#### 5. Automate startup as a Windows service

Still alive? Good. Let's automate the software startup as a Windows service.

First, create a `service.log` file in the root directory, it'll be used to write access and errors logs. Then download [nssm](https://nssm.cc/download)(you'll get a zip file). Extract the executable that matches your Windows architecture and copy it to `C:\Windows\System32` so it's available in your Windows PATH.

From a terminal run:

```bash
nssm install refriall
```

(You can change refriall to any name you like.) This will open a window to configure the new service.

##### Configuration

- **Application tab:** In the Path input, provide the path to `waitress-serve.exe` inside your Python virtual environment. Example:
  `C:\Users\username\dev\refriall\.venv\Scripts\waitress-serve.exe`
- **Startup Directory:** Provide the root directory of the software (where manage.py resides). Example:
  `C:\Users\username\dev\refriall\`
- **Arguments:** Paste this:
  `--listen=*:8000 project.wsgi:application`
- **Details tab:** Provide both Display name and Description. These will appear when you run `services.msc`.
- **I/O tab:** In both Output (stdout) and Output (stderr) inputs, provide the path to the `service.log` file. Example:
  `C:\Users\username\dev\refriall\service.log`

Click **Install service.** The service will be created but not started. To start it:

```bash
nssm start refriall
```

Now open your browser at [http://localhost:8000/](http://localhost:8000/) and provide the credentials for the user you created with `createsuperuser`.

Enjoy using this software as much as I love to develop and maintain it.

#### Troubleshooting (Windows)

| Problem                   | Suggestion                                              |
| ------------------------- | ------------------------------------------------------- |
| `uv` not recognized       | Close and reopen terminal after installation            |
| Port 8000 already in use  | Run `netstat -ano \| findstr :8000` to find the process |
| Service fails to start    | Check `service.log` for error details                   |
| Database connection error | Verify MariaDB service is running: `services.msc`       |

## Contact

My name is Johan and I'm a Software Engineer on the journey of daily self improvement.

| Info | |
| --------- | --------- |
| Email | [jtravieso8863@gmail.com](mailto:jtravieso8863@gmail.com) |
| Phone | +53 54719664 |
