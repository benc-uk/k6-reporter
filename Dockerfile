# =========================================
# === Stage 1: Build Golang k6-reporter ===
# =========================================
FROM golang:1.16 as builder
ARG VERSION="0.0.0"
ARG BUILD_INFO="Not set"

ENV CGO_ENABLED=0
RUN go version
WORKDIR /app
COPY . .
RUN make build

# ==========================================
# === Stage 2: Use exe in runtime image ====
# ==========================================
FROM scratch
WORKDIR /app
COPY --from=builder /app/bin/k6-reporter .
ENTRYPOINT ["./k6-reporter"]
