# ClawSearch 🔍

A powerful, privacy-focused search engine built on SearXNG with a beautiful Dracula theme and enhanced user experience.

## 🌟 Current Status: Fully Operational ✅

All services are running with no errors. Search functionality, UI customizations, and theme integration are working correctly.

## 🎨 UI Features

- **Custom Logo**: Responsive SVG logo with hover effects
- **Search Box**: Dark background (#21222c) with purple focus borders  
- **Placeholder**: "Explore the cyber cat-alogue..."
- **Theme**: Custom Dracula theme with Hack Nerd Font
- **Branding**: ClawSearch instance name
- **Colors**: Full Dracula color palette integration

## 🔧 Technical Stack

### Services
- **nginx**: Reverse proxy with SSL termination
- **searxng**: Search engine with custom theme
- **redis**: Caching and session storage

### Configuration
- **Domain**: search.angryjuniper.cloud
- **SSL**: Cloudflare Origin Certificates (valid until 2040)
- **Theme**: dracula (custom implementation)
- **Font**: Hack Nerd Font family

### Search Engines
- Startpage (weight: 3)
- Brave (weight: 2) 
- DuckDuckGo (weight: 1)
- Wikipedia (weight: 1)
- Qwant (weight: 2)

## 🚀 Features Working

✅ **Homepage**: Loads with custom logo and styling  
✅ **Search**: Full search functionality with results  
✅ **Autocomplete**: Suggestions working (e.g., "linux" → "linux kernel", "linux distribution")  
✅ **Templates**: All Dracula theme templates properly integrated  
✅ **CSS**: Custom styling for search inputs and UI elements  
✅ **SSL**: Secure HTTPS with valid certificates  
✅ **Responsive**: Mobile-friendly responsive design  

## 📁 Directory Structure

```
/home/ubuntu/searxng-docker/
├── docker-compose.yml     # Container orchestration
├── searxng/
│   └── settings.yml       # SearXNG configuration
├── nginx/
│   ├── conf.d/            # Nginx configuration
│   └── ssl/               # SSL certificates
├── themes/
│   └── dracula/           # Custom theme assets (CSS, images, fonts)
└── templates/
    └── dracula/           # Custom Jinja2 templates
```

## 🔍 Usage

The search engine is accessible at:
- **HTTPS**: https://search.angryjuniper.cloud
- **Direct**: http://localhost:8080 (SearXNG container)

## 🛠 Management Commands

```bash
# Start services
cd /home/ubuntu/searxng-docker && docker-compose up -d

# View logs
docker-compose logs -f searxng
docker-compose logs -f nginx

# Restart services
docker-compose restart

# Stop services  
docker-compose down
```

## 🎯 Key Customizations

1. **Logo Integration**: SVG logo replaces text title
2. **Search UX**: Custom placeholder and dark input styling
3. **Theme Inheritance**: Complete Dracula template system
4. **Font Integration**: Hack Nerd Font throughout interface
5. **Color Consistency**: Dracula palette across all components
6. **SSL Security**: Production-ready certificates

## 📊 Performance

- **Response Time**: Fast search results via multiple engines
- **Autocomplete**: Real-time suggestions via Startpage
- **Caching**: Redis-powered session and result caching
- **Load Balancing**: Engine weight distribution for optimal results

---

**Instance**: ClawSearch  
**Last Updated**: 2025-07-01  
**Status**: Production Ready ✅ 

## ✨ Features

- **Privacy-First**: No tracking, no ads, no user data collection
- **Beautiful UI**: Dracula theme with enhanced autocomplete and responsive design
- **Fast & Reliable**: Redis caching and optimized performance
- **Secure**: SSL support, security headers, and environment-based configuration
- **Professional Architecture**: Git submodules for clean dependency management
- **Easy Deployment**: Docker Compose with automated setup scripts

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git
- OpenSSL (for generating secrets)

### 1. Clone and Setup

```bash
git clone https://github.com/angryjuniper/clawsearch.git
cd clawsearch
./scripts/dev-setup.sh
```

### 2. Configure Environment

Edit `.env` with your actual values:

```bash
# Generate secrets
openssl rand -hex 32  # Use for SEARXNG_SECRET_KEY
openssl rand -base64 32  # Use for REDIS_PASSWORD

# Edit configuration
nano .env
```

### 3. Start Services

```bash
docker-compose up -d
```

### 4. Access ClawSearch

Open your browser to `http://localhost` (or your configured domain)

## 📁 Project Structure

```
clawsearch/
├── searxng-upstream/          # SearXNG submodule (upstream code)
├── dracula-upstream/          # Dracula theme submodule
├── customizations/            # Your customizations
│   ├── themes/dracula/        # CSS and JS customizations
│   ├── templates/dracula/     # HTML template customizations
│   ├── config/                # settings.yml configuration
│   └── scripts/               # Deployment scripts
├── nginx/                     # Nginx configuration
├── scripts/                   # Development and setup scripts
├── docker-compose.yml         # Container orchestration
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `SEARXNG_SECRET_KEY`: Random 32+ character secret (generate with `openssl rand -hex 32`)
- `SEARXNG_BASE_URL`: Your domain URL (e.g., `https://search.yourdomain.com/`)
- `REDIS_PASSWORD`: Redis authentication password
- `NGINX_PORT`/`NGINX_SSL_PORT`: Web server ports

### SearXNG Settings

Edit `customizations/config/settings.yml` to customize:
- Search engines and categories
- UI preferences and defaults
- Privacy and security settings
- Performance optimizations

### Theme Customization

Modify files in `customizations/themes/dracula/`:
- `style.css`: Visual styling
- `search.js`: JavaScript functionality
- Template files in `customizations/templates/dracula/`

## 🛠️ Development Workflow

### Making Changes

1. **Edit customizations** in the `customizations/` directory
2. **Apply changes** to the running instance:
   ```bash
   ./customizations/scripts/apply-customizations.sh
   docker-compose restart clawsearch-searxng
   ```
3. **Test changes** in your browser
4. **Commit to version control** when satisfied

### Updating Submodules

```bash
# Update SearXNG
cd searxng-upstream
git pull origin main
cd ..

# Update Dracula theme
cd dracula-upstream
git pull origin main
cd ..

# Commit submodule updates
git add searxng-upstream dracula-upstream
git commit -m "Update submodules"
```

### Architecture Benefits

- **Clean separation**: Customizations are isolated from upstream code
- **Easy updates**: Pull upstream changes without conflicts
- **Version control**: Track your customizations separately
- **Collaboration**: Share customizations without upstream code bloat

## 🔒 Security

### Secrets Management

- ❌ **Never commit** `.env` files or secrets to Git
- ✅ **Use strong secrets**: Generate with `openssl rand`
- ✅ **Environment variables**: All secrets configured via environment
- ✅ **Regular rotation**: Change secrets periodically

### SSL/HTTPS Setup

1. **Obtain certificates** (Let's Encrypt recommended)
2. **Place certificates** in `nginx/ssl/` directory
3. **Update nginx configuration** in `nginx/conf.d/`
4. **Set SSL environment variables** in `.env`

### Security Headers

ClawSearch includes security headers in nginx configuration:
- HSTS (HTTP Strict Transport Security)
- CSP (Content Security Policy)
- X-Frame-Options
- X-Content-Type-Options

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f clawsearch-searxng
docker-compose logs -f clawsearch-nginx
docker-compose logs -f clawsearch-redis
```

### Performance Monitoring

- **Nginx logs**: `nginx/logs/` directory
- **Container stats**: `docker stats`
- **Resource usage**: Monitor CPU, memory, and disk usage

## 🚨 Troubleshooting

### Common Issues

**Services won't start:**
- Check `.env` configuration
- Verify port availability
- Review logs: `docker-compose logs`

**Theme not loading:**
- Run: `./customizations/scripts/apply-customizations.sh`
- Restart services: `docker-compose restart`
- Check file permissions

**Search not working:**
- Verify Redis connection
- Check SearXNG logs
- Validate settings.yml syntax

### Getting Help

1. **Check logs** first: `docker-compose logs -f`
2. **Review configuration**: Ensure `.env` is properly set
3. **Test components**: Verify each service individually
4. **Check GitHub issues**: [Project Issues](https://github.com/angryjuniper/clawsearch/issues)

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes in `customizations/`
4. Test thoroughly
5. Submit a pull request

### Guidelines

- Keep customizations in the `customizations/` directory
- Document any new environment variables
- Test changes before submitting
- Follow existing code style and organization

## 📝 License

This project builds upon:
- [SearXNG](https://github.com/searxng/searxng) - AGPLv3+
- [Dracula Theme](https://github.com/dracula/dracula-theme) - MIT

ClawSearch customizations are released under MIT License.

## 🙏 Acknowledgments

- **SearXNG Team**: For the excellent privacy-focused search engine
- **Dracula Team**: For the beautiful dark theme
- **Community**: For contributions and feedback

---

**ClawSearch** - Privacy-focused search with style 🎨 