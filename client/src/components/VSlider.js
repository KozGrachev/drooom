import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  ChakraProvider
} from "@chakra-ui/react"

export const VSlider = (props) => {

  return (
    <ChakraProvider>
      <Slider className="slider"
        min={90}
        max={170}
        defaultValue={120}
        orientation="vertical"
        onChange={(val) => props.handleChange(val)}>
        <SliderTrack bg="red.100">
          <SliderFilledTrack bg="tomato" />
        </SliderTrack>
        <SliderThumb boxSize={6}>
        </SliderThumb>
      </Slider>
    </ChakraProvider>
  )
}