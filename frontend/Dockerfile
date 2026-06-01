# Stage 1: Base - Common settings
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"

RUN corepack enable
WORKDIR /app

# Stage 2: Prod-deps - Only production dependencies
FROM base AS prod-deps

# Copy only dependencies files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install only production dependencies
# --mount=type=cache: use docker cache to avoid redownloading
# --prod: only production dependencies
# --frozen-lockfile: don't update lockfile
# --ignore-scripts: avoids scripts errors
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Stage 3: Build 
FROM base AS build

# Copy dependencies from previous stage
COPY --from=prod-deps /app/node_modules /app/node_modules

# Copy lockfile and package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the rest of the source
COPY . .

# Install all dependencies including dev dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Building
RUN pnpm run build

# Stage 4: Final - Image ready for production
FROM base AS final

# Creat no-root user fr security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copy node_modules from desde prod-deps
COPY --from=prod-deps --chown=appuser:nodejs /app/node_modules /app/node_modules

# Copy the build from build stage
COPY --from=build --chown=appuser:nodejs /app/dist /app/dist

# Copy necessary files for production
COPY --chown=appuser:nodejs package.json ./

# Change to no-root user
USER appuser
