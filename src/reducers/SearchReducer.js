import {
  QUERY_CITIES,
  QUERY_CITIES_FAIL,
  QUERY_SCHOOLS,
  QUERY_SCHOOLS_FAIL,
  QUERY_ACTIVITIES,
  QUERY_ACTIVITIES_FAIL,
  FETCH_SEARCH_TERMS_SUCCESS,
  FETCH_SEARCH_TERMS_FAILURE,
  QUERY_COACHES,
  QUERY_COACHES_FAIL,
  QUERY_COACHES_SUCCESS,
  QUERY_MENTORS,
  FETCH_SCHOOLS,
  FETCH_SCHOOLS_FAIL,
  AUTOCOMPELTE,
  AUTOCOMPELTE_FAIL,
  GEOCODE,
  COORDINATES,
  LOAD_MENTORS,
} from '../actions/types'

const INITIAL_STATE = {
  empty: false,
  messages: [],
  userThreads: [],
  mentorThreads: [],
  mentorThreadErr: {},
  activites: [],
  cities: [],
  schools: [],
  schoolsErr: {},
  queryErr: {},
  searchInfo: {},
  coaches: [],
  mentors: [],
  loadingMentors: false,
  autoCompleteErr: '',
  results: [],
  zip: "",
  geo: {},
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case QUERY_CITIES:
      return { ...state, cities: action.payload }
    case QUERY_CITIES_FAIL:
      return { ...state, queryErr: action.payload, cities: [] }
    case QUERY_SCHOOLS:
      return { ...state, schools: action.payload }
    case QUERY_SCHOOLS_FAIL:
      return { ...state, queryErr: action.payload, schools: [] }
    case QUERY_ACTIVITIES:
      return { ...state, activites: action.payload }
    case QUERY_ACTIVITIES_FAIL:
      return { ...state, queryErr: action.payload, activites: [] }
    case FETCH_SEARCH_TERMS_SUCCESS:
      return { ...state, schools: action.payload.schools, cities: action.payload.cities, activities: action.payload.activities }
    case FETCH_SEARCH_TERMS_FAILURE:
      return { ...state, queryErr: action.payload }
    case QUERY_COACHES:
      return { ...state, loadingMentors: false }
    case QUERY_COACHES_FAIL:
      return { ...state, loadingMentors: false, empty: true}
    case QUERY_COACHES_SUCCESS:
      return { loadingMentors: false, mentors: action.payload, empty: false}
    case QUERY_MENTORS:
      return { ...state, mentors: action.payload, loadingMentors: false }
    case FETCH_SCHOOLS:
      return { ...state, schools: action.payload }
    case FETCH_SCHOOLS_FAIL:
      return { ...state, schoolsErr: action.payload }
    case AUTOCOMPELTE:
      return { ...state, results: action.payload }
    case AUTOCOMPELTE_FAIL:
      return { ...state, autoCompleteErr: action.payload }
    case GEOCODE:
      return { ...state, zip: action.payload }
    case COORDINATES:
      return { ...state, geo: action.payload }
    case LOAD_MENTORS: 
      return { ...state, loadingMentors: true }
    default:
      return { ...state }
  }
}
