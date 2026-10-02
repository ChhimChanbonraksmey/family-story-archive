import AuthForm from "../../components/AuthForm.js";

export default async function LoginPage({ searchParams }) {
  const { confirmation, next } = await searchParams;
  const redirectTo = next === "/contribute" ? "/contribute" : "/";
  return (
    <AuthForm
      mode="login"
      confirmationFailed={confirmation === "failed"}
      redirectTo={redirectTo}
    />
  );
}
