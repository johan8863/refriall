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

### On Mac/Linux

### On Windows

## Testing

## Contact
