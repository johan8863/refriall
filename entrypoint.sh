#!/bin/bash
# entrypoint.sh

set -e

# echo "### appliying migrations..."
# python manage.py migrate --noinput
# echo "### migrations applied"

echo "### collecting static files..."
python manage.py collectstatic --noinput
echo "### static files collected"

echo "### starting gunicorn"
gunicorn project.wsgi
