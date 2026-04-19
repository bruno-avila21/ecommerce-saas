# ─────────────────────────────────────────
# STAGE 1 — Build de React/Vite
# ─────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ARG permite pasar VITE_* al momento del docker build
# El valor real se inyecta en el comando: --build-arg VITE_API_URL=https://...
ARG VITE_API_URL=/api
ARG VITE_UPLOADS_URL=/uploads
ARG VITE_BRAND_NAME=AutoLux
ARG VITE_ACCENT_COLOR=#c9a84c
ARG VITE_STOREFRONT_USER=admin@stock.com
ARG VITE_STOREFRONT_PASS=venta2025

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_UPLOADS_URL=$VITE_UPLOADS_URL
ENV VITE_BRAND_NAME=$VITE_BRAND_NAME
ENV VITE_ACCENT_COLOR=$VITE_ACCENT_COLOR
ENV VITE_STOREFRONT_USER=$VITE_STOREFRONT_USER
ENV VITE_STOREFRONT_PASS=$VITE_STOREFRONT_PASS

RUN npm run build

# ─────────────────────────────────────────
# STAGE 2 — Nginx sirve el SPA
# ─────────────────────────────────────────
FROM nginx:alpine

# Copiar build de Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx (incluye proxy al backend y SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
