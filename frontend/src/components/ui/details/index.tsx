import useCharacterStore from "@/store/useCharacterStore";
import { Box } from "@mantine/core";

const Details = () => {
  const { id } = useCharacterStore();

  return (
    <Box className="h-250 w-full bg-amber-500 mt-4">
      Character details: {id}
    </Box>
  );
};

export default Details;
