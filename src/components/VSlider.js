import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react"

export const VSlider = (props) => {

  return (
    <>
      {/* <input className="slider" type="range" value={120} min="90" max="170" onChange={(e)=>props.setBpm(e.target.value)} /> */}
      <Slider className="slider"
        min={90}
        max={170}
        defaultValue={120}
        orientation="vertical"
        onChange={(val) => props.setBpm(val)}>
        <SliderTrack bg="red.100">
          <SliderFilledTrack bg="tomato" />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          {/* <Box color="tomato" as={MdGraphicEq} /> */}
        </SliderThumb>
      </Slider>
    </>
  )
}