import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';
import * as RNLocalize from "react-native-localize";
import { GOOGLE_API_KEY } from 'react-native-dotenv'

const supportedScripts = {
  zh: ['简体字','繁体字','Pīnyīn']
}

const scriptsRequiringSpaces = ['Pīnyīn']

export default class LanguageHelpers {
  static hasMultipleScripts(language){
    var languageFamily = language.split("-")[0]
    if(supportedScripts.hasOwnProperty(languageFamily)){
      return true
    }else{
      return false
    }
  }

  static getTranslation(string){
    var languageCode = this.deviceLanguage()
    TranslatorConfiguration.setConfig(ProviderTypes.Google, GOOGLE_API_KEY ,languageCode)

    const translator = TranslatorFactory.createTranslator();
    return new Promise((resolve, reject) => {
      translator.translate(string)
        .then(translated => {
          //Do something with the translated text
          // console.warn(translated)
          resolve(translated)
        })
        .catch((errorMessage) => { reject(errorMessage) })
      })
  }

  static deviceLanguage(){
    var languageObject = RNLocalize.getLocales()
    var languageCode = languageObject[0].languageCode
    return languageCode
  }

  static languageScriptNeedsSpaces(language,scriptIndex){
    var script = this.getScripts(language)[scriptIndex]
    return (scriptsRequiringSpaces.indexOf(script) !== -1)
  }


  static cleanedSpokenLanguage(languageCode){
    var languageFamily = language.split("-")[0]
  }

  static getScripts(language){
    var languageFamily = language.split("-")[0]
    return supportedScripts[languageFamily]
  }

}
