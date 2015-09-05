////////////////////////////////////////////////////////////////////////////////
//  STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE   //
//      STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE       //
//  STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE STORAGE   //
////////////////////////////////////////////////////////////////////////////////

// Event pages are incompatible with WebRequest events
// so we must use persistent background page anyway.
// Take adventage from this situation we can use simpler data storage
// by storing everything needed in this background page.
// When something change we just make a copy to nonvolatile
// storage without callback needed. By doing so,
// the data maybe loss but just in very rare cases.

var globalStorage;
var asyncSequence=[];

//get data from chrome storage
asyncSequence.push(function(next){
 chrome.storage.local.get(function(chromeDB){
  next(null, chromeDB);
 });
});

//process data for prerequisite store it in globalStorage
asyncSequence.push(function(chromeDB, next){
 //init value if neccessary
 if(typeof(chromeDB["rules"])!=="object"){
  chrome.storage.local.clear(function(){//clear storage
   chrome.storage.local.set(globalStorage={//init storage
    "rules":[]
    }, function(){
     next(null);
    });//set initial value
  });//clear storage
 }else{
  globalStorage=chromeDB;
  next(null);
 }
});


////////////////////////////////////////////////////////////////////////////////
//   INTERFACE INTERFACE INTERFACE INTERFACE INTERFACE INTERFACE INTERFACE    //
//        INTERFACE INTERFACE INTERFACE INTERFACE INTERFACE INTERFACE         //
//   INTERFACE INTERFACE INTERFACE INTERFACE INTERFACE INTERFACE INTERFACE    //
////////////////////////////////////////////////////////////////////////////////

//message dispatcher
var messageSystem=function(request, sender, sendResponse){
 if(request.command=="getRules")
  sendResponse({"rules": globalStorage["rules"]});
 else if(request.command=="addRule"){
  //console.log(request);
  chrome.storage.local.set({
    "rules":request["allRules"]
    }, function(){ //update compiled rule
     globalStorage["rules"]=request["allRules"];
     compiledRules=migrateRules(
     $.extend(true, [], request["allRules"]),
     compiledRules);
    });
 }else if(request.command=="removeRule"){ //identical to addRules for now
  //console.log(request);
  chrome.storage.local.set({
    "rules":request["allRules"]
    }, function(){ //update compiled rule
     globalStorage["rules"]=request["allRules"];
     compiledRules=migrateRules(
     $.extend(true, [], request["allRules"]),
     compiledRules);
    });
 }else{
  console.log("unknow message command");
  console.log(request);
 }
}

////////////////////////////////////////////////////////////////////////////////
//  COMPILATION COMPILATION COMPILATION COMPILATION COMPILATION COMPILATION   //
//        COMPILATION COMPILATION COMPILATION COMPILATION COMPILATION         //
//  COMPILATION COMPILATION COMPILATION COMPILATION COMPILATION COMPILATION   //
////////////////////////////////////////////////////////////////////////////////
var compiledRules;

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function isSameRule(ruleA, ruleB){
 return ((ruleA["match"]==ruleB["match"])&&
 (ruleA["pattern"]==ruleB["pattern"])&&
 (ruleA["type"]==ruleB["type"]));
}

var compilerMatrix={
"H,normal":(function(pattern){
  var regexTmp=("^"+escapeRegExp(pattern)).replace(
  /^\^?\\?\*\\?\./, "(?:^|\.)")+"$";
  return new RegExp(regexTmp);
  }),
"H,aggressive":(function(pattern){
  var regexTmp="^"+escapeRegExp(pattern
  ).replace(/\\\*/g, ".*")+"$";
  return new RegExp(regexTmp);
  }),
"H,regex":(function(pattern){
  return new RegExp(pattern);
  }),
"U,normal":(function(pattern){
  //alias of H,aggressive
  return this["H,aggressive"](pattern);
  }),
"U,regex":(function(pattern){
  //alias of H,aggressive
  return this["H,regex"](pattern);
  }),
}

function migrateRules(newRules, formerRules){
 $.each(newRules, function(uIndex, uElement){ //updatedLoop
  $.each(formerRules, function(fIndex, fElement){ //formerLoop
   if(isSameRule(uElement, fElement)){
    uElement["compiled"]=fElement["compiled"];
    return false; //break
   }
   return true; //continue
  });
  if((typeof(uElement["compiled"])!="object")||
  (typeof(uElement["compiled"].test)!="function")){
   uElement["compiled"]=compilerMatrix[uElement["match"]+
   ","+uElement["type"]](uElement["pattern"]);
  }
 });
 return newRules;
}

asyncSequence.push(function(next){
 //console.log("storage ready");
 //console.log(globalStorage);
 compiledRules=$.extend(true, [], globalStorage["rules"]);
 //compile rules
 compiledRules.map(function(rule){
  rule["compiled"]=compilerMatrix[rule["match"]+
  ","+rule["type"]](rule["pattern"]);
  return rule;
});
 //start listen to message channel
 chrome.runtime.onMessage.addListener(messageSystem);
 //start redirection
 chrome.webRequest.onBeforeRequest.addListener(redirSystem,
 {urls:["http://*/*"]}, ["blocking"]);
 next(null);
});


////////////////////////////////////////////////////////////////////////////////
//  REDIRECTION REDIRECTION REDIRECTION REDIRECTION REDIRECTION REDIRECTION   //
//        REDIRECTION REDIRECTION REDIRECTION REDIRECTION REDIRECTION         //
//  REDIRECTION REDIRECTION REDIRECTION REDIRECTION REDIRECTION REDIRECTION   //
////////////////////////////////////////////////////////////////////////////////

var hostnameExtract=/^http\:\/\/([\-\.0-9a-z]+)(?:\:[0-9]+)?\//;
var httpsApply=/^http\:\/\//;

function redirSystem(details){
 var retval = {}; //do nothing
 var hostname=hostnameExtract.exec(details.url); //populate hostname
 if(!!hostname)hostname=hostname[1];
 //console.log(details.url);
 //console.log(hostname);
 $.each(compiledRules, function(eachIndex, eachRule){
  if(eachRule["match"]=="H"){
   if((!!hostname)&&(eachRule["compiled"].test(hostname))){
    retval={"redirectUrl": details.url.replace(httpsApply, "https://")};
    console.log(retval);
    return false; //break
   }
  }else if(eachRule["match"]=="U"){
   if(eachRule["compiled"].test(details.url)){
    retval={"redirectUrl": details.url.replace(httpsApply, "https://")};
    console.log(retval);
    return false; //break
   }
  }
  return true; //continue
 });

 return retval;
}


////////////////////////////////////////////////////////////////////////////////
//  START START START START START START START START START START START START   //
//     START START START START START START START START START START START      //
//  START START START START START START START START START START START START   //
////////////////////////////////////////////////////////////////////////////////
async.waterfall(asyncSequence);
