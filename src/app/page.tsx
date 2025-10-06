type Props = {
  title: string;
};

const Component = ({ title }: Props) => {
  console.log(title);
  return (
    <>
      <h2>Compoenente</h2>
    </>
  );
};

export default function Home() {
  return (
    <>
      <h1>HOME</h1>
      <Component title={1} />
    </>
  );
}
