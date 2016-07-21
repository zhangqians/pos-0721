'use strict';

describe('pos', () => {

  it('should print text for items has promoted', () => {

    const tags = [
      // 根据输出自行推断出合格的输入
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>购物清单***
名称：可口可乐，数量：11瓶，单价：3.00(元)，小计：31.35(元)，优惠：1.65(元)
名称：羽毛球，数量：5个，单价：1.00(元)，小计：5.00(元)
名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)
----------------------
批发价出售商品：
名称：可口可乐，数量：11瓶
----------------------
总计：47.35(元)
节省：1.65(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });

 it('should print text for items with no one has promoted', () => {

    const tags = [
      // 根据输出自行推断出合格的输入
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>购物清单***
名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：9.00(元)
名称：羽毛球，数量：5个，单价：1.00(元)，小计：5.00(元)
名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)
----------------------
总计：25.00(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });

})
;
