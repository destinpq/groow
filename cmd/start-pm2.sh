#!/bin/bash

# Comprehensive PM2 Startup Script for Groow Platform
# This script manages both frontend and backend applications

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if PM2 is installed
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        print_warning "PM2 not found globally. Installing..."
        npm install -g pm2
        if [ $? -eq 0 ]; then
            print_success "PM2 installed successfully"
        else
            print_error "Failed to install PM2"
            exit 1
        fi
    else
        print_success "PM2 is already installed"
    fi
}

# Function to build backend
build_backend() {
    print_status "Building backend..."
    cd backend
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Backend built successfully"
    else
        print_error "Backend build failed"
        exit 1
    fi
    cd ..
}

# Function to build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully"
    else
        print_error "Frontend build failed"
        exit 1
    fi
    cd ..
}

# Function to stop all processes
stop_all() {
    print_status "Stopping all existing processes..."
    pm2 stop groow-backend 2>/dev/null || print_warning "Backend process not running"
    pm2 stop groow-frontend-dev 2>/dev/null || print_warning "Frontend dev process not running"
    pm2 stop groow-frontend-static 2>/dev/null || print_warning "Frontend static process not running"
    
    pm2 delete groow-backend 2>/dev/null || print_warning "Backend process not found"
    pm2 delete groow-frontend-dev 2>/dev/null || print_warning "Frontend dev process not found"
    pm2 delete groow-frontend-static 2>/dev/null || print_warning "Frontend static process not found"
}

# Function to start services based on mode
start_services() {
    local mode=$1
    
    case $mode in
        "development"|"dev")
            print_status "Starting services in development mode..."
            pm2 start ecosystem.config.js --only groow-backend
            pm2 start ecosystem.config.js --only groow-frontend-dev
            ;;
        "production"|"prod")
            print_status "Starting services in production mode..."
            build_backend
            build_frontend
            pm2 start ecosystem.config.js --only groow-backend --env production
            pm2 start ecosystem.config.js --only groow-frontend-static --env production
            ;;
        "staging")
            print_status "Starting services in staging mode..."
            build_backend
            build_frontend
            pm2 start ecosystem.config.js --only groow-backend --env staging
            pm2 start ecosystem.config.js --only groow-frontend-static
            ;;
        "backend-only")
            print_status "Starting backend only..."
            build_backend
            pm2 start ecosystem.config.js --only groow-backend --env ${2:-development}
            ;;
        "frontend-only")
            print_status "Starting frontend only..."
            if [ "${2}" = "production" ]; then
                build_frontend
                pm2 start ecosystem.config.js --only groow-frontend-static --env production
            else
                pm2 start ecosystem.config.js --only groow-frontend-dev
            fi
            ;;
        *)
            print_error "Invalid mode. Use: development|production|staging|backend-only|frontend-only"
            show_help
            exit 1
            ;;
    esac
}

# Function to show help
show_help() {
    echo "Usage: $0 [MODE] [OPTIONS]"
    echo ""
    echo "Modes:"
    echo "  development, dev     - Start both frontend (dev server) and backend"
    echo "  production, prod     - Start both frontend (static) and backend in production mode"
    echo "  staging             - Start both services in staging mode"
    echo "  backend-only [env]  - Start only backend (env: development|production|staging)"
    echo "  frontend-only [env] - Start only frontend (env: development|production)"
    echo "  stop               - Stop all services"
    echo "  restart            - Restart all services"
    echo "  status             - Show PM2 status"
    echo "  logs               - Show logs for all services"
    echo "  monitor            - Open PM2 monitoring dashboard"
    echo ""
    echo "Examples:"
    echo "  $0 development                    # Start both in dev mode"
    echo "  $0 production                     # Start both in production mode"
    echo "  $0 backend-only production        # Start only backend in production"
    echo "  $0 frontend-only development      # Start only frontend in dev mode"
    echo "  $0 stop                          # Stop all services"
}

# Main script logic
main() {
    cd "$(dirname "$0")"
    
    print_status "🚀 Groow Platform PM2 Manager"
    print_status "Current directory: $(pwd)"
    
    if [ $# -eq 0 ]; then
        show_help
        exit 1
    fi
    
    check_pm2
    
    case $1 in
        "stop")
            stop_all
            print_success "All services stopped"
            ;;
        "restart")
            print_status "Restarting all services..."
            pm2 restart groow-backend groow-frontend-dev groow-frontend-static 2>/dev/null || print_warning "Some processes were not running"
            print_success "Services restarted"
            ;;
        "status")
            pm2 status
            ;;
        "logs")
            pm2 logs groow-backend groow-frontend-dev groow-frontend-static
            ;;
        "monitor")
            pm2 monit
            ;;
        *)
            stop_all
            start_services $1 $2
            
            # Save PM2 configuration
            pm2 save
            
            # Setup PM2 to start on system boot (optional)
            if [ "$1" = "production" ] || [ "$1" = "prod" ]; then
                pm2 startup
            fi
            
            print_success "🎉 Groow Platform started successfully!"
            echo ""
            print_status "📊 Monitor: pm2 monit"
            print_status "📝 Logs: pm2 logs"
            print_status "🔄 Restart: pm2 restart [process-name]"
            print_status "🛑 Stop: pm2 stop [process-name]"
            echo ""
            print_status "🌐 Frontend: http://localhost:8001"
            print_status "🔗 Backend API: http://localhost:3001"
            print_status "📚 API Docs: http://localhost:3001/api/docs"
            ;;
    esac
}

# Run main function with all arguments
main "$@"