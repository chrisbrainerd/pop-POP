function throttle(callback, wait, context = this) {
  let timeout = null 
  let callbackArgs = null
  
  const later = () => {
    callback.apply(context, callbackArgs)
    timeout = null
  }
  
  return function() {
    if (!timeout) {
      callbackArgs = arguments
      timeout = setTimeout(later, wait)
    }
  }
}

var OPTS = {
  fill:           'none',
  radius:         25,
  strokeWidth:    { 50 : 0 },
  scale:          { 0: 1 },
  duration:       500,
  left:           0,        
  top:            0,
  easing: 'cubic.out'
};

var mouseDownHandler = throttle(function (e) {
  // ignore if we're not turned on
  if (!document.popPop) return;
  
  mousedownTime = new Date();
  const shape1 = new mojs.Shape({
      ...OPTS,
      stroke: 'magenta',
      shape: 'zigzag',
      radiusY: 50,
      scale: {0: 0.4},
      angle: 0
    })
    .tune({ x: e.pageX, y: { [e.pageY.toString()]: (e.pageY - 20).toString()}  });
  shape1.el.style.zIndex = 2147483647;
  shape1.replay();

  const shape2 = new mojs.Shape({
      ...OPTS,
      stroke: 'magenta',
      shape: 'zigzag',
      radiusY: 5,
      scale: {0: 0.4},
      angle: 0
    })
    .tune({ x: e.pageX, y: { [e.pageY.toString()]: (e.pageY - 20).toString()}  });
  shape2.el.style.zIndex = 2147483647;
  shape2.replay();

}, 100);

var mouseUpHandler = throttle(function (e) {
  // ignore if we're not turned on
  if (!document.popPop) return;

  // kinda hacky way to filter out clicks where mouedown+up happen in close succession
  const timeDiff = new Date().getTime() - mousedownTime.getTime();
  if (timeDiff < 100) return;

  const shape1 = new mojs.Shape({
      ...OPTS,
      stroke: 'magenta',
      shape: 'zigzag',
      radiusY: 50,
      scale: {0: 0.4},
      angle: 180
    })
    .tune({ x: e.pageX, y: { [e.pageY.toString()]: (e.pageY + 40).toString()}  })
  shape1.el.style.zIndex = 2147483647;
  shape1.replay();

  const shape2 = new mojs.Shape({
      ...OPTS,
      stroke: 'magenta',
      shape: 'zigzag',
      radiusY: 5,
      scale: {0: 0.4},
      angle: 180
    })
    .tune({ x: e.pageX, y: { [e.pageY.toString()]: (e.pageY + 40).toString()}  })
  shape1.el.style.zIndex = 2147483647;
  shape2.replay();

  mouseupAttached = false;
}, 100);

let mouseupAttached = false;
let mousedownTime;

var mouseMoveHandler = throttle(function (e) {
  // draw on mouse up only if we moved, so attach on move
  if (!mouseupAttached) {
    document.addEventListener('mouseup', mouseUpHandler);
    mouseupAttached = true;
  }

  const shape = new mojs.Shape({
    ...OPTS,
    radius: 5,
    stroke: 'cyan',
  })
    .tune({ x: e.pageX, y: e.pageY  });
  shape.el.style.zIndex = 2147483647;
  shape.replay();
}, 20);

var keyPressHandler = function(e) {
  if (!document.popPop) return;
}

const removeHandlers = () => {
  document.removeEventListener('mousemove', mouseMoveHandler);
  document.removeEventListener('drag', mouseMoveHandler);
}

const attachHandlers = () => {
  // on move or drag, draw a thing
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('drag', mouseMoveHandler, true);

  // remove listeners
  document.addEventListener('mouseup', removeHandlers);
  document.addEventListener('dragend', removeHandlers);
}

(function() {
  if (document.popPop) {
    document.popPop = false;
  } else {
    document.popPop = true;

    // fire single animation now
    document.addEventListener('mousedown', mouseDownHandler); 

    // attach handlers for mouse move
    document.addEventListener('mousedown', attachHandlers);
    document.addEventListener('dragstart', attachHandlers, true);
  }
})();