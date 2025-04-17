import { Paper, Text, Button, Title } from "@mantine/core";
import classes from "./styles.module.css";
import useCharacterStore from "@/store/useCharacterStore";

const UiCard = ({ ...data }: any) => {
  const { setId } = useCharacterStore();

  return (
    <Paper
      p="xl"
      shadow="md"
      radius="md"
      style={{ backgroundColor: "#ff00cc" }}
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size="sm">
          Age: {data.age}
        </Text>
        <Title order={3} className={classes.title}>
          {data.name}
        </Title>
      </div>
      <Button variant="white" color="dark" onClick={() => setId(data.id)}>
        View details
      </Button>
    </Paper>
  );
};

export default UiCard;
