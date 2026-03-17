# Wordle Game - Static Web Server
FROM nginx:alpine

# Copy static files to nginx web root
COPY . /usr/share/nginx/html/

# Expose port 80 (nginx default)
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]