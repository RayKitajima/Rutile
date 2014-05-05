#!/bin/bash
# 
# usage:
#     
#     $ tiappmaker.sh
#     
#     or, specify path of your generated client libraries and tiapp
#     
#     $ tiappmaker.sh /path/to/{{APP_NAME}}Client /path/to/{{APP_NAME}}App
# 

WRK_DIR=$1

SRC_DIR=$WRK_DIR/{{APP_NAME}}Client
DST_DIR=$WRK_DIR/{{APP_NAME}}App

# check client libraries
if [ ! -d $SRC_DIR ]
then
	echo "source client libraries not found."
	exit
fi

# create new titanium project if not exist
if [ ! -d $DST_DIR ]
then
	echo "creating Titanium Mobile iOS Project"
	titanium create -n {{APP_NAME}}App -p ios --id {{APP_NAME}}App --url {{APP_NAME}}App -d $WRK_DIR -t app --log-level debug -f
	cd {{APP_NAME}}App
	alloy new
	cd ..
fi

echo "building {{APP_NAME}}App..."

echo "installing generated codes"
mkdir $DST_DIR/app
cp -r $SRC_DIR/app/{controllers,styles,views,lib} $DST_DIR/app/.
cp $SRC_DIR/app/alloy.js $DST_DIR/app/.

echo "installing generated i18n files"
cp -r $SRC_DIR/i18n $DST_DIR/.

echo "installing modules (socket.io)"
# TODO: tipm install tipm/socket.io
if [ ! -d $DST_DIR/modules ]
then
	mkdir $DST_DIR/modules
fi
cp -r $SRC_DIR/modules/* $DST_DIR/modules/.

echo "installing fonts"
# fonts will be moved to the build directory once you do build this app
mkdir $DST_DIR/app/assets
cp -r $SRC_DIR/Resources/fonts $DST_DIR/app/assets/.

echo "installing info.plist"
cp $SRC_DIR/Info.plist $DST_DIR/.

echo "editing tiapp.xml"
/usr/bin/env node ./{{APP_NAME}}Tools/tiappxmlfixer.js $DST_DIR/tiapp.xml

