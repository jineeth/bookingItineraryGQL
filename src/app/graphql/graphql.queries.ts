import {gql} from 'apollo-angular'


const GET_BOOKING = gql`
query booking($bookingCode: String!,$familyName: String!) {
  booking(bookingCode: $bookingCode,familyName:$familyName) {
    bookingCode,
  contactDetails{
    class
    address
  }
  itinerary{
    type
    connections{
      id
      duration
      origin{
        IATACode
        city{
          IATACode
          name
          country {
            code
            name
          }
        }
        name
      }
      destination{
        IATACode
        name
        city {
          IATACode
          name
          country {
            code
            name
          }
        }
      }
      segments{
        id
        type
        informational
        marketingFlight{
          number
          numberOfStops
          operatingFlight{
            number
            duration
            flown
            checkInStart
            localCheckInStart
            checkInEnd
            localCheckInEnd
            scheduledArrival
            localScheduledArrival
            scheduledDeparture
            localScheduledDeparture
            equipment{
              code
              name
            }
            cabin {
              code
              name
            }
            arrivalTerminal {
              name
            }
            carrier {
              name
            }
          }
          sellingClass {
            code
          }
          status{
            code
            name
          }
          carrier{
            code
            name
          }
        }
        arriveOn {
          IATACode
          name
          city {
            IATACode
            name
            country{
              code
              name
            }
          }
        }
        departFrom{
          IATACode
          name
          city {
            IATACode
            name
            country {
              code
              name
            }
          }
        }
      }
    }
  }
  passengers{
    id
    firstName
    lastName
    title{
      code
      name
    }
  }
  }
}
`




export {GET_BOOKING}
