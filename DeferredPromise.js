From a semantic perspective this means that instead of calling a function ( callback ), we are able to return a value ( promise ).
Once the Deferred has entered the resolved or rejected state, it stays in that state. Callbacks can still be added to the resolved or rejected Deferred — they will execute immediately.
Callbacks are executed in the order they were added, using the arguments provided to the resolve, reject or notify.


$.Deferred (is unfinished task with status and values)
[notify, notifyWith, reject, rejectWith, resolve, resolveWith, ...]
	
	Promise* (is unknown value)
	Once the promise has been resolved or rejected neither it’s state or the resulting value can be modified
	[state, always, *then, *promise, *pipe, done, fail, progress]
		
		Handlers (based on States & represented by 'then')
		what to do once work is done and/or the value is known
			
			*then(doneFilter, failFilter, progressFilter)
			hold of doing this, until you have result from doing that
			returns new promise (to allow chaining) with value returned from callback handler
		
		States
		pending = unfulfilled = waiting = progress
		resolved = fulfilled = success = done
		rejected = failed = error = fail

*$.when()
what about making a promise based on multiple unknowns



deferred > promise > resolve > done
deferred > when > then/done > resolve
always
resolve > done > fail
notify > then/progress
reject > then/fail/state
resolve > then/done/state
deferred > then > done/fail
promise > done



Sequencing Patterns:
================
Stacked:
---------
  var request = $.ajax(url);

  request.done(function () {
      console.log('Request completed');
  });

  // Somewhere else in the application
  request.done(function (retrievedData) {
      $('#contentPlaceholder').html(retrievedData);
  });

Parallel tasks:
--------------
  $.when(taskOne, taskTwo).done(function () {
      console.log('taskOne and taskTwo are finished');
  });

Sequential tasks:
-----------------
  var step1, step2, url;

  url = 'http://fiddle.jshell.net';

  step1 = $.ajax(url);

  step2 = step1.then(
    function (data) {
        var def = new $.Deferred();

        setTimeout(function () {
            console.log('Request completed');
            def.resolve();
        },2000);

        return def.promise();
    },
    function (err) {
        console.log('Step1 failed: Ajax request');
    }
  );

  step2.done(function () {
      console.log('Sequence completed')
      setTimeout("console.log('end')",1000);
  });

