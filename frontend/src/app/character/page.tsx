import CharatersPage from "@/components/pages/characters";
import { data } from "@/app/character/consts";
import { getCharacters } from "./actions";

const Page = async () => {
  const characters = await getCharacters();

  return <CharatersPage characters={characters} />;
};

export default Page;
