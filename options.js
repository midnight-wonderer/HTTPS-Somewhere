//setup metadata
$.extend(metaRules[mapRules["normal"]],
 {"color":"#fcce00",
  "priority":0
 });
$.extend(metaRules[mapRules["aggressive"]],
 {"color":"#ff8000",
  "priority":2
 });
$.extend(metaRules[mapRules["regex"]],
 {"color":"#33cc00",
  "priority":1
 });

//setup page layout
var wholeTd=$("#container-addrule .table-layout td");
wholeTd.css({"padding":"0px 10px", "vertical-align":"top", "width":"50%"});
wholeTd.filter(":first-child").css("padding-left", "0px");
wholeTd.filter(":last-child").css("padding-right", "0px");
wholeTd=undefined;

/*
,
  "validate":(function(){
  var regex=/^(?:\*\.)?(?:[0-9a-z]+(?:\-[0-9a-z]+)*\.)*(?:[0-9a-z]+(?:\-[0-9a-z]+)*)$/;
  return (function(strRule){
   return regex.test(strRule);
  });})()
  
  */

$(document).ready(function(){// wait for bootstrap

var ruleState={};

$("#container-example .display-group").addClass(
"collapse").collapse({"toggle": false});//{"parent":"#container-example"}
var exampleLock=0; //prevent bootstrap's race condition

var updateExample=function(){
 if(!exampleLock){
  $("#container-addrule :radio").prop("disabled", true);
  var allExamples=$("#container-example .display-group");
  var matchedExample=allExamples.filter(
   ".display-"+metaRules[ruleState["type"]]["type"]+".display-"+ruleState["match"]);
  //console.log(".display-"+metaRules[ruleState["type"]]["type"]+".display-"+ruleState["match"]);
  matchedExample.collapse("show");
  allExamples.not(matchedExample).collapse("hide"
  ).off("hidden.bs.collapse").on("hidden.bs.collapse",
  function(){
   $("#container-addrule :radio").prop("disabled", false);
  });
 }
}

$("#container-rulematch :radio").on("change", function(e){
 var targetElement=$(e.target);
 var matchTarget=targetElement.parents("label").data("rulematch");
 //change input display target
 $("#input-rule span:eq(0)").text(matchTarget);
 var showGroup;
 var hideGroup=$("#container-ruletype .display-group").not(
  showGroup=$("#container-ruletype .display-"+matchTarget)
 );
 var updateFlag=false;
 if(hideGroup.has(":radio:checked").length>0){
  exampleLock++;
  showGroup.find(":radio:eq(0)"
  ).prop("checked", true
  ).trigger("change");
  exampleLock--;
 }
 hideGroup.css("display", "none");
 showGroup.css("display", "");
 ruleState["match"]=matchTarget;
 updateExample();
 return true;
});

//add color to rule type
$("#container-ruletype label").each(function(eachIndex, eachElement){
 var jQElement=$(eachElement);
 jQElement.css("color",
  metaRules[mapRules[jQElement.data("ruletype")]]["color"]
  //add event handler
  ).find(":radio").on("change", function(e){
  var changedElement=$(e.target);
  var changedRuletype=changedElement.parents("label").data("ruletype");
  var ruleMeta=metaRules[ruleState["type"]=mapRules[changedRuletype]];
  updateExample();
  $("#input-rule span:eq(0)").css(
   "background-color", ruleMeta["color"]);
  return true;
 });
});


//init input-rule color
exampleLock++;
$("#container-rulematch :radio:eq(0)").trigger("change");
exampleLock--;
$("#container-ruletype :radio:eq(0)").trigger("change");
$("#container-addrule :radio").prop("disabled", false);

//setup rule prototype
$("#container-rules .hsrule .glyphicon-remove").on("click", function(e){
 var targetRule=$(e.target).parents(".hsrule");
 targetRule.animate({"opacity":"0"}, 300, function(){
  var remRule=targetRule.data("ruleRecord");
  targetRule.remove();
   var allRules=$("#container-rules .hsrule"
    ).map(function(index, element){
     return $(element).data("ruleRecord");
    }).toArray();
   chrome.runtime.sendMessage({
     "command":"removeRule",
     "theRule":remRule,
     "allRules":allRules
    });//feed forward no response needed
 });
});
var hsrulePrototype=$(".hsrule:eq(0)");
hsrulePrototype.detach();

//add rule
var validationMatrix={
"H,normal":(function(){
  var regex=/^(?:\*\.)?(?:[0-9a-z]+(?:\-[0-9a-z]+)*\.)*(?:[0-9a-z]+(?:\-[0-9a-z]+)*)$/;
  return (function(strRule){
   return regex.test(strRule);
  });})(),
"H,aggressive":(function(){
  var regex=/^[\.\-\*a-z0-9]+$/;
  return (function(strRule){
   return (regex.test(strRule)&&
   (strRule.indexOf("*")>=0));
  });})(),
"H,regex":(function(){
  //no internal state just test regex vilidity
  return (function(strRule){
   try{
    var compileTest=new RegExp(strRule);
   }catch(err){
    return false;
   }
   return true;
  });})(),
"U,normal":(function(){
  var regex=/^http:\/\/(?:[0-9a-z]+(?:\-[0-9a-z]+)*\.)*(?:[0-9a-z]+(?:\-[0-9a-z]+)*)$\//;
  return (function(strRule){
   if(strRule.indexOf("*")>=0)
    return true;
   return regex.test(strRule);
  });})(),
"U,regex":(function(){
  //just symlink to H,regex
  return (function(strRule){
   return this["H,regex"](strRule);
  });})(),
}

var ruleCmp=function(a, b){
//first round sort by match
if(a["match"]!=b["match"]){
 if(a["match"]=="H")return -1;
 return 1;
}
var tmpA, tmpB;
if((tmpA=metaRules[mapRules[a["type"]]]["priority"])!=
   (tmpB=metaRules[mapRules[b["type"]]]["priority"])){
 if(tmpA>tmpB)return 1;
 return -1;
}
//special case on normal hostname
if((a["type"]=="normal")&&(a["match"]=="H")){
 tmpA=a["pattern"].split(".").reverse();
 tmpB=b["pattern"].split(".").reverse();
 var loop=Math.min(tmpA.length, tmpB.length);
 var tmpCmp;
 for(var i=0; i<loop; i++){
  tmpCmp=tmpA[i].localeCompare(tmpB[i]);
  if(tmpCmp!=0)return tmpCmp;
 }
 if(tmpA.length==tmpB.length)return tmpCmp;
 if(tmpA.length<tmpB.length)return -1;
 return 1;
}
//general case
return a["pattern"].localeCompare(b["pattern"]);
};

$("#input-rule input").on("keyup", function(e){
if(e.keyCode==13) //enter pressed
$("#btn-addrule").trigger("click");
return false;
});

$("#btn-addrule").on("click", function(){
 var currentRule=metaRules[ruleState["type"]];
 var ruleText=$("#input-rule input").val();
 var ruleAdded=false;
 
 //validate
 //console.log(currentRule);
 //console.log(ruleState["match"]);
 
 
 //if.toLowerCase();
 if(validationMatrix[ruleState["match"]+","+currentRule["type"]](ruleText)){
  var newRule=hsrulePrototype.clone(true);
  newRule.css({
  "background-color": currentRule["color"],
  "opacity":"0.1"});
  newRule.find(".text").text(ruleText);
  newRule.find(".match").text(ruleState["match"]);
  newRule.data("ruleRecord", {
   "type":currentRule["type"],
   "match":ruleState["match"],
   "pattern":ruleText
  });
  
  //arranged insert
  var allRules=$("#container-rules .hsrule");
  var cmpval=1, i;
  for(i=0; i<allRules.length; i++){
   cmpval=ruleCmp(newRule.data("ruleRecord"), $(allRules[i]).data("ruleRecord"));
   if(cmpval==0)break;
   else if(cmpval<0){
    newRule.insertBefore(allRules[i]);
	break;
   }
  }
  if(cmpval>0)newRule.appendTo("#container-rules");
  $("#input-rule input").prop("disabled", true);
  async.parallel([function(branchMerge){
   if(cmpval==0){
    $(allRules[i]).css("opacity", "0.5").animate(
     {"opacity":"1"}, 300, function(){
     branchMerge(null);
    });
  }else
  newRule.animate({"opacity":"1"}, 300, function(){
   ruleAdded=true;
   branchMerge(null);
  });
  }], function(){
   $("#input-rule input").prop("disabled", false
   ).focus();
   //getAllRule
   var allRules=$("#container-rules .hsrule"
   ).map(function(index, element){
    return $(element).data("ruleRecord");
   }).toArray();
   //console.log(allRules.indexOf(newRule));
   if(ruleAdded){
    updateRule(allRules, newRule.data("ruleRecord"));
   }
  });
   var updateRule=function(allRules, newRule){
    //console.log(newRule);
    //console.log(allRules);
    chrome.runtime.sendMessage({
     "command":"addRule",
     "theRule":newRule,
     "allRules":allRules
    });//feed forward no response needed
   };

  
  //newRule.appendTo("#container-rules");
  
  //empty input
  $("#input-rule input").val("");
 }else{
  //reject
  //console.log("rejected");
  $("#mdlValidateFailed").modal("show");
 }
});

//build rules list from storagr
chrome.runtime.sendMessage({
 "command":"getRules"
}, function(received){
var rules=received["rules"];
var appendElement=$("#container-rules");
$.each(rules, function(eachIndex, eachRule){
 var newRuleElement=hsrulePrototype.clone(true);
 newRuleElement.css({
  "background-color": metaRules[mapRules[eachRule["type"]]]["color"],
  "opacity":"1"});
 newRuleElement.find(".text").text(eachRule["pattern"]);
 newRuleElement.find(".match").text(eachRule["match"]);
 newRuleElement.data("ruleRecord", eachRule);
 appendElement.append(newRuleElement);
});



//console.log("message");
//console.log();
});

});
