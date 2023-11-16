import express from "express";
import got from "got";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/api", async (req, res, next) => {
  try {
    const { asin, countryCode } = req.query;

    const response1 = await got(
      `https://sellercentral.amazon.com/rcpublic/productmatch?searchKey=${asin}&countryCode=${countryCode}&locale=en-US`,
      { responseType: "json" }
    );

    const response2 = await got(
      `https://sellercentral.amazon.com/rcpublic/getadditionalpronductinfo?countryCode=${countryCode}&asin=${asin}&fnsku=&searchType=GENERAL&locale=en-US`,
      { responseType: "json" }
    );

    // Check if price is defined before accessing amount
    const priceAmount = response2.body.data.price
      ? response2.body.data.price.amount
      : "0";

    const response3 = await got.post(
      `https://sellercentral.amazon.com/rcpublic/getfees?countryCode=US&locale=en-US`,
      {
        responseType: "json",
        json: {
          countryCode,
          itemInfo: {
            asin,
            glProductGroupName:
              response1.body.data.otherProducts.products[0].gl,
            packageLength: "0",
            packageWidth: "0",
            packageHeight: "0",
            dimensionUnit: "",
            packageWeight: "0",
            afnPriceStr: priceAmount,
            mfnPriceStr: priceAmount,
            mfnShippingPriceStr: "0",
            currency: "USD",
            isNewDefined: false,
          },
          programIdList: ["Core", "MFN"],
        },
      }
    );

    const coreProgramFees =
      response3.body.data.programFeeResultMap.Core.otherFeeInfoMap;
    const { title, imageUrl, salesRank, offerCount, salesRankContextName } =
      response1.body.data.otherProducts.products[0];
    const {
      FulfillmentFee: {
        total: { amount: FulfillmentFeeTotal },
      },
      ReferralFee: {
        total: { amount: ReferralFeeTotal },
      },
    } = coreProgramFees;
    const data = {
      title,
      imageUrl,
      salesRank,
      offerCount,
      salesRankContextName,
      asin,
      fulfillmentFeeTotal: FulfillmentFeeTotal,
      referralFeeTotal: ReferralFeeTotal,
      salePrice: priceAmount,
    };

    res.json(data);
  } catch (error) {
    next(error);
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
