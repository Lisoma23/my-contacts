export default function Home() {
  const firstname = localStorage.getItem("userFirstname");
  return <h1>Welcome {firstname} !</h1>;
}
