import AuthForm from "../../components/AuthForm.js";

export default async function LoginPage({ searchParams }) {
  const { confirmation } = await searchParams;
  return <AuthForm mode="login" confirmationFailed={confirmation === "failed"} />;
}
