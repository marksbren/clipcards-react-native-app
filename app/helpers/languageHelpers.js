const supportedScripts = {
  zh: ['简体字','繁体字','pinyin']
}

function hasMultipleScripts(language){
  var languageFamily = language.split("-")[0]
  if(supportedScripts.hasOwnProperty(languageFamily)){
    return true
  }else{
    return false
  }
}

function cleanedSpokenLanguage(languageCode){
  var languageFamily = language.split("-")[0]
}

function getScripts(language){
  var languageFamily = language.split("-")[0]
  return supportedScripts[languageFamily]
}

module.exports = { hasMultipleScripts, getScripts };
