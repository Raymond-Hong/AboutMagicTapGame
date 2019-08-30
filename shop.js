(function (global) {
  // let n = 0;
  function getNeedPaidByTimes(n) {
    return 10 * n * (n - 1) + 20
  }
  function isOriginNeedPaid(money) {
    for (let i = 1; ; i++) {
      if (getNeedPaidByTimes(i) > money) {
        return false;
      } else if (getNeedPaidByTimes(i) == money) {
        return true;
      }
    }
  }
  function getTimesByNeedPaid(money) {
    for (let i = 1; ; i++) {
      if (getNeedPaidByTimes(i) >= money) {
        return i;
      }
    }
  }
  function canByTimesAndLeft(totalMoney, originMoney) {
    let t = 0;
    let paidT = getTimesByNeedPaid(originMoney);
    while (totalMoney > originMoney) {
      t++;
      totalMoney -= originMoney;
      originMoney = getNeedPaidByTimes(++paidT);
    }
    return {
      left: totalMoney,
      times: t
    };
  }

  function dealAddCase(t, ADD) {
    let allCase = [];
    for (let i = 0; i <= t; i++) {
      let mimic = Object.assign({}, this);
      addAttackTimes.call(mimic, i);
      addDefenseTimes.call(mimic, t - i);
      mimic.addAttack = i;
      mimic.addDefense = t - i;
      allCase.push(mimic);
    }
    allCase.forEach(player => {
      player.needTotalBlood = _blood.caclTotal(htmlData, player);
    })
    allCase.sort((p1, p2) => {
      if (typeof p1.needTotalBlood == 'string') {
        return 1;
      } else if (typeof p2.needTotalBlood == 'string') {
        return -1;
      } else {
        return p1.needTotalBlood - p2.needTotalBlood;
      }
    });
    Object.assign(this, allCase[0]);
    this.proxy.myAttack = this.myAttack;
    function addAttackTimes(t) {
      for (let i = 0; i < t; i++) {
        addAttackSimulation.call(this)
      }
      // this.myAttack *= 1.03;
      // this.myAttack = this.myAttack|0;
      function addAttackSimulation() {
        this.myAttack += ADD;
      }
    }
    function addDefenseTimes(t) {
      for (let i = 0; i < t; i++) {
        addDefenseSimulation.call(this)
      }
      // this.myDefense *= 1.03;
      // this.myDefense = this.myDefense|0;
      function addDefenseSimulation() {
        this.myDefense += ADD * 2;
      }
    }
  }
  global._paid = {
    getNeedPaidByTimes,
    getTimesByNeedPaid,
    canByTimesAndLeft,
    isOriginNeedPaid,
    dealAddCase
  }
}(window));