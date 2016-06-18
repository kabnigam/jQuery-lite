const DOMNodeCollection = require("./dom_node_collection.js");

window.$l = function (arg) {
  if (typeof arg === 'string') {
    const element_list = document.querySelectorAll(arg);
    let element_arr = Array.from(element_list);
    let dnc = new DOMNodeCollection(element_arr);
    return dnc;
  } else if (arg instanceof HTMLElement) {
    let element_arr = [];
    element_arr.push(arg);
    let dnc = new DOMNodeCollection(element_arr);
    return dnc;
  } else if (typeof arg === 'function') {
    domReady(arg);
  }
};

$l.extend = function(...args) {
  args.slice(1).forEach(obj => {
    Object.keys(obj).forEach(k => {
      args[0][k] = obj[k];
    });
  });
  return args[0];
};

$l.ajax = function(options) {
  const defaults = {success: () => {}, error: () => {}, url: '', method: "GET", data: {}, contentType: 'application/x-www-form-urlencoded; charset=UTF-8'};
  let ajax = $l.extend(options, defaults);
  const xhr = new XMLHttpRequest();
  xhr.open(ajax["method"], ajax["url"]);
  xhr.onload = function (){
    if (xhr.status === 200) {
      ajax["success"]();
    } else {
      ajax["error"]();
    }
  };

  const optionalData = ajax["data"];
  xhr.send(optionalData);
};

var domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

window.$l(() => alert('document ready!'));
