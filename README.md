# Refriall

## Description

Refriall is **custom software** that I constantly develop and maintain. It's essentially an orders and bills management system.

## Index

- [Features](#features)
- [Requirements](#requirements)
- [Stack](#stack)
- [Installation](#installation)
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
- [Docker](https://www.docker.com/) - Containerization for the database and phpMyAdmin (for now)

**Backend:**
- [Django](https://www.djangoproject.com/) - Core framework for database schema modeling, querying, authentication, and CORS configuration
- [Django REST Framework](https://www.django-rest-framework.org/) - RESTful API layer
- [Django REST Framework SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) - JWT authentication
- [MariaDB](https://mariadb.org/) - Relational database
- [python-decouple](https://github.com/henriquebastos/python-decouple) - Environment variables management
- [Gunicorn](https://gunicorn.org/) - WSGI HTTP server (Linux/macOS production)
- [Waitress](https://docs.pylonsproject.org/projects/waitress/en/stable/) - WSGI server (Windows environments)

**Frontend:**
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Axios](https://axios.rest/) - HTTP client for backend communication
- [Bootstrap](https://getbootstrap.com/) - UI styling

## Installation

### On Mac/Linux

### On Windows

## Testing

## Contact
