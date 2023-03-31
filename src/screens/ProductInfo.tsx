import { Flex, Text, Box, Image, Link } from "@chakra-ui/react";

interface ProductInfoProps {
  productData: {
    title: string;
    asin: string;
    imageUrl: string;
    salesRank: number;
    offerCount: number;
    salesRankContextName: string;
  } | null;
}

function ProductInfo({ productData }: ProductInfoProps) {
  if (!productData) {
    return null;
  }

  const shortenedTitle =
    productData.title.length > 30
      ? productData.title.substring(0, 30) + "..."
      : productData.title;

  return (
    <Flex justifyContent="center">
      <Box borderRadius="md" p={4} mb={8}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Product Information
        </Text>
        <Flex alignItems="center">
          <Image
            src={productData.imageUrl}
            alt={productData.title}
            maxW="200px"
            mr={4}
          />
          <Box>
            <Link href={`https://www.amazon.com/dp/${productData.asin}`}>
              <Text fontSize="lg" mb={2}>
                {shortenedTitle}
              </Text>
            </Link>
            <Flex alignItems="baseline">
              <Text fontSize="md" mr={2}>
                Sales Rank: {productData.salesRank}
              </Text>
              <Box w="1px" h="20px" bg="gray.200" mx={2} />
              <Text fontSize="md" mr={2}>
                Offers: {productData.offerCount}
              </Text>
              <Box w="1px" h="20px" bg="gray.200" mx={2} />
              <Text fontSize="md">
                Category: {productData.salesRankContextName}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}

export default ProductInfo;
