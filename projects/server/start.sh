#!/bin/sh

# Starts the application.
# Call from the package.json!
#
# This file is required to set up pino logging to seq.
# To keep pino fast, log messages are sent to seq through STDOUT/STDERR 
# instead of a stream: https://getpino.io/#/docs/transports?id=in-process-transports
# 
# See https://github.com/datalust/pino-seq and the below explanation.
#

echo Starting... check seq.

#	MaxListenersExceededWarning: check the PID to see if it matches the process.
#		Likely, it will not; this means it is one of the two pino-seq processes that
#		is responsible for the warning. TODO - solve this issue.

if [[ -v WBT_SEQ_URL ]]
then
	#
	#	Start app, \
	#		and send STDERR (Error messages, which pino doesn't usually handle) to Seq as Error \
	#		and send STDOUT (at least, the ones pino doesn't already capture) to Seq as Information
	#
	echo "using Seq..."
	node ./dist/index.js \
		2> >(npx pino-seq --logOtherAs Error --serverUrl ${WBT_SEQ_URL}) \
		> >(npx pino-seq --logOtherAs Information --serverUrl ${WBT_SEQ_URL})
else
	# Ignore Seq (useful when Seq is deployed separately)
	echo "without Seq..."
	node ./dist/index.js
fi