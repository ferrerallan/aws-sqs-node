zip -r -D function.zip *
aws lambda update-function-code --region sa-east-1 --function-name SQSProcessor --zip-file fileb://function.zip