define(['rx', 'jquery', 'rx.async'], function(Rx, $) {
  var requestStream = Rx.Observable.just('https://api.github.com/users');
  var responseMetastream = requestStream
    .flatMap(function(requestUrl) {
      return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
    });
  responseMetastream.subscribe(function() {
    console.log(arguments);
  });
});
