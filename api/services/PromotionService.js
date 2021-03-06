import moment from "moment";
import fs from 'fs';
import mime from "mime";
import util from "util";

/*
  PromotionService.js
*/

module.exports = {

  // findAll
  findAll: async () => {
    let promotions = await db.Promotion.findAll();
    return promotions;
  },
  // end findAll

  // create
  create: async (promotion) => {
    try {
      console.log('=== raw promotion ==>',promotion);

      if(promotion.discount =='')
        delete promotion.discount;
      if(promotion.price=='')
        delete promotion.price;

      let createdPromotion = await db.Promotion.create(promotion);
      let products = await* promotion.productGmIds.map(async (productGmId)=>{
        let findProductGm = await db.ProductGm.findById(productGmId);
        await createdPromotion.setProductGms([findProductGm]);
        return createdPromotion;
      });
      console.log('=== createdPromotion ==>',createdPromotion);

      let promotedProducts = await* promotion.productGmIds.map(async (productGmId)=>{
        let findProductGm = await db.ProductGm.findById(productGmId);
        await createdPromotion.setProductGms([findProductGm]);
        return createdPromotion;
      });

      return createdPromotion;
    } catch (e) {
      console.log('=== create err ==>',e.stack);
      return false;
    }
  },
  // end create

  // update
  update: async (promotion) => {
    try {
      console.log('=== raw promotion ==>',promotion);
      let updatePromoiton = await db.Promotion.find({
        where: {
          id: promotion.id
        }
      });
      console.log('=== updatePromoiton ==>',updatePromoiton);
      updatePromoiton.title = promotion.title;
      updatePromoiton.description = promotion.description;
      updatePromoiton.type = promotion.type;
      updatePromoiton.startDate = promotion.startDate;
      updatePromoiton.endDate = promotion.endDate;
      if(promotion.discount == '' || promotion.discount==100){
        updatePromoiton.discount = 100;
      }
      else{
        updatePromoiton.discount = promotion.discount;
      }

      if(promotion.price == '' || promotion.price == 0){
        updatePromoiton.price = 0;
      }
      else{
        updatePromoiton.price = promotion.price;
      }
      updatePromoiton.discountType = promotion.discountType;

      let products = await* promotion.productGmIds.map(async (productGmId)=>{
        let findProductGm = await db.ProductGm.findById(productGmId);
        await updatePromoiton.setProductGms([findProductGm]);
        return updatePromoiton;
      });

      await updatePromoiton.save();
      return updatePromoiton;
    } catch (e) {
      console.log('=== update err ==>',e.stack);
      return false;
    }
  },
  // end update

  // delete
  delete: async (promotion) => {
    try {
      console.log('=== raw promotion ==>',promotion);
      let findProduct = await db.Product.findById(promotion.id);
      if (!findPromotion) {
        throw new Error('cant find this promotion! id is ==>',promotion.id);
      }
      await findPromotion.destroy();
      return true;
    } catch (e) {
      console.log('=== delete err ==>',e.stack);
      return false;
    }
  },
  // end delete

  // productPriceTransPromotionPrice
  productPriceTransPromotionPrice: async(date, products) => {
    try {
      // find all promotions within a specific date
      let findPromotions = await db.Promotion.findAll({
        where:{
          startDate: {
            lt: date
          },
          endDate: {
            gte: date
          }
        },
        include:[{
          model: db.ProductGm,
          required: true
        }]
      });
      // console.log('=== date ==>',date);

      // check each prduct
      if(!findPromotions.length) return products;
      if(!products.length) return products;

      products = products.map((product) => {
        // console.log('\n=== product.id ==>',product.id);
        // console.log('=== old product.price ==>',product.price);
        // set new price
        findPromotions.forEach((promotion) => {
          // console.log('=== promotion.id ==>',promotion.id);
          // check each promotion
          for(var i=0;i<findPromotions.length;i++){
            // check each ProductGmId
            for(var j=0;j<findPromotions[i].ProductGms.length;j++){
              let thisProductGmId = findPromotions[i].ProductGms[j].id;
              let startDate = findPromotions[i].startDate;
              let endDate = findPromotions[i].endDate;
              if(thisProductGmId == product.ProductGmId){
                // console.log('=== thisProductGmId ==>',thisProductGmId);
                if((date>startDate) && (date<endDate)){
                  product.originPrice = product.price;

                  let duration = moment.duration(moment(endDate).diff(moment(date)));

                  product.promotionCountDown =
                    `${duration.get("days")} 天 ${duration.get("hours") +":"+ duration.get("minutes") +":"+ duration.get("seconds")}`


                  if(promotion.discountType == 'discount'){
                    // console.log('=== promotion.discount ==>',promotion.discount);
                    product.price = parseInt(product.price * promotion.discount);
                  }else if(promotion.discountType == 'price'){
                    // console.log('=== promotion.price ==>',promotion.price);
                    product.price = parseInt(product.price - promotion.price);
                  }

                  product.status = 'sale';
                }
              } // end if
            } // end for j
          } // end for i
        });
        // console.log('=== new product.price ==>',product.price);

        return product;
      });
      return products;
    } catch (e) {
      console.log('=== productPriceTransPromotionPrice err ==>',e.stack);
      throw e;
    }
  }
  // end productPriceTransPromotionPrice

};
