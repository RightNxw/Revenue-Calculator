import { useState } from "react";
import { FaGithub } from "react-icons/fa";

import {
  Flex,
  Text,
  Input,
  Select,
  Button,
  Spinner,
  Box,
} from "@chakra-ui/react";
import getProductData from "../hooks/getProductInfo";
import ProductInfo from "./ProductInfo";
import RevenueCalculator from "./RevenueCalculator";

function HomePage() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productData, setProductData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };

  const handleCountrySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const handleSearchButtonClick = async () => {
    if (!searchInput) {
      setError("Please enter an ASIN to search.");
      return;
    }
    if (!selectedCountry) {
      setError("Please select a country.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await getProductData(searchInput, selectedCountry);
      if (!data) {
        throw new Error("No data found.");
      }
      setProductData(data);
    } catch (error: any) {
      setError(error.message || "Error fetching product info.");
    }
    setIsLoading(false);
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg="gray.200"
      h="100vh"
      color="black"
    >
      <Text fontSize="4xl" fontWeight="bold" color="black" mb={8}>
        Revenue Calculator
      </Text>
      <Flex mb={8}>
        <Input
          type="text"
          placeholder="Search by ASIN"
          size="md"
          variant="flushed"
          mr={4}
          borderColor="black"
          value={searchInput}
          onChange={handleSearchInputChange}
          _placeholder={{ color: "gray.500" }}
        />
        <Select
          size="md"
          value={selectedCountry}
          onChange={handleCountrySelect}
          variant="flushed"
          placeholder="Select country"
          borderColor="black"
          mr={4}
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="MX">Mexico</option>
          <option value="BR">Brazil</option>
        </Select>
        <Button onClick={handleSearchButtonClick} size="md">
          {isLoading ? (
            <Flex alignItems="center">
              Loading...
              <Spinner mr={2} size="sm" color="black" />
            </Flex>
          ) : (
            "Search"
          )}
        </Button>
      </Flex>
      {error && (
        <Text fontSize="md" color="red.500" mb={8}>
          {error}
        </Text>
      )}

      <Flex flexDirection={["column", "row"]} alignItems="center">
        {productData && <ProductInfo productData={productData} />}
        <Box flex="1" mb={8}>
          {productData && <RevenueCalculator productData={productData} />}
        </Box>
      </Flex>

      <Box mt={8} textAlign="center">
        <Flex alignItems="center" justifyContent="center" mb={2}>
          <Text fontSize="sm" color="gray.500" mr={2}>
            Made by Ricardo
          </Text>
          <a
            href="https://github.com/RightNxw/Revenue-Calculator"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub
              className="inline-block h-4 w-4 ml-2 mr-1"
              color="gray.500"
            />
          </a>
        </Flex>
      </Box>
    </Flex>
  );
}

export default HomePage;
