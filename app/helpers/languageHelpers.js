const supportedScripts = {
  zh: ['简','繁','pinyin']
}

function hasMultipleScripts(language){
  var languageFamily = language.split("-")[0]
  if(supportedScripts.hasOwnProperty(languageFamily)){
    return true
  }else{
    return false
  }
}

function getScripts(language){
  var languageFamily = language.split("-")[0]
  return supportedScripts[languageFamily]
}

module.exports = { hasMultipleScripts, getScripts };
