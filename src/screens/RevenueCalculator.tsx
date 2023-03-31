import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Box,
  Input,
  InputGroup,
  Stack,
  InputLeftElement,
  Button,
} from "@chakra-ui/react";

export interface RevenueCalculatorProps {
  productData: {
    salesRankContextName: string;
    fulfillmentFeeTotal: number;
    referralFeeTotal: number;
    salePrice: number;
  } | null;
}

function RevenueCalculator(props: RevenueCalculatorProps) {
  const [isFbm, setIsFbm] = useState<boolean>(true);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(
    props.productData?.salePrice || 0
  );
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [showFees, setShowFees] = useState<boolean>(false);
  const [revenue, setRevenue] = useState<number>(0);

  const handleCostPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    setCostPrice(isNaN(value) ? 0 : value);
  };
  const handleShippingPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    setShippingCost(isNaN(value) ? 0 : value);
  };

  const handleSalePriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    setSalePrice(isNaN(value) ? 0 : value);
  };

  const handleShowFees = () => {
    setShowFees(!showFees);
  };

  const calculateRevenue = () => {
    let totalFees = 0;
    if (!isFbm && props.productData) {
      totalFees =
        props.productData.fulfillmentFeeTotal +
        props.productData.referralFeeTotal;
    } else if (isFbm && props.productData) {
      totalFees = shippingCost + props.productData.referralFeeTotal;
    }
    const revenue = salePrice - costPrice - totalFees;
    setRevenue(revenue);
  };

  useEffect(() => {
    calculateRevenue();
  }, [isFbm, costPrice, salePrice, shippingCost, props.productData]);

  return (
    <Flex justifyContent="center">
      <Box borderRadius="md" p={4} mb={8} height="250px">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {isFbm ? "FBM" : "FBA"}
        </Text>
        <Flex flexDirection="column">
          <Stack spacing={4}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="black"
                fontSize="1.2em"
                children="$"
              />
              <Input
                borderColor="black"
                type="number"
                placeholder="Sale Price"
                onChange={handleSalePriceChange}
                variant="flushed"
                value={salePrice}
                _placeholder={{ color: "gray.500" }}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="black"
                fontSize="1.2em"
                children="$"
              />
              <Input
                borderColor="black"
                type="number"
                placeholder="Cost Price"
                onChange={handleCostPriceChange}
                variant="flushed"
                _placeholder={{ color: "gray.500" }}
              />
            </InputGroup>
            {isFbm && (
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="black"
                  fontSize="1.2em"
                  children="$"
                />
                <Input
                  borderColor="black"
                  type="number"
                  placeholder="Shipping Cost"
                  onChange={handleShippingPriceChange}
                  variant="flushed"
                  _placeholder={{ color: "gray.500" }}
                />
              </InputGroup>
            )}
          </Stack>

          <Flex justifyContent="space-between" mt={5}>
            <Button
              onClick={() => setIsFbm(!isFbm)}
              variant="link"
              mr={4}
              color="black"
            >
              {isFbm ? "Switch to FBA" : "Switch to FBM"}
            </Button>
            <Button onClick={handleShowFees} variant="link" color="black">
              Show Fees
            </Button>
          </Flex>

          {showFees && (
            <Box mt={4}>
              <Text fontWeight="bold" color="black">
                Fees:
              </Text>
              <ul>
                <li>
                  Fulfillment fee: ${props.productData?.fulfillmentFeeTotal}
                </li>
                <li>Referral fee: ${props.productData?.referralFeeTotal}</li>
              </ul>
            </Box>
          )}

          <Text
            mt={4}
            fontWeight="bold"
            color={revenue >= 0 ? "green.500" : "red.500"}
          >
            Revenue:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(revenue)}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}

export default RevenueCalculator;
