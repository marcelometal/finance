setup:
	@pip install -r requirements.txt

run-api:
	@DEBUG=True adev runserver --port=8080 --aux-port=8888 finance/server.py

run:
	@yarn start
