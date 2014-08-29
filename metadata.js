metaRules=[
{"type":"normal"},
{"type":"aggressive"},
{"type":"regex"}
];

mapRules={};
metaRules.forEach(function(eachElement, eachIndex){
 mapRules[eachElement["type"]]=eachIndex;
});
