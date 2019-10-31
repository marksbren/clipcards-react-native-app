import React, { Component } from 'react';
import * as Keychain from 'react-native-keychain';
const Frisbee = require('frisbee');

// create a new instance of Frisbee
const api = new Frisbee({
  baseURI: "http://localhost:4040/api", // optional
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

import {Platform,
  AsyncStorage
} from 'react-native';

import NetInfo from "@react-native-community/netinfo"

export default class APIManager extends Component {
  static myInstance = null;
  _accessToken = "";
  _user = {}

  static getInstance() {
      if (APIManager.myInstance == null) {
          APIManager.myInstance = new APIManager();
      }
      APIManager.myInstance.reloadAuthToken()
      return APIManager.myInstance;
  }

  _saveAccessToken = async () => {
    try {
      await Keychain.setGenericPassword(
        '@ClipCardsStore:token',
        this._accessToken
      );
    } catch (err) {
      console.warn('Could not save credentials. ' + err)
    }
  }

  _loadAccessToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this._accessToken = credentials.password
        api.jwt(credentials.password)
        return credentials.password
      } else {
        console.warn('No credentials stored');
      }
    } catch (err) {
      console.warn('Could not load credentials. ' + err)
    }
  }

  _clearAccessToken = async () => {
    this._accessToken = ""
    try {
      await Keychain.setGenericPassword(
        '@ClipCardsStore:token',
        ""
      );
    } catch (err) {
      console.warn('Could not clear Auth Token. ' + err)
    }
  }

  reloadAuthToken(){
    if(this._accessToken.length === 0){
      this._loadAccessToken()
    }else{
      api.jwt(this._accessToken)
    }
  }

  AuthToken(callback) {
    return this._loadAccessToken().then(function(token) {
        return callback(token, null);
    }).catch(function(err) {
        return callback(null,err);
    });
  }

  setAuthToken(token) {
    this._accessToken = token;
    api.jwt(token)
    this._saveAccessToken(token)
  }

  removeToken(){
    this._clearAccessToken()
    api.jwt()
  }

  postPhoneVerify(phoneString,codeString){
    var url = '/auth/verify-number'
    var body = {phone: phoneString, code: codeString}

    return this.postAPI(url,body)
    .then((responseJson) => {
      if(responseJson.body.hasOwnProperty('token')){
        console.warn(responseJson.body.token)
        this.setAuthToken(responseJson.body.token)
        return {success:true,error:false}
      }else{
        console.warn(responseJson.body.token)
        return {success:false,error:false}
      }
    })
    .catch((error) =>{
      console.error(error);
      return {success:false,error:true}
    });
  }

  getVideoCaptionLanguages(youtubeId){
    var url = '/yt/' + youtubeId + '/captions'
    return this.getAPI(url,{})
    .then((responseJson) => {
      return {success:true,error:false,data:responseJson.body}
    })
    .catch((error) =>{
      console.error(error);
      return {success:false,error:true}
    });
  }

  getVideoCaptions(youtubeId,language){
    var url = '/yt/' + youtubeId + '/captions'
    return this.postAPI(url,{language:language})
    .then((responseJson) => {
      return {success:true, error:false, data:responseJson.body}
    })
    .catch((error) =>{
      console.error(error);
      return {success:false,error:true}
    });
  }

  updateBookmark(bookmarkObject, isActive, tappedIndex){
    var url = '/bookmarks'
    var body = {
      bookmarks: [{
      	captionData: bookmarkObject.captionDataId,
      	captionDataIndex: bookmarkObject.captionDataIndex,
      	tappedIndex: tappedIndex,
      	isActive: isActive
      }]
    }

    return this.postAPI(url,body)
    .then((responseJson) => {
      return {success:true,error:false}
    })
    .catch((error) =>{
      console.error(error);
      return {success:false,error:true}
    });

  }

  postPhoneSignup(phoneString){
    var url = '/auth/register-number'
    var body = {phone: phoneString}

    return this.postAPI(url,body)
    .then((responseJson) => {
      return {success:true,error:false}
    })
    .catch((error) =>{
      console.error(error);
      return {success:false,error:true}
    });
  }

  getAPI(url,body){
    return api.get(url,{body: body})
      .then((responseJson) => {
        return responseJson
      })
      .catch((error) =>{
        console.warn(error);
      });
  }

  postAPI(url,body){
    return api.post(url,{body: body})
      .then((responseJson) => {
        return responseJson
      })
      .catch((error) =>{
        console.warn(error);
      });

  }


}
