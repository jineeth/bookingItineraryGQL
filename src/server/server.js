const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const cors = require('cors');
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var { express_graphql } = require('express-graphql');
var { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

var schema = buildSchema(`
    type Query {
        booking(bookingCode : String,familyName: String) : Booking
    },
    type Topic {
        topic: String
        url: String
    },
    type Title {
        code: String
        name: String
      }
      
      type Passengers {
        id: Int
        firstName: String
        lastName: String
        title: Title
      }
      
      type Equipment {
        code: String
        name: String
      }
      
      type Cabin {
        code: String
        name: String
      }
      
      type ArrivalTerminal {
        name: String
      }
      
      type Carrier {
        code: String
        name: String
      }
      
      type OperatingFlight {
        number: String
        duration: String
        flown: Boolean
        checkInStart: String
        localCheckInStart: String
        checkInEnd: String
        localCheckInEnd: String
        scheduledArrival: String
        localScheduledArrival: String
        scheduledDeparture: String
        localScheduledDeparture: String
        equipment: Equipment
        cabin: Cabin
        arrivalTerminal: ArrivalTerminal
        carrier: Carrier
      }
      
      type SellingClass {
        code: String
      }
      
      type Status {
        code: String
        name: String
      }
      
      type MarketingFlight {
        number: String
        numberOfStops: Int
        operatingFlight: OperatingFlight
        sellingClass: SellingClass
        status: Status
        carrier: Carrier
      }
      
      type Country {
        code: String
        name: String
      }
      
      type City {
        IATACode: String
        name: String
        country: Country
      }
      
      type ArriveOn {
        IATACode: String
        name: String
        city: City
      }
      
      type DepartFrom {
        IATACode: String
        name: String
        city: City
      }
      
      type Segments {
        id: Int
        type: String
        informational: Boolean
        marketingFlight: MarketingFlight
        arriveOn: ArriveOn
        departFrom: DepartFrom
      }
      
      type Destination {
        IATACode: String
        name: String
        city: City
      }
      
      type Origin {
        IATACode: String
        name: String
        city: City
      }
      
      type Connections {
        id: Int
        duration: String
        segments: [Segments]
        destination: Destination
        origin: Origin
      }
      
      type Itinerary {
        type: String
        connections: [Connections]
      }
      
      type ContactDetails {
        class: String
        address: String
      }
      
      type Booking {
        bookingCode: String
        passengers: Passengers
        itinerary: Itinerary
        contactDetails: [ContactDetails]
      }
      
`);

var bookingList = [{
    "bookingCode": "PZIGZ3",
    "contactDetails": [
        {
            "@class": "EmailAddress",
            "address": "TRAINER@YAHOO.FR"
        }
    ],
    "itinerary": {
        "type": "ONE_WAY",
        "connections": [
            {
                "id": 1,
                "duration": "120",
                "origin": {
                    "IATACode": "AMS",
                    "name": "Schiphol",
                    "city": {
                        "IATACode": "AMS",
                        "name": "Amsterdam",
                        "country": {
                            "code": "NL",
                            "name": "The Netherlands"
                        }
                    }
                },
                "destination": {
                    "IATACode": "NCE",
                    "name": "Cote D'Azur Airport",
                    "city": {
                        "IATACode": "NCE",
                        "name": "Nice",
                        "country": {
                            "code": "FR",
                            "name": "France"
                        }
                    }
                },
                "segments": [
                    {
                        "id": 2,
                        "type": "LOCAL",
                        "informational": false,
                        "departFrom": {
                            "IATACode": "AMS",
                            "name": "Schiphol",
                            "city": {
                                "IATACode": "AMS",
                                "name": "Amsterdam",
                                "country": {
                                    "code": "NL",
                                    "name": "The Netherlands"
                                }
                            }
                        },
                        "arriveOn": {
                            "IATACode": "NCE",
                            "name": "Cote D'Azur Airport",
                            "city": {
                                "IATACode": "NCE",
                                "name": "Nice",
                                "country": {
                                    "code": "FR",
                                    "name": "France"
                                }
                            }
                        },
                        "marketingFlight": {
                            "number": "1263",
                            "carrier": {
                                "code": "KL",
                                "name": "KLM"
                            },
                            "status": {
                                "code": "CONFIRMED",
                                "name": "Confirmed"
                            },
                            "numberOfStops": 0,
                            "sellingClass": {
                                "code": "Z"
                            },
                            "operatingFlight": {
                                "number": "1263",
                                "carrier": {
                                    "code": "KL",
                                    "name": "KLM"
                                },
                                "duration": "PT2H",
                                "flown": false,
                                "checkInStart": "2016-10-13T03:35+02:00",
                                "localCheckInStart": "2016-10-13T03:35",
                                "checkInEnd": "2016-10-14T08:35+02:00",
                                "localCheckInEnd": "2016-10-14T08:35",
                                "scheduledArrival": "2016-10-14T11:35+02:00",
                                "localScheduledArrival": "2016-10-14T11:35",
                                "scheduledDeparture": "2016-10-14T09:35+02:00",
                                "localScheduledDeparture": "2016-10-14T09:35",
                                "arrivalTerminal": {
                                    "name": "2"
                                },
                                "cabin": {
                                    "code": "10",
                                    "name": "Business"
                                },
                                "equipment": {
                                    "code": "73H",
                                    "name": "Boeing 737-800"
                                }
                            }
                        }
                    }]
            }]
    },
    "passengers": {
        "id": 1,
        "firstName": "RUUD",
        "lastName": "HESP",
        "title": {
            "code": "MR",
            "name": "Mr"
        }
    }
}];




var getBooking = function ({ bookingCode, familyName }) {
    let bookedItem = bookingList.filter(item => item.bookingCode === bookingCode && item.passengers.lastName === familyName)[0];
    if (bookedItem !== null && bookedItem !== undefined) {
        console.log(bookedItem);
        return bookedItem;
    }
    else {
        return null;


    }
}

var root = {
    booking: getBooking,
};


app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
