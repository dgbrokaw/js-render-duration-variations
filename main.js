var duration = 500; // ms
var num_per_trial = 10;
var trial_duration = duration * 2;

function getAverageFrameDuration(frames, cb) {
	var count = 0;

	var t0;
	function loop(timestamp) {
		if (!t0) t0 = timestamp;
		count++;
		if (count < frames) requestAnimationFrame(loop);
		else cb((timestamp - t0)/count);
	}

	requestAnimationFrame(loop);
}

// function runTrials(trials) {
// 	var ids = ["box1", "box2", "box3", "box4"];
// 	var delay = 1000;
// 	trials.forEach(function(trial, idx) {
// 		setTimeout(function() {
// 			showBoxForDuration(ids[idx%ids.length], trial);
// 		}, (Math.floor(idx/4))*delay);
// 	});
// }

function runTrials(trials) {
	trials.forEach(function(trial, idx) {
		setTimeout(function() {
			runTrial(trial);
		}, idx*(num_per_trial+1)*(trial_duration+100));
	});
}

function runTrial(trial) {
	indicateNewTrial("box1");
	var count = 0;
	var id = setInterval(function() {
		if (count < num_per_trial) showBoxForDuration("box2", trial);
		else clearInterval(id);
		count++;
	}, trial_duration);
}

function indicateNewTrial(id) {
	var box = document.getElementById(id);
	setBoxVisibility(box, true);
	setTimeout(function() { setBoxVisibility(box, false) }, duration);
}

function showBoxForDuration(id, settings) {
	var box = document.getElementById(id);

	if (settings.use_timeout) {
		setBoxVisibility(box, true);
		setTimeout(function() {
			setBoxVisibility(box, false);
		}, settings.duration || duration);
	}

	else {
		if (settings.show_outside) setBoxVisibility(box, true);
		aFVisibilityTimeout(box, settings);
	}
}

function setBoxVisibility(box, visible) {
	box.style.visibility = visible ? 'visible' : 'hidden';
}

function aFVisibilityTimeout(box, settings) {
  var start = performance.now()
    , visible = false;

  function loop(timestamp) {
    var current = settings.use_timestamp_parameter ? timestamp : performance.now()
      , delta = current - start;

  	if (!settings.show_outside && !visible) {
  		setBoxVisibility(box, true);
  		visible = true;
  	}

    if (delta >= duration - (settings.dt ? settings.dt : 0)) setBoxVisibility(box, false);
    else window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);
}
