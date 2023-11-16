import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/api", async (req, res, next) => {
  try {
    const { asin, countryCode } = req.query;

    const response1 = await axios.get(
      `https://sellercentral.amazon.com/rcpublic/productmatch?searchKey=${asin}&countryCode=${countryCode}&locale=en-US`
    );
    console.log(response1.data);

    const response2 = await axios.get(
      `https://sellercentral.amazon.com/rcpublic/getadditionalpronductinfo?countryCode=${countryCode}&asin=${asin}&fnsku=&searchType=GENERAL&locale=en-US`
    );

    const response3 = await axios.post(
      `https://sellercentral.amazon.com/rcpublic/getfees?countryCode=US&locale=en-US`,
      {
        countryCode,
        itemInfo: {
          asin,
          glProductGroupName: response1.data.data.otherProducts.products[0].gl,
          packageLength: "0",
          packageWidth: "0",
          packageHeight: "0",
          dimensionUnit: "",
          packageWeight: "0",
          afnPriceStr: response2.data.data.price.amount,
          mfnPriceStr: response2.data.data.price.amount,
          mfnShippingPriceStr: "0",
          currency: "USD",
          isNewDefined: false,
        },
        programIdList: ["Core", "MFN"],
      }
    );

    const coreProgramFees =
      response3.data.data.programFeeResultMap.Core.otherFeeInfoMap;
    const { title, imageUrl, salesRank, offerCount, salesRankContextName } =
      response1.data.data.otherProducts.products[0];
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
      salePrice: response2.data.data.price.amount,
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
