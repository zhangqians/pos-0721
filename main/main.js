'use strict';

function formatTags(tags) {
  return tags.map((tag) => {
    if (tag.includes('-')) {
      let [barcode, count] = tag.split('-');
      return {
        barcode,
        count: parseFloat(count)
      }
    } else {
      return {
        barcode: tag,
        count: 1
      }
    }
  })
}

function _getExistentElementByBarcode(array, barcode) {
  return array.find((element) => element.barcode === barcode);
}

function countBarcodes(formattedTags) {
  return formattedTags.reduce((result, formattedTag) => {
    let found = _getExistentElementByBarcode(result, formattedTag.barcode);
    if (found) {
      found.count += formattedTag.count;
    } else {
      result.push(formattedTag);
    }
    return result;
  }, []);
}

function buildCartItems(countedBarcodes, allItems) {
  return countedBarcodes.map(({barcode, count}) => {
    let item = _getExistentElementByBarcode(allItems, barcode);
    return {
      barcode,
      name: item.name,
      unit: item.unit,
      price: item.price,
      count
    }
  })
}

function _fixFloat(number) {
  return parseFloat(number.toFixed(2))
}

function buildPromotedItems(cartItems, promotions) {
  let promotion = promotions.find((promotion)=> promotion.type === '单品批发价出售');
  return cartItems.map((cartItem)=> {
    let hasPromoted = promotion.barcodes.includes(cartItem.barcode) && cartItem.count > 10;
    let totalPrice = cartItem.price * cartItem.count;
    let saved = hasPromoted ? totalPrice * 0.05 : 0;
    let payPrice = totalPrice - saved;
    return Object.assign({}, cartItem, {
      payPrice, saved: _fixFloat(saved)
    })
  })
}

function calculateTotalPrices(promotedItems) {
  return promotedItems.reduce((result, {payPrice, saved}) => {
    result.totalPayPrice += payPrice;
    result.totalSaved += saved;
    return result;
  }, {totalPayPrice: 0, totalSaved: 0})
}

function buildReceipt(promotedItems, totalPrices) {
  let savedItems = promotedItems.filter((promotedItem) => promotedItem.saved > 0)
    .map(({name, count, unit}) => {
      return {name, count, unit}
    });
  return {
    promotedItems: promotedItems.map(({name, unit, price, count, payPrice, saved}) => {
      return {name, unit, price, count, payPrice, saved}
    }),
    savedItems,
    totalPayPrice: totalPrices.totalPayPrice,
    totalSaved: totalPrices.totalSaved
  }

}

function buildReceiptString(receipt) {
  let lines = ['***<没钱赚商店>购物清单***'];
  receipt.promotedItems.forEach(({name, count, unit, price, payPrice, saved})=> {
    let line = `名称：${name}，数量：${count}${unit}，单价：${price.toFixed(2)}(元)，小计：${payPrice.toFixed(2)}(元)`;
    if (saved > 0) {
      line += `，优惠：${saved.toFixed(2)}(元)`
    }
    lines.push(line)
  });


  let hasSaved = receipt.savedItems.length > 0;
  if (hasSaved) {
    lines.push('----------------------');
    lines.push('批发价出售商品：');
    receipt.savedItems.forEach(({name, count, unit}) => {
      lines.push(`名称：${name}，数量：${count}${unit}`);
    });
  }

  lines.push('----------------------');
  lines.push(`总计：${receipt.totalPayPrice.toFixed(2)}(元)`);
  if (hasSaved) {
    lines.push(`节省：${receipt.totalSaved}(元)`);
  }
  lines.push('**********************');

  let receiptString = lines.join('\n');
  console.log(receiptString);
}

function printReceipt(tags) {
  let formattedTags = formatTags(tags);
  let countedBarcodes = countBarcodes(formattedTags);
  let allItems = loadAllItems();
  let cartItems = buildCartItems(countedBarcodes, allItems);
  let promotions = loadPromotions();
  let promotedItems = buildPromotedItems(cartItems, promotions);
  let totalPrices = calculateTotalPrices(promotedItems);
  let receipt = buildReceipt(promotedItems, totalPrices);
  let receiptString = buildReceiptString(receipt);
  console.log(receiptString);
}