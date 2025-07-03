FROM python:3.12-alpine

ARG SEARXNG_VERSION=unknown
LABEL org.opencontainers.image.version="$SEARXNG_VERSION"

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    libxml2-dev \
    libxslt-dev \
    openssl-dev \
    libffi-dev \
    gcc \
    musl-dev \
    git \
    uwsgi \
    uwsgi-python3

# Create searxng user and clawsearch group
RUN addgroup -g 1003 clawsearch && \
    addgroup -g 977 searxng && \
    adduser -u 977 -G searxng -h /usr/local/searxng -s /bin/sh -D searxng && \
    addgroup searxng clawsearch

# Set working directory
WORKDIR /usr/local/searxng

# Copy the searxng source code
COPY --chown=searxng:searxng searxng-upstream/ .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p /etc/searxng && \
    chown -R searxng:searxng /etc/searxng

# Set PYTHONPATH so Python can find the searx module
ENV PYTHONPATH=/usr/local/searxng

# Expose build version for frontend popup
RUN mkdir -p /usr/local/searxng/searx/static && echo "$SEARXNG_VERSION" > /usr/local/searxng/searx/static/version.txt

# Switch to searxng user
USER searxng

EXPOSE 8080

# Start command - run the webapp directly
CMD ["python", "-m", "searx.webapp"] 