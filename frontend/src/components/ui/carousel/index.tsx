import { Carousel } from "@mantine/carousel";
import { useState } from "react";
import UiCard from "../card";

interface IOwnProps {
  data: Record<string, string | number>[];
}

const UiCarousel = ({ data }: IOwnProps) => {
  const slides = data.map((item, index) => (
    <Carousel.Slide key={item.id}>
      <UiCard {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize={"33%"}
      slidesToScroll={1}
      controlSize={28}
      slideGap={"md"}
      align="start"
      loop
    >
      {slides}
    </Carousel>
  );
};

export default UiCarousel;
