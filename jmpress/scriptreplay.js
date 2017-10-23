var vt, timer;
var speed = 1.0;

function Timer(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function() {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  this.resume = function() {
    start = new Date();
    timerId = window.setTimeout(callback, remaining);
  };

  this.resume();
}

function get_file_contents(filename, callback) {
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else {
    req = new ActiveXObject("Microsoft.XMLHTTP");
  }
  console.log("try to get: " + filename);  
  req.open("GET", filename, false);
  req.onreadystatechange = function() {
    // status is 0 for local files
    if (req.readyState==4 && ( req.status==200 || req.status==0)) {
      callback(req.responseText);
    } else {      
      vt.Write("\x1b[1;31mFile not found: \x1b[1;33m" + filename +"\x1b[0m");
    }
  }
  req.send(null);
}

function play_file(name) {  
  get_file_contents(name, function(typescript_data) {
      get_file_contents(name+".timing", function(timing_data) {
        run_typescript(typescript_data, timing_data);
        });
  });
}

function set_speed(evt) {
  var value = evt.target.options[evt.target.selectedIndex].value;
  speed = parseFloat(value);
}

function set_fontsize(evt) {
  var value = evt.target.options[evt.target.selectedIndex].value;
  $("#term").css("font-size",value);
}

function play(evt) {  
   var button= $(evt.target);
   if (button.data('status') == "play") {
    console.log("play");
    readBlob('typescript', reader_onloadend);
    button.removeClass("fa-play").addClass("fa-pause");
  } else if (button.data('status') == "resume") {
    console.log("resume");
    button.data('status', 'pause');
    button.removeClass("fa-play").addClass("fa-pause");
    timer.resume();
  } else if (button.data('status') == "pause") {
    console.log("pause");
    button.data('status', 'resume');
    button.removeClass("fa-pause").addClass("fa-play");
    timer.pause();
  }
}

function stop(evt) {
  $('#play').data('status', 'play') //.find('i')
    .removeClass("fa-pause").addClass("fa-play");
  if(timer)timer.pause();  
  vt.Clear();  
}

function run_typescript(typescript_data, timing_data) {
  if (timer) timer.pause();
  $('#play').data('status', 'pause')
    .removeClass("fa-play").addClass("fa-pause");
  var where = 0;
  var linenum = 0;
  var timings = timing_data.split("\n");
  var firstlinelen = typescript_data.indexOf("\n") + 1;
  var text = typescript_data.substr(0, firstlinelen);
  var newtext = "";
  where += firstlinelen;

  timer = new Timer(
      function() {
        vt.Write(text);

        text = newtext;
        var me = arguments.callee;
        var line = timings[linenum].split(" ");
        var time = parseFloat(line[0]);
        var bytes = parseInt(line[1]);
        if (isFinite(time) && isFinite(bytes)) {
          newtext = typescript_data.substr(where, bytes);
          where += bytes;
          linenum += 1;
          timer = new Timer(me, time*1000*1/speed);
        } else {
          vt.Write(typescript_data.substr(where, typescript_data.length-where));
          $('#play').data('status', 'play')//.find('i')
            .removeClass("fa-pause").addClass("fa-play");
        };
        
      }, 0);
}

function reader_onloadend(evt) {
  if (evt.target.readyState == FileReader.DONE) { // DONE == 2
    typescript_data = evt.target.result;
    readBlob('timingfile',
        function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            timing_data = evt.target.result;
            run_typescript(typescript_data, timing_data);
          }
        });
  }
}

function readBlob(id, onload_handler) {
  var files = document.getElementById(id).files;
  if (!files.length) {
    alert('Please select a file!');
    return;
  }

  var file = files[0];
  var blob = file.slice(0, file.size);
  var reader = new FileReader();
  reader.onloadend = onload_handler;
  reader.onerror = function(evt) {alert(evt);};
  reader.readAsBinaryString(blob);
}
