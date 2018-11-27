# 依赖Node
FROM daocloud.io/library/node

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install CNPM
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
# Install UMIJS
RUN cnpm install -g umi@2.0.2

# Bundle app source
COPY . /app
RUN cnpm install

#设置时区
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

EXPOSE 9096
CMD [ "npm", "run", "prod" ]