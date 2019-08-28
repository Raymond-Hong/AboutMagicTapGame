(function(global){
  let caclNeed = function () {
    if (this.myAttack <= this.defense){
        this.needBlood = '打不过'
    }else{
      this.needBlood = (Math.ceil(this.blood / (this.myAttack-this.defense))-1) * (this.attack - this.myDefense)|0;
      if(this.needBlood < 0){
        this.needBlood = 0
      }
    }
  }
  let caclTransNeed = function () {
    if (this.myAttack <= this.defense){
        this.needBlood = '打不过'
    }else{
      this.needBlood = (Math.ceil(this.blood / (this.myAttack-this.defense))) * (this.attack - this.myDefense)|0;
      if(this.needBlood < 0){
        this.needBlood = 0
      }
    }
  }
  
  function updateNeedBlood (playerData) {
    let myData = Object.assign({}, this, playerData);
    caclNeed.call(myData);
    // debugger
    if (this.count == 0) {
      this.needBlood = 0;
    }else if (typeof myData.needBlood === "number") {
      this.needBlood = myData.needBlood*this.count;
    } else {
      this.needBlood = myData.needBlood;
    }
  }
  
  const caclTotal = (obj, playerData) => {
    return Object.keys(obj).reduce((pre, key)=> {
      updateNeedBlood.call(obj[key], playerData);
      // debugger
      if (typeof pre != 'number') {
        return '打不过';
      } else {
        if ( obj[key].needBlood && typeof obj[key].needBlood != 'number') {
          return '打不过';
        } else {
          return pre + (obj[key].needBlood || 0);
        }
      }
    }, 0);
  }

  
  function transAttack(e, playerData) { // 调用Boss反先机制的计算
    let a = '反先攻中', b = '反先攻';
    transAttack = function (e) {
      [caclTransNeed, caclNeed] = [caclNeed, caclTransNeed];
      [a, b] = [b, a];
      e.target.innerHTML = b;
      playerData.proxy.myAttack = playerData.proxy.myAttack;
    }
    transAttack(e);
    return transAttack;
  }

  global._blood = {
    updateNeedBlood,
    caclTransNeed,
    caclNeed,
    caclTotal,
    transAttack
  }
}(window))