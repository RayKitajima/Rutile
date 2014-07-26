
# How to setup Rutile runnable env in Mavericks

You can use *brew* for most of installation.
But here is a guide for scratch.

And it is highly recomended to test in a VMware sandobx. [Fusion supports Mavericks as a guest OS](http://kb.vmware.com/kb/2056603).

## Node.js/npm

Currently, Rutile can be run on Node.js 0.8.*.
Download and install via:

```
http://nodejs.org/dist/
```

Then set your NODE_PATH in your ~/.bash_profile.

```
NODE_PATH=/usr/local/lib/node_modules/
export NODE_PATH
```

## Titanium and Alloy

Get the latest bleeding edge CLI, SDK and Alloy

### CLI

If failed to create new project with latest GA version or some other error while generating your app, try to install titanium CLI from github.

```
sudo npm install -g titanium                                    // latest release version
sudo npm install -g git://github.com/appcelerator/titanium.git  // bleeding edge
```

### SDK

To install Ti sdk, you need to get your Appcelerator developer account.

```
titanium sdk install                  // latest release version
titanium sdk install -b master -d     // bleeding edge

Username: 
Password: 
```

Or get archive from http://builds.appcelerator.com.s3.amazonaws.com/index.html#master

SDK will be installed in your ~/Library.

### Alloy

```
sudo npm install -g alloy                                    // latest release version
sudo npm install -g git://github.com/appcelerator/alloy.git  // bleeding edge
```

### node-appc

For Ti command line support.

```
sudo npm install node-appc -g
```

## postgresql

```
curl -O http://ftp.postgresql.org/pub/source/v9.2.1/postgresql-9.2.1.tar.gz
tar zxvf postgresql-9.2.1.tar.gz
cd postgresql-9.2.1

./configure
make
sudo make install
```

Add PATH and etc into your ~/.bash_profile.

```
PATH=/usr/local/pgsql/bin:$PATH;
export PATH;
LD_LIBRARY_PATH=/usr/local/pgsql/lib;
export LD_LIBRARY_PATH;
DYLD_LIBRARY_PATH=/usr/local/pgsql/lib;
export DYLD_LIBRARY_PATH;
```

Then create your DB and boot it.

```
initdb -D ~/db

pg_ctl -D ~/db start -l ~/db/logfile
```

#### dblink

In the case, you want to get cross database search.

```
cd contrib/dblink/
make
sudo make install
```

To get dblink install in your database, create extension.

```
createdb dblinktest
psql dblinktest
dblinktest=# create extension dblink;
```

## redis

```
curl -O http://download.redis.io/redis-stable.tar.gz
tar zxvf redis-stable.tar.gz
cd redis-stable
make
```

To start redis server, just do this:

```
src/redis-server &
```

## hiredis

```
git clone git://github.com/redis/hiredis.git
cd hiredis
make 
sudo make install
```

## postgis

In the case, you want to get geographical data.

Make sure your PATH, LD_LIBRARY_PATH and DYLD_LIBRARY_PATH.

### gdal

```
curl -O http://download.osgeo.org/gdal/gdal-1.9.2.tar.gz
tar zxvf gdal-1.9.2.tar.gz
cd gdal-1.9.2
./configure
make -j4
sudo make install
```

#### geos

```
curl -O http://download.osgeo.org/geos/geos-3.4.2.tar.bz2
tar jxvf geos-3.4.2.tar.bz2
cd geos-3.4.2
./configure
make -j4
sudo make install
```

#### proj4

```
curl -O http://download.osgeo.org/proj/proj-4.9.0b2.tar.gz
tar zxvf proj-4.9.0b2.tar.gz
cd proj-4.9.0
./configure
make -j4
sudo make install
```

The source is beta phase, so its location will be changed.

#### json-c

see also: http://code.google.com/p/axis2c-unofficial/wiki/InstallationManualMacOsX

see also: https://s3.amazonaws.com/json-c_releases/releases/index.html

version 0.9 is required to build postgis version 2.1.0.

```
curl -O https://s3.amazonaws.com/json-c_releases/releases/json-c-0.9.tar.gz
tar zxvf json-c-0.9.tar.gz
cd json-c-0.9
./configure
make -j4
sudo make install
```

#### postgis

Again, make sure your $PATH and etc,

```
curl -O http://download.osgeo.org/postgis/source/postgis-2.1.0.tar.gz
tar -zxvf postgis-2.1.0.tar.gz
cd postgis-2.1.0
./configure --with-raster --with-topology 
make -j4
sudo make install
```

check it out

```
pg_ctl -D ~/db start -l ~/db/logfile

createdb gistest
psql gistest
=# create extension postgis;
=# select postgis_version();
```

FYI: [postgis version matrix](http://trac.osgeo.org/postgis/wiki/UsersWikiPostgreSQLPostGIS)


## Synchronous binding for Redis and Pg

```
sudo npm install hiredis-simple -g
sudo npm install pg-sync -g
```

## npm packages

If you want to use automatical implementation of authentication logic.

```
sudo npm install unixtime -g
sudo npm install jws -g

```

By default, Rutile uses WebSocket for client server communication.

```
sudo npm install socket.io -g
```

Optionally, you can select normal https access instead of WebSocket.

```
sudo npm install express -g
sudo npm install body-parser -g
```

## Rutile

```
sudo npm install rutile -g
```

BTW, you might have to restore your ~/.npm owner if you are in a fresh installed Mavericks, or this is the first time to use npm.

```
sudo chown -R YOU:staff ~/.npm
```

enjoy.



