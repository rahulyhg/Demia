import {
  QUERY_CITIES,
  QUERY_CITIES_FAIL,
  QUERY_SCHOOLS,
  QUERY_SCHOOLS_FAIL,
  QUERY_MENTORS,
  FETCH_SEARCH_TERMS_SUCCESS,
  FETCH_SEARCH_TERMS_FAILURE,
  FETCH_SCHOOLS,
  FETCH_SCHOOLS_FAIL,
  AUTOCOMPELTE,
  AUTOCOMPELTE_FAIL,
  GEOCODE,
  COORDINATES,
  LOAD_MENTORS,
} from './types'
import firebase from 'react-native-firebase'
import {
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY, //search only 
  GOOGLE_PLACES_API_KEY,
} from '../config'
var algoliasearch = require('algoliasearch')
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

const mentor_index = client.initIndex('mentors')
var _ = require('lodash')

export const getCities = (activity) => {
  return (dispatch) => {
    try {
      firebase.firestore().collection('coaches')
      .where("subject", "arrayContains", activity)
      .where("activated", "==", true).get()
      .then((querySnap) => {
        if (querySnap.empty) {
          return dispatch({ type: QUERY_CITIES, payload: [] })
        }

        let cities = []
        querySnap.forEach((doc) => {
          let city = { city: doc.data().city.trim() }
          city.id = doc.id
          cities.push(city)
          cities = _.uniqBy(cities, 'city')
          // console.log(cities)
          dispatch({ type: QUERY_CITIES, payload: cities })
        })
      })
    } catch(err) {
      console.log(err)
      dispatch({ type: QUERY_CITIES_FAIL, payload: err })
    }
  }
}

export const getSchools = (city, activity) => {
  return (dispatch) => {
    try {
      firebase.firestore().collection('coaches')
      .where("city", "==", city)
      .where("subject", "arrayContains", activity)
      .where("activated", "==", true)
      .get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log('empty')
          return dispatch({ type: QUERY_SCHOOLS, payload: [] })
        }

        var schools = []
        querySnapshot.forEach((doc) => {
          let school = { school: doc.data().highSchool }
          schools.push(school)
          schools = _.uniqBy(schools, 'school')
          dispatch({ type: QUERY_SCHOOLS, payload: schools })
        })
      })
    } catch(err) {
      console.log('err', err)
      var message = ['Error Querying Schools', 'Please check your network connection and try again.']
      dispatch({ type: QUERY_SCHOOLS_FAIL, payload: message })
    }
  }
}

export const queryMentors = (query, filter, numericFilter, geo) => {
  return (dispatch) => {
    let radius = 5 * 1609
    return mentor_index.search({
      query: query,
      filters: filter,
      numericFilters: numericFilter,
      getRankingInfo: true,
      aroundRadius: radius,
      aroundLatLng: geo,
    }).then((contents) => {
      if (!contents || contents.hits.length < 1) {
        console.warn(contents)
      }
      
      let mentors = contents.hits
      dispatch({ type: QUERY_MENTORS, payload: mentors })
    }).catch((err) => {
      console.log(err)
    })
  }
}

export const fetchSearchTerms = (query) => {
  return (dispatch) => {
    query.onSnapshot((querySnap, err) => {
      if (err) {
        dispatch({ type: FETCH_SEARCH_TERMS_FAILURE })
      }
      if (querySnap.empty) {
        const termInfo = {
          empty: true,
          activities: [],
          cities: [],
          schools: [],
          }
        return dispatch({ type: FETCH_SEARCH_TERMS_SUCCESS, payload: termInfo })
      }
      let activities = [], cities = [], schools = []
      let termsInfo = {}
      querySnap.forEach((doc) => {
        let { subject, city, highSchool } = doc.data()
        if (subject && city && highSchool) {
          subject.forEach((s) => {
            activities.push({ activity: s })
          })
          activities = _.uniqBy(activities, 'activity')

          cities.push({ city: city.trim() })
          cities = _.uniqBy(cities, 'city')
          // console.log(cities)

          schools.push({ school: highSchool })
          schools = _.uniqBy(schools, 'school')

          termsInfo = {
            empty: false,
            activities,
            cities,
            schools,
          }
        }
      })
      dispatch({ type: FETCH_SEARCH_TERMS_SUCCESS, payload: termsInfo })
    })
  }
}

