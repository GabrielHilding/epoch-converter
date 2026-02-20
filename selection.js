$(document).ready(function () {
  $('body').append('<div id="ec-bubble"><pre id="ec-bubble-text"></pre></div>');

  $(document).click(function () {
    hideBubble();
  });

  $('#ec-bubble').click(function (event) {
    event.stopPropagation();
  });

  $('#ec-bubble').on('mouseover', function (event) {
    event.stopPropagation();
  });

  $(document).dblclick(function (e) {
    processSelection(e);
  });

  $(document).bind('mouseup', function (e) {
    processSelection(e);
  });

  let hoverTimer = null;
  $(document).on('mouseover', function (e) {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(function () { processHover(e); }, 100);
  });

});

function processSelection(e) {
  let text = getSelectedText();

  if ($.isNumeric(text) && [10, 13,16].includes(text.length)) {
    if (text.length == 13) {  // Handle millisecond timestamps
      text = text / 1000;
    }
    if (text.length == 16) {  // Handle microsecond timestamps
      text = text / 1000000;
    }
    var date = timestampToDate(text);
    showBubble(e, getLocalString(date), getUTCString(date));
  }
}

function processHover(e) {
  let target = e.target;
  if ($(target).closest('#ec-bubble').length > 0) return;

  let text = '';
  for (let node of target.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  }
  text = text.trim();

  if ($.isNumeric(text) && [10, 13, 16].includes(text.length)) {
    let ts = text;
    if (text.length === 13) {
      ts = text / 1000;
    } else if (text.length === 16) {
      ts = text / 1000000;
    }
    var date = timestampToDate(ts);
    showBubble(e, getLocalString(date), getUTCString(date));
  } else {
    hideBubble();
  }
}

function getSelectedText() {
  var text = "";

  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type !== 'Control') {
    text = document.selection.createRange().text;
  }

  return text;
}

function timestampToDate(ts) {
  ts = ts.length === 13 ? parseInt(ts) : ts * 1000;
  return new Date(ts);
}

function getLocalString(date) {
  tz = date.getTimezoneOffset()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} GMT${tz < 0 ? '+' : '-'}${pad(Math.floor(tz / 60))}:${pad(tz % 60)}`
}

function getUTCString(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} GMT`
}

function pad(v) {
  return v.toString().padStart(2, '0')
}

function showBubble(e, localDateStr, utcDateStr) {
  $('#ec-bubble').css('top', e.pageY + 20 + "px");
  $('#ec-bubble').css('left', e.pageX - 85 + "px");
  $('#ec-bubble-text').html(localDateStr + '<br/>' + utcDateStr);
  $('#ec-bubble').css('visibility', 'visible');
}

function hideBubble() {
  $('#ec-bubble').css('visibility', 'hidden');
  $('#ec-bubble-text').html('');
}
