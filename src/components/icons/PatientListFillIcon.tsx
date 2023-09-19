import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

export const PatientListFillIcon = (props: SvgIconProps) => {
  props = { ...props, htmlColor: props.htmlColor || "inherit" };
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="48"
        viewBox="0 -960 1999 1999"
        width="48">
        <path d="M640-403q-51 0-84.5-33.5T522-521q0-51 33.5-84.5T640-639q51 0 84.5 33.5T758-521q0 51-33.5 84.5T640-403ZM400-160v-66q0-19 9-36t24-24q45-32 98.5-47.5T640-349q55 0 108 17t99 46q14 10 23.5 25.5T880-226v66H400ZM120-410v-60h306v60H120Zm0-330v-60h473v60H120Zm349 165H120v-60h380q-11 13-18.5 28T469-575Z" />
      </svg>
    </SvgIcon>
  );
};

export default PatientListFillIcon;