const getCoords = (zip) => {
  return new Promise((resolve, reject) => {
    if (!zip) return;
    url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${GOOGLE_PLACES_API_KEY}`
    fetch(url, {
      method: "GET"
    }).then((res) => res.json())
    .then((solved) => {
      if (solved.status !== 'OK') {
        reject(solved.error)
        return console.log(solved)
      }

      let coords = {
        lat : solved.results[0].geometry.location.lat,
        long : solved.results[0].geometry.location.lng
      }
      resolve(coords)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const fetchNearbySchools = (zip, radius) => {
  return (dispatch) => {
    let radiusMiles = radius * 1690
    getCoords(zip).then((coords) => { //reverse geocode zip
      if (!coords) return dispatch({ type: FETCH_SCHOOLS_FAIL, payload: err });

      var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.lat},${coords.long}&radius=${radiusMiles}&type=school&keyword=school&key=${GOOGLE_PLACES_API_KEY}`
      fetch(url, {
        method: "GET"
      }).then((res) => res.json())
      .then((solved) => {
        if (solved.status !== 'OK') {
          return dispatch({ type: FETCH_SCHOOLS_FAIL, payload: err })
        }

        var schools = solved.results
        let token = solved.next_page_token
        let schoolNames = []
        _.forEach(schools, (school) => {
          s = {
            name: school.name,
            id: school.id,
          }
          schoolNames.push(s)
        })
        saveSchools(schoolNames, radius, zip)
        dispatch({ type: FETCH_SCHOOLS, payload: schoolNames })
      }).catch(err => {
          console.warn("err", err);
          dispatch({ type: FETCH_SCHOOLS_FAIL, payload: err })
      })
    })
  }
}

const saveSchools = (schools, radius, zip) => {
  let user = firebase.auth().currentUser
  firebase.firestore().collection('coaches')
  .doc(user.uid).update({
    tutoringRadius: radius,
    schools: schools,
    zipcode: zip,
  }).catch((err) => {
    console.warn(err)
  })
}

export const autoComplete = (search, field) => {
  return (dispatch) => {
    if (search === ' ' || search ==='') {
      return dispatch({ type: AUTOCOMPELTE, payload: [] })
    }

    mentor_index.searchForFacetValues({
      facetName: `${field}`,
      facetQuery: search,
    }, (err, results) => {
      if (err) {
        console.log(err)
        return dispatch({ type: AUTOCOMPELTE_FAIL, payload: err })
      }

      let c = 0
      hits = []
      _.forEach(results.facetHits, (hit) => {
        //add the search value and id for flatlist
        c = c+1
        hit.id = c
        hit.title = hit.value
        hits.push(hit)
      })
      dispatch({ type: AUTOCOMPELTE, payload: hits })
    })
  }
}

export const autoCompleteMentor = (search, field) => {
  return (dispatch) => {
    mentor_index.searchForFacetValues({
      facetName: `${field}`,
      facetQuery: search,
    }, (err, results) => {
      if (err) {
        console.log(err)
        return dispatch({ type: AUTOCOMPELTE_FAIL, payload: err })
      }
      let picks = _.map(results.facetHits, 'value')
      dispatch({ type: AUTOCOMPELTE, payload: picks })
    })
  }
}

export const reverseGeocode = (position) => {
  return (dispatch) => {
    const apiKey = GOOGLE_PLACES_API_KEY;
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`;
  
    fetch(url, {
      method: "GET"
    }).then((resp) => resp.json())
    .then((solved) => {  
      let zip = solved.results[0].address_components[6].long_name
      dispatch({ type: GEOCODE, payload: zip})
    }).catch(err => {
        console.log("err", err);
    });
  }
}

export const zipTyped = (z) => { //keyboard
  return (dispatch) => {
    dispatch({ type: GEOCODE, payload: z })
  }
}

export const getMentorsFromZip = (zip, radius, query, filter, numericFilter) => {
  radius = radius * 1690
  return (dispatch) => {
    dispatch({ type: LOAD_MENTORS })
    //Get the lat/long from zipcode
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${GOOGLE_PLACES_API_KEY}`
    fetch(url).then((resp) => resp.json())
    .then((solved) => { // returns object with location info
      if (solved.status !== 'OK') {
        return console.log(solved)
      }
  
      let geocode = solved.results[0].geometry.location  
      let geo = `${geocode.lat},${geocode.lng}`
      dispatch({ type: COORDINATES, paylaod: geo }) 

      return mentor_index.search({
        query: query,
        filters: filter,
        numericFilters: numericFilter,
        aroundRadius: radius,
        aroundLatLng: geo,
      })
    }).then((contents) => { //returns results from algolia index search
      if (!contents || contents.hits.length < 1) {
        console.warn(contents)
      }

      let mentors = contents.hits
      dispatch({ type: QUERY_MENTORS, payload: mentors })
    }).catch((err) => {
      dispatch({ type: QUERY_MENTORS, payload: [] })
      console.warn(err)
    })
  }
}