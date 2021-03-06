
module.exports = {
  checkCode : async (code) => {
    try {
      let result = await db.ShopCode.findOne({
        where:{
          code: code
        }
      });
      return result;
    } catch (e) {
      throw e;
    }
  },

  use: async ({code, price}) => {
    try {
      let result = await db.ShopCode.findOne({
        where:{
          code: code,
          $or:[{
            restrictionDate: 'on'
          },{
            startDate:{
              $lte: new Date()
            },
            endDate:{
              $gte: new Date()
            },
          }],
          restriction:{
            $lte: price
          }
        }
      });
      let discountAmount;
      if(result){
        let originPrice = price;
        if(result.type == 'price')
          price -= result.description;
        else
          price *= (result.description*0.01);
        discountAmount = originPrice - price;
      }
      else{
        throw new Error("請再次確認折扣碼活動時間、活動金額");
      }
      return {code, price, discountAmount};
    } catch (e) {
      throw e;
    }
  }
}
