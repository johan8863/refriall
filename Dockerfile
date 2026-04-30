# builder stage
FROM ghcr.io/astral-sh/uv:python3.14-trixie-slim AS builder

# Setting building envoriment variables
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_NO_DEV=1 \
    UV_PYTHON_DOWNLOADS=0

# install mysql dependencies
RUN apt update && \
    apt upgrade -y && \
    apt install -y --no-install-recommends \
    python3-dev \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config && \
    apt clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project

# copy the rest of the code
COPY . /app

# Sync the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked

# final stage
FROM python:3.14-slim-trixie

# Setting production envoriment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH"

# only libmysqlclient-dev dependency
RUN apt update && \
    apt upgrade -y && \
    apt install -y --no-install-recommends \
    default-libmysqlclient-dev \
    default-mysql-client \
    pkg-config && \
    apt clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Setup a non-root user
RUN groupadd --system --gid 999 sysadmin && \
    useradd --system --gid 999 --uid 999 --create-home sysadmin

# make directory for django collected static files
RUN mkdir -p /app/staticfiles && \
    chown -R sysadmin:sysadmin /app/staticfiles && \
    chmod 755 /app/staticfiles

# Copy the source code
COPY --from=builder --chown=sysadmin:sysadmin /app /app
COPY entrypoint.sh /entrypoint.sh

# Make entrypoint.sh executable
RUN chmod +x /entrypoint.sh

# Use app non-root user
USER sysadmin

# expose gunicorn's service port
EXPOSE 8000

# preparing and running the project
ENTRYPOINT [ "/entrypoint.sh" ]
