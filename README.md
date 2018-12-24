#Location Device Manager

Location Device Manager is a microservice built with Express and Bookshelf. It allows 
connected applications to pass the phone numbers of location devices (right now, only the 
Android A8 GPS GSM tracker is supported) and ping them. The results are stored
as a mobile event in the database, and can be retrieved via API calls. We currently use 
SMS as the device control channel, and Nexmo as the SMS gateway provide.

##Why use Location Device Manager?

It provides a convenient way to manage locational devices and their event history.

##How does it work?
Location Device Manager uses Bookshelf to manage RDBMS databases (in the example, I'm using MySQL, but it's 
trivial to switch to PostgreSQL or SQLite) to store device identifiers. Tasks are coming soon (the 
ability to set up a schedule and an expiration to ping devices). 

##Installation
```$xslt
git clone https://github.com/boriskogan81/location-device-manager.git
//...change to /location-device-manager directory
npm install

//Copy the files in the config_templates folder into the config folder at root level, 
//make adjustments as necessary
//Run initial Knex migration:

knex migrate:latest

npm start
```

##Usage
Instructions coming soon

##Tests
Instructions coming soon

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)