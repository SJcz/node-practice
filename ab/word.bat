ab -n 5000 -c 100  -p './单字评测.json' -T 'application/json' -H 'dmid: test' urlxxxx

ab -n 10 -c 1  -p './上传的base64单字.json' -T 'application/json' -H 'dmid: test' urlxxxx 

ab -n 5000 -c 500  -p './上传的base64单字.json' -T 'application/json' -H 'dmid: test' urlxxxx 