docker build -t hexus .
docker run --name hexus-container -p 80:80 -p 443:443 -d hexus