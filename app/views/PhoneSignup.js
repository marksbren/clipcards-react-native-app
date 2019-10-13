import React from 'react';
import { View, Text, TextInput, Keyboard, SafeAreaView } from 'react-native';
import PhoneInput from 'react-native-phone-input'
import {
  Button,
  Icon,
  Input
} from 'react-native-elements'

import APIManager from '../networking/APIManager';

import {styles} from '../styles/styles';
import {colors} from '../styles/styles';

export default class PhoneSignup extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: '',
      phoneValid: false,
      codeValid: false,
      isFetching:false,
      error:false,
      showCode:false,
      errorMsg: "Something went wrong"

    }
  }

  // here is where you connect to your api to redeem a user's code
  // I'm using Firebase in this example but of course you don't have to
  // To avoid confusion, I'm storing the API address in process.env.URL. You don't have to do this
  enterPhone(){
    this.setState({isFetching:true})
    let apiManager = APIManager.getInstance();
    apiManager.postPhoneSignup(this.state.phone)
    .then((response) => {
      this.setState({isFetching:false})
      if(response.success){
        this.setState({showCode:true})
      }else{
        this.setState({error:true})
      }
    })

//  valid: this.phone.isValidNumber(),
// type: this.phone.getNumberType(),
// value: this.phone.getValue()
  }

  enterCode(){
    this.setState({isFetching:true})
    let apiManager = APIManager.getInstance();
    apiManager.postPhoneVerify(this.state.phone,this.state.code)
    .then((response) => {
      this.setState({isFetching:false})
      if(response.success){
        console.warn("Saved Token")
      }else{
        this.setState({error:true})
      }
    })
  }

  updateCode(number){
    var re = /^\d{4}$/
    var codeValid = false
    if(re.test(number)){
      codeValid = true
      Keyboard.dismiss()
    }
    this.setState({
      code: number,
      codeValid: codeValid
    })
  }

  redeemCode(code){
    console.warn(code)
  }

  phoneChange(phone){
    this.setState({
      phone: phone,
      phoneValid: this.phone.isValidNumber()
    })
  }

  render(){
    return(
      <SafeAreaView style={styles.safeArea}>
      <View style={{flex: 1}}>
      {/*           ^^^^^^^^ */}
      {/* Make sure to have flex: 1 on parent! */}
      {this.state.showCode ? (
        <View>
          <TextInput
            style={styles.textInput}
            keyboardType = 'numeric'
            onChangeText = {(text)=> this.updateCode(text)}
            value = {this.state.myNumber}
          />
          <Button
            loading={this.state.isFetching}
            disabled={!this.state.codeValid}
            buttonStyle={[styles.button, styles.btnFullWidth]}
            title="Verify"
            backgroundColor={colors.btnGreen}
            onPress={() => this.enterCode()}
          />
        </View>
      ) : (
        <View>
          <PhoneInput ref={ref => {
              this.phone = ref;
            }}
            initialCountry='us'
            onChangePhoneNumber={(data) => this.phoneChange(data)}
          />
          <Button
            loading={this.state.isFetching}
            disabled={!this.state.phoneValid}
            buttonStyle={[styles.button, styles.btnFullWidth]}
            title="Submit"
            backgroundColor={colors.btnGreen}
            onPress={() => this.enterPhone()}
          />
        </View>
      )}

      </View>
      </SafeAreaView>

    );
  }
}
