# Refriall

## Description

Refriall is **custom software** that I constantly develop and maintain. It's essentially an orders and bills management system.

## Index

- [Features](#features)
- [Requirements](#requirements)
- [Stack](#stack)
- [Installation](#installation)
  - [Common](#common)
  - [On Mac/Linux](#on-maclinux)
  - [On Windows](#on-windows)
- [Testing](#testing)
- [Contact](#contact)

## Features

- Functionalities grouped by sections.
- PDfs reports.
- On demand reloading of backend data to get new model instances.
- Validations in both, front and back-end.
- Creation of order in different currencies.
- Association of order to bills matching Currency and Customer or Customer Dependency.

## Requirements

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

## Installation

### Common

Regardless of the platform the first installation step is to create the .env files for both backend and frontend. In the root directory of the project there is a .env.sample file, copy the content of that file, create a .env file and paste it into. You might want to generate a secure password for the SECRET_KEY var, here is a suggestion using python:

```python
import secrets
import string

characters = string.ascii_letters + string.digits + string.punctuation
secure_password = ''.join(secrets.choice(characters) for _ in range(63))

print(secure_password)
```

After that `cd refriall_frontend` and repeat the process with the inner .env.sample file, in this one there's no password to recreate.


### On Mac/Linux

### On Windows

-Start by downloading the MariaDB 11.8.6 windows installer from the official site [here](https://mariadb.org/download/), you'll see a form to select the version, operating system and other minor details. The installer is a next-next installer, you only need to define the password for the root user, the rest of the settings can be left in their defaults. Once installed launch the `HeidiSQL` GUI app to create/manage databases. Create a database name with either `mariadb_refriall_prod` or `mariadb_refriall_dev` depending whether you're going to use the software or to develop/modify it. At this point you should take a look at  the `manage.py` file to realize or this line `os.environ.setdefault('DJANGO_SETTINGS_MODULE', config('DJANGO_SETTINGS_MODULE'))` and read instructions from the .env.sample or .env files. You also must look at the project/settings directory to explore environment variables usage.

-Before of going forward with the database, backend frameworks and libraries must be installed, for that purpose you have two choices, install uv directly as explained [here](https://docs.astral.sh/uv/getting-started/installation/#installation-methods) or [download](https://www.python.org/downloads/) python and run `pip install uv`, once you have `uv` installed execute (from the root directory) `uv sync`, this command will download and install all of the python dependencies.

-Now it's time to deal with the database schema. If it's an empty database, you must run two commands, `uv run python manage.py migrate` to apply all migrations and create the database tables, then `uv run python manage.py createsuperuser` to create the first user of the system. At this point you can run `uv run python manage.py runserver` and explore the api following the routes defined or imported in the `project/urls.py` file.

-It's time to install the frontend libraries! As with backend you have two choices for pnpm, installed as explained [here](https://pnpm.io/installation) or [download](https://nodejs.org/en/download/) and install Node.js and run `npm install -g pnpm`. Having `pnpm` ready change directory in refriall_frontend `cd refriall_frontend` and run `pnpm install`, shouldn't take long. Again, at this point you can run `pnpm dev` and start using the software in development mode(remember to have the process of `uv run python manage.py runserver` running).

-Still alive?? Well, let's automate the software startup as a Windows service. First of all, create a service.log file in the root directory, it'll be used to write access and errors logs. Download [nssm](https://nssm.cc/download), you'll get a zip compressed file. Extract the executable that matches your Windows architecture and copy it in the `C:\Windows\System32` folder so that you can have it in the Windows PATH.

-From a terminal run `nssm install refriall`, you can change refriall to any other name you like. That will open a windows to configure the new service.

In the Application tab on the path input provide the waitress-serve.exe installed in your python virtual environment, for example: `C:\Users\username\dev\refriall\.venv\Scripts\waitress-serve.exe`, on the Startup Directoy input provide the root directory of the software(the one where resides manage.py), e.g. `C:\Users\username\dev\refriall\` and in the Arguments input, just paste this `--listen=*:8000 project.wsgi:application`. Move forward to the Details tab and provide both Display name and Description, those will be used when you run `services.msc` windows app. And last but not least, on the I/O tab provide in both Output(stdout) and Output(stderr) inputs the path to the servie.log file created, that'll be `C:\Users\username\dev\refriall\service.log`. 

Click `Install service` and the service will be created but not started, to do so, run `nssm start refriall` and now it done, head your browser at [http://localhost:8000/](http://localhost:8000/) and provide the credentials for the user you created with `uv run python manage.py createsuperuser`. Enjoy using this software as much as I love to develop and maintain it.

## Testing

## Contact
