"use client";
import UiCarousel from "@/components/ui/carousel";
import Details from "@/components/ui/details";
import useCharacterStore from "@/store/useCharacterStore";
import { Box } from "@mantine/core";
import { useEffect } from "react";

interface IOwnProps {
  characters: Record<string, string | number>[];
  classes?: Record<string, string | number>[];
  skilss?: Record<string, string | number>[];
}

const CharatersPage = ({ characters, classes, skilss }: IOwnProps) => {
  const { id } = useCharacterStore();

  useEffect(() => {
    if (id) {
      const character = characters.find((item) => item.id === id);
      const idClass = character?.idClass;
      const idRace = character?.idRace;
    }
  }, [id]);

  return (
    <div className="relative w-full h-screen overflow-hidden mt-4">
      <UiCarousel data={characters} />
      <Box>
        <Details />
      </Box>
    </div>
  );
};

export default CharatersPage;
