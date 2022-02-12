FROM nginx

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
COPY nginx-server.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html