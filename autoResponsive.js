(function (global) {
  const replace = function ($) {
    let arr = $.replace(/{{|}}/gm, '').split('.');
    return arr.reduce((p,v) => p[v],this) || 0
  }
  const renderText = function (oEl, oParent, index, el, parent) {
    parent.childNodes[index].data = oEl.nodeValue.replace(/{{[\s]*([A-z\u4e00-\u9fa5]+)([.][A-z]+)*[\s]*}}/gm, replace.bind(this));
  }
  const aboutNodeType = {
    1:function (oEl, oParent, index, el, parent) {
      deal.call(this, el.childNodes, el, oEl.childNodes, oEl);
      if (oEl.attributes.length) {
        deal.call(this, el.attributes, el, oEl.attributes, oEl)
      }
    },
    2:function (oEl, oParent, index, el, parent) {
      if (/^data-model/.test(oEl.name)) {
        let arr = oEl.nodeValue.replace(/{{|}}/gm, '').split('.');
        let self = this, len = arr.length
        for (let i=0; i<len-1;i++){
          self = self[arr[i]];
        }
        parent.oninput = parent.oninput || function(a,b){
          self[arr[len - 1]] = ~~parent.value
        };
        parent.value = self[arr[len - 1]] || 0;
      }
    },
    3:renderText
  }
  function deal (root,parent,oRoot,oParent) {
    [...oRoot].forEach((el,index) => {
      if (aboutNodeType[el.nodeType]) {
        aboutNodeType[el.nodeType].call(this, el,oParent,index,root[index],parent);
      }else{
        // el && console.log(el);
      }
    })
  }
  
  function Render () {
  }
  Render.prototype.init = function (data, container, callBack) {
    const originContainer = [document.createElement(container[0].nodeName)];
      originContainer[0].innerHTML = container[0].innerHTML;
    let handler = {
        get: function(target, key){
            return Reflect.get(target, key)
        },
        set: function(target, key, val, receiver){
          Reflect.set(target, key, val);
          callBack && callBack(key, val);
          deal.call(proxyData, container, null, originContainer);
        }
    };
    const dealProxy = obj => {
      Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Object) {
          dealProxy(obj[key]);
          obj[key] = new Proxy(obj[key], handler);
        }
      })
    }
    dealProxy(data);
    let proxyData = new Proxy(data, handler);
    data.proxy = proxyData;
    deal.call(proxyData, container, null, originContainer);
  }
  global._$ = new Render();

}(window));