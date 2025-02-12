import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to BetGanji
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            <Link 
              href="/register" 
              className="text-blue-600 hover:underline"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}