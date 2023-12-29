FROM ubuntu:18.04

# Set working directory
WORKDIR /app

# Install required packages
RUN apt-get update && apt-get install -y \
    cmake \
    g++ \
    wget \
    libssl-dev \
    libasio-dev

# Set the Boost version
ARG BOOST_VERSION=1.75.0
ARG BOOST_VERSION_UNDERSCORE=1_75_0

# Download and unpack Boost
RUN wget https://boostorg.jfrog.io/artifactory/main/release/${BOOST_VERSION}/source/boost_${BOOST_VERSION_UNDERSCORE}.tar.gz \
    && tar xfz boost_${BOOST_VERSION_UNDERSCORE}.tar.gz \
    && rm boost_${BOOST_VERSION_UNDERSCORE}.tar.gz

# Build and install Boost
WORKDIR /app/boost_${BOOST_VERSION_UNDERSCORE}
RUN ./bootstrap.sh \
    && ./b2 install

# Set work directory back to /app
WORKDIR /app

# Copy the source code
COPY . .

# Build the application
RUN cmake . && make

# Command to run the application
CMD ["./beast-service", "0.0.0.0", "8080", ".", "1"]
