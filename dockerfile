# ---- Etapa 1: build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./

# Reintentos de npm para redes inestables (va ANTES de npm ci)
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci

COPY . .
RUN npm run build -- --configuration production

# ---- Etapa 2: runtime ----
FROM nginx:alpine
RUN apk add --no-cache curl


COPY --from=build /app/dist/portal-academico/browser /usr/share/nginx/html

RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD if [ -n "$API_URL" ]; then sed -i "s|__API_URL__|${API_URL}|g" /usr/share/nginx/html/index.html; else echo "ERROR: API_URL no definida"; exit 1; fi && nginx -g "daemon off;"