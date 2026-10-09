import PasswordResetRequestForm from "../../components/PasswordResetRequestForm.js";

export default async function ForgotPasswordPage({ searchParams }) {
  const { recovery } = await searchParams;
  return <PasswordResetRequestForm recoveryFailed={recovery === "failed"} />;
}
