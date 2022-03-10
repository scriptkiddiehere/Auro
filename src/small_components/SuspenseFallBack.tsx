import Loader from "./Loader";

interface SuspenseFallBackProps {
  img: boolean;
}
export default function SuspenseFallBack(
  props: React.PropsWithChildren<SuspenseFallBackProps>
) {
  return (
    <>
      <Loader img={props.img ? true : false} size="large" outlineColor="#000" />
    </>
  );
}

SuspenseFallBack.defaultProps = {
  img: false,
};
