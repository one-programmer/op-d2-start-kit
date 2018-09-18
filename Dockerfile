FROM node:8

RUN npm set registry https://registry.npm.taobao.org && npm set disturl https://npm.taobao.org/dist && npm set chromedriver_cdnurl http://cdn.npm.taobao.org/dist/chromedriver && npm set operadriver_cdnurl http://cdn.npm.taobao.org/dist/operadriver && npm set phantomjs_cdnurl http://cdn.npm.taobao.org/dist/phantomjs && npm set fse_binary_host_mirror https://npm.taobao.org/mirrors/fsevents && npm set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass && npm set electron_mirror http://cdn.npm.taobao.org/dist/electron/

RUN npm install http-server -g

WORKDIR /home/app
COPY package.json /home/app/
COPY package-lock.json /home/app/
RUN npm install
COPY . /home/app/
EXPOSE 8080
RUN npm run build
CMD http-server dist/
